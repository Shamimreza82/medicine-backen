import 'dotenv/config';

import { createHash, randomUUID } from 'node:crypto';

import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { OllamaService } from '@/shared/services/ollama.service';

interface GenericDocument {
  sourceType: 'GENERIC';
  sourceId: string;
  title: string;
  content: string;
  checksum: string;
  metadata: Record<string, unknown>;
}

interface ExistingEmbeddingRow {
  sourceId: string;
  checksum: string;
}

const medicineSourceInclude = Prisma.validator<Prisma.DrugGenericInclude>()({
  brands: {
    include: {
      company: true,
    },
  },
  indicationGenerics: {
    include: {
      indication: true,
    },
  },
  therapeuticGenerics: {
    include: {
      therapeutic: true,
    },
  },
  pregnancyCategory: true,
});

type GenericSource = Prisma.DrugGenericGetPayload<{
  include: typeof medicineSourceInclude;
}>;

const truncateList = (values: string[], limit = 8) => values.slice(0, limit).join(', ');

const buildGenericContent = (generic: GenericSource) => {
  const indications = generic.indicationGenerics.map((item) => item.indication.name);
  const brandNames = generic.brands.map((item) => item.name);

  return [
    `Generic name: ${generic.name}`,
    generic.indication ? `Indication: ${generic.indication}` : null,
    generic.modeOfAction ? `Mechanism of action: ${generic.modeOfAction}` : null,
    generic.adultDose ? `Adult dose: ${generic.adultDose}` : null,
    generic.childDose ? `Child dose: ${generic.childDose}` : null,
    generic.administration ? `Administration: ${generic.administration}` : null,
    generic.precaution ? `Precaution: ${generic.precaution}` : null,
    generic.sideEffect ? `Side effects: ${generic.sideEffect}` : null,
    generic.interaction ? `Interactions: ${generic.interaction}` : null,
    indications.length > 0 ? `Mapped Indications: ${truncateList(indications)}` : null,
    generic.pregnancyCategory
      ? `Pregnancy Category: ${generic.pregnancyCategory.name}; ${generic.pregnancyCategory.description}`
      : null,
    generic.pregnancyCategoryNote ? `Pregnancy Note: ${generic.pregnancyCategoryNote}` : null,
    brandNames.length > 0 ? `Brands: ${truncateList(brandNames)}` : null,
  ]
    .map((line) => line?.trim())
    .filter((line): line is string => Boolean(line))
    .join('\n');
};

const buildGenericDocument = (generic: GenericSource): GenericDocument => {
  const content = buildGenericContent(generic);

  return {
    sourceType: 'GENERIC',
    sourceId: String(generic.id),
    title: generic.name,
    content,
    checksum: createHash('sha256').update(content).digest('hex'),
    metadata: {
      id: generic.id,
      name: generic.name,
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
  const existingRows = await prisma.$queryRawUnsafe<{ sourceId: string }[]>(
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
  const generics = await prisma.drugGeneric.findMany({
    include: medicineSourceInclude,
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

  await deleteStaleEmbeddings(generics.map((generic) => String(generic.id)));

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
