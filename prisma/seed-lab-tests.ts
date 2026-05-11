import fs from 'fs';
import path from 'path';

import { Prisma, type PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

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

export const importLabTests = async (client: PrismaClient) => {
  const rows = readLabTestsCsv();

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

    await client.labTest.upsert({
      where: { slug },
      update: data,
      create: {
        ...data,
        slug,
      },
    });
  }

  console.log('Lab tests import completed');
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
