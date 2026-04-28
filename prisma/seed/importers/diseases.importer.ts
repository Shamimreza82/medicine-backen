import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toBoolean, toNullableString, toSlug } from '../helpers/normalize';
import { DiseaseCsvRow } from '../helpers/parsers';

export const importDiseases = async (prisma: PrismaClient) => {
  const rows = readCsv<DiseaseCsvRow>('diseases.csv');

  for (const row of rows) {
    await prisma.disease.upsert({
      where: { slug: toSlug(row.slug) },
      update: {
        name: row.name.trim(),
        code: toNullableString(row.code),
        description: toNullableString(row.description),
        category: toNullableString(row.category),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
      create: {
        name: row.name.trim(),
        slug: toSlug(row.slug),
        code: toNullableString(row.code),
        description: toNullableString(row.description),
        category: toNullableString(row.category),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
    });
  }

  console.log(`Imported diseases: ${rows.length}`);
};