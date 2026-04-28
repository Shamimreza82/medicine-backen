import fs from 'fs';
import path from 'path';

import { Prisma, type PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

import { getLabTestIndex } from '@/bootstrap/meilisearch';
import { prisma } from '@/bootstrap/prisma';

interface LabTestRow {
  name?: string;
  slug?: string;
  shortName?: string;
  category?: string;
  description?: string;
  specimen?: string;
  preparation?: string;
  normalRange?: string;
  unit?: string;
  isActive?: string;
  metadata?: string;
}

interface LabTestSearchDocument {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  category: string | null;
  description: string | null;
  specimen: string | null;
  preparation: string | null;
  normalRange: string | null;
  unit: string | null;
  isActive: boolean;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

interface MeiliTaskResult {
  uid: number;
  status: string;
  error: unknown;
}

const csvFilePath = path.join(process.cwd(), 'data', 'lab_tests.csv');

const cleanValue = (value?: string): string | null => {
  const trimmed = value?.trim();

  if (!trimmed) return null;

  return trimmed;
};

const parseBoolean = (value?: string): boolean => {
  const trimmed = value?.trim().toLowerCase();

  if (!trimmed) return true;

  return ['true', '1', 'yes', 'y'].includes(trimmed);
};

const parseMetadata = (value?: string): Prisma.InputJsonValue | typeof Prisma.DbNull => {
  const trimmed = value?.trim();

  if (!trimmed) return Prisma.DbNull;

  try {
    return JSON.parse(trimmed) as Prisma.InputJsonValue;
  } catch {
    throw new Error(`Invalid metadata JSON: ${trimmed}`);
  }
};

const readLabTestsCsv = (): LabTestRow[] => {
  const content = fs.readFileSync(csvFilePath, 'utf-8');

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
};

const assertMeiliTaskSucceeded = (task: MeiliTaskResult) => {
  if (task.status === 'failed' || task.status === 'canceled') {
    throw new Error(`Meilisearch task ${task.uid} ${task.status}: ${JSON.stringify(task.error)}`);
  }
};

const indexLabTests = async (documents: LabTestSearchDocument[]) => {
  if (documents.length === 0) return;

  const index = await getLabTestIndex();

  const documentsTask = index.addDocuments(documents, { primaryKey: 'slug' });
  assertMeiliTaskSucceeded(await documentsTask.waitTask({ timeout: 30_000 }));

  const settingsTask = index.updateSettings({
    searchableAttributes: ['name', 'shortName', 'slug', 'category', 'description', 'specimen'],
    filterableAttributes: ['category', 'specimen', 'isActive'],
    displayedAttributes: ['*'],
  });
  assertMeiliTaskSucceeded(await settingsTask.waitTask({ timeout: 30_000 }));

  console.log(`Indexed ${documents.length} lab tests in Meilisearch`);
};

export const importLabTests = async (client: PrismaClient) => {
  const rows = readLabTestsCsv();
  const searchDocuments: LabTestSearchDocument[] = [];

  console.log(`Found ${rows.length} lab tests in CSV`);

  for (const [index, row] of rows.entries()) {
    const name = cleanValue(row.name);
    const slug = cleanValue(row.slug);

    if (!name || !slug) {
      throw new Error(`Missing required name or slug at CSV row ${index + 2}`);
    }

    const data = {
      name,
      shortName: cleanValue(row.shortName),
      category: cleanValue(row.category),
      description: cleanValue(row.description),
      specimen: cleanValue(row.specimen),
      preparation: cleanValue(row.preparation),
      normalRange: cleanValue(row.normalRange),
      unit: cleanValue(row.unit),
      isActive: parseBoolean(row.isActive),
      metadata: parseMetadata(row.metadata),
    };

    const labTest = await client.labTest.upsert({
      where: { slug },
      update: data,
      create: {
        ...data,
        slug,
      },
    });

    searchDocuments.push({
      id: labTest.id,
      name: labTest.name,
      slug: labTest.slug,
      shortName: labTest.shortName,
      category: labTest.category,
      description: labTest.description,
      specimen: labTest.specimen,
      preparation: labTest.preparation,
      normalRange: labTest.normalRange,
      unit: labTest.unit,
      isActive: labTest.isActive,
      metadata: labTest.metadata,
      createdAt: labTest.createdAt.toISOString(),
      updatedAt: labTest.updatedAt.toISOString(),
    });
  }

  console.log('Lab tests import completed');

  await indexLabTests(searchDocuments);
};

if (require.main === module) {
  importLabTests(prisma)
    .catch((error) => {
      console.error('Lab tests import failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
