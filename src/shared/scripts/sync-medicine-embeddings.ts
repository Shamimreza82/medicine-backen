import 'dotenv/config';

import { createHash, randomUUID } from 'node:crypto';

import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { OllamaService } from '@/shared/services/ollama.service';

type GenericDocument = {
  sourceType: 'GENERIC';
  sourceId: string;
  title: string;
  content: string;
  checksum: string;
  metadata: Record<string, unknown>;
};

type ExistingEmbeddingRow = {
  sourceId: string;
  checksum: string;
};

const medicineSourceInclude = Prisma.validator<Prisma.GenericInclude>()({
  detail: true,
  brands: {
    include: {
      manufacturer: true,
      products: true,
    },
  },
  indications: {
    include: {
      disease: true,
    },
  },
  sideEffects: true,
  contraindications: true,
  pregnancyCategory: true,
  lactationWarning: true,
});

type GenericSource = Prisma.GenericGetPayload<{
  include: typeof medicineSourceInclude;
}>;

const joinNonEmpty = (items: Array<string | null | undefined>) =>
  items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .join('; ');

const truncateList = (values: string[], limit = 8) => values.slice(0, limit).join(', ');

const buildGenericContent = (generic: GenericSource) => {
  const indications = generic.indications.map((item) => item.disease.name);
  const sideEffects = generic.sideEffects.map((item) => item.effect);
  const contraindications = generic.contraindications.map((item) => item.condition);
  const brandNames = generic.brands.map((item) => item.name);
  const productSummaries = generic.brands.flatMap((brand) =>
    brand.products.map((product) => `${brand.name} ${product.strength} ${product.dosageForm}`),
  );

  return [
    `Generic name: ${generic.name}`,
    generic.scientificName ? `Scientific name: ${generic.scientificName}` : null,
    joinNonEmpty([
      generic.drugClass ? `Drug class: ${generic.drugClass}` : null,
      generic.therapeuticClass ? `Therapeutic class: ${generic.therapeuticClass}` : null,
    ]),
    generic.description ? `Description: ${generic.description}` : null,
    generic.mechanismOfAction ? `Mechanism of action: ${generic.mechanismOfAction}` : null,
    generic.dosageGuideline ? `Dosage guideline: ${generic.dosageGuideline}` : null,
    generic.detail?.overview ? `Overview: ${generic.detail.overview}` : null,
    generic.detail?.indicationSummary ? `Indication summary: ${generic.detail.indicationSummary}` : null,
    generic.detail?.adultDose ? `Adult dose: ${generic.detail.adultDose}` : null,
    generic.detail?.childDose ? `Child dose: ${generic.detail.childDose}` : null,
    generic.detail?.administration ? `Administration: ${generic.detail.administration}` : null,
    generic.detail?.monitoring ? `Monitoring: ${generic.detail.monitoring}` : null,
    generic.detail?.precaution ? `Precaution: ${generic.detail.precaution}` : null,
    generic.detail?.storageCondition ? `Storage: ${generic.detail.storageCondition}` : null,
    indications.length > 0 ? `Indications: ${truncateList(indications)}` : null,
    sideEffects.length > 0 ? `Side effects: ${truncateList(sideEffects)}` : null,
    contraindications.length > 0 ? `Contraindications: ${truncateList(contraindications)}` : null,
    generic.pregnancyCategory
      ? `Pregnancy: category ${generic.pregnancyCategory.category}; ${joinNonEmpty([generic.pregnancyCategory.warning, generic.pregnancyCategory.recommendation])}`
      : null,
    generic.lactationWarning
      ? `Lactation: ${generic.lactationWarning.riskLevel}; ${joinNonEmpty([generic.lactationWarning.warning, generic.lactationWarning.recommendation])}`
      : null,
    brandNames.length > 0 ? `Brands: ${truncateList(brandNames)}` : null,
    productSummaries.length > 0 ? `Products: ${truncateList(productSummaries)}` : null,
  ]
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line))
    .join('\n');
};

const buildGenericDocument = (generic: GenericSource): GenericDocument => {
  const content = buildGenericContent(generic);

  return {
    sourceType: 'GENERIC',
    sourceId: generic.id,
    title: generic.name,
    content,
    checksum: createHash('sha256').update(content).digest('hex'),
    metadata: {
      slug: generic.slug,
      name: generic.name,
      scientificName: generic.scientificName,
    },
  };
};

const toVectorLiteral = (embedding: number[]) =>
  `[${embedding.map((value) => Number(value).toFixed(12)).join(',')}]`;

const upsertEmbedding = async (document: GenericDocument, embedding: number[]) => {
  await prisma.$executeRawUnsafe(
    `
      INSERT INTO medicine_embeddings
        (id, source_type, source_id, title, content, checksum, metadata, embedding)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::vector)
      ON CONFLICT (source_type, source_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        checksum = EXCLUDED.checksum,
        metadata = EXCLUDED.metadata,
        embedding = EXCLUDED.embedding,
        updated_at = CURRENT_TIMESTAMP
    `,
    randomUUID(),
    document.sourceType,
    document.sourceId,
    document.title,
    document.content,
    document.checksum,
    JSON.stringify(document.metadata),
    toVectorLiteral(embedding),
  );
};

const deleteStaleEmbeddings = async (activeSourceIds: string[]) => {
  const existingRows = await prisma.$queryRawUnsafe<Array<{ sourceId: string }>>(
    `
      SELECT source_id AS "sourceId"
      FROM medicine_embeddings
      WHERE source_type = $1
    `,
    'GENERIC',
  );

  const activeIds = new Set(activeSourceIds);
  const staleIds = existingRows
    .map((row) => row.sourceId)
    .filter((sourceId) => !activeIds.has(sourceId));

  for (const staleId of staleIds) {
    await prisma.$executeRawUnsafe(
      `
        DELETE FROM medicine_embeddings
        WHERE source_type = $1 AND source_id = $2
      `,
      'GENERIC',
      staleId,
    );
  }
};

const run = async () => {
  const generics = await prisma.generic.findMany({
    include: medicineSourceInclude,
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  const existingEmbeddings = await prisma.$queryRawUnsafe<ExistingEmbeddingRow[]>(
    `
      SELECT source_id AS "sourceId", checksum
      FROM medicine_embeddings
      WHERE source_type = $1
    `,
    'GENERIC',
  );

  const existingChecksumMap = new Map(
    existingEmbeddings.map((item) => [item.sourceId, item.checksum]),
  );

  let syncedCount = 0;
  let skippedCount = 0;

  for (const generic of generics) {
    const document = buildGenericDocument(generic);
    const previousChecksum = existingChecksumMap.get(document.sourceId);

    if (previousChecksum === document.checksum) {
      skippedCount += 1;
      continue;
    }

    const embedding = await OllamaService.embedText(document.content);
    await upsertEmbedding(document, embedding);
    syncedCount += 1;
    console.log(`Synced embedding for ${document.title}`);
  }

  await deleteStaleEmbeddings(generics.map((generic) => generic.id));

  console.log(`Embedding sync completed. Synced: ${syncedCount}, skipped: ${skippedCount}`);
};

run()
  .catch((error) => {
    console.error('Embedding sync failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
