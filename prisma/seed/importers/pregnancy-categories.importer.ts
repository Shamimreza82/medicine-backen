import { PrismaClient, PregnancyRiskLevel } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { normalizeEnum, toNullableString, toSlug } from '../helpers/normalize';
import { PregnancyCategoryCsvRow } from '../helpers/parsers';

const allowed = ['A', 'B', 'C', 'D', 'X', 'UNKNOWN'] as const;

export const importPregnancyCategories = async (prisma: PrismaClient) => {
  const rows = readCsv<PregnancyCategoryCsvRow>('pregnancy_categories.csv');

  for (const row of rows) {
    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    if (!generic) {
      console.warn(`Pregnancy category skipped: ${row.generic_slug}`);
      continue;
    }

    await prisma.pregnancyCategory.upsert({
      where: { genericId: generic.id },
      update: {
        category: normalizeEnum(row.category, allowed, 'UNKNOWN') as PregnancyRiskLevel,
        warning: toNullableString(row.warning),
        recommendation: toNullableString(row.recommendation),
      },
      create: {
        genericId: generic.id,
        category: normalizeEnum(row.category, allowed, 'UNKNOWN') as PregnancyRiskLevel,
        warning: toNullableString(row.warning),
        recommendation: toNullableString(row.recommendation),
      },
    });
  }

  console.log(`Imported pregnancy categories: ${rows.length}`);
};