import { LactationRiskLevel, PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { normalizeEnum, toNullableString, toSlug } from '../helpers/normalize';
import { LactationWarningCsvRow } from '../helpers/parsers';

const allowed = ['SAFE', 'CAUTION', 'UNSAFE', 'UNKNOWN'] as const;

export const importLactationWarnings = async (prisma: PrismaClient) => {
  const rows = readCsv<LactationWarningCsvRow>('lactation_warnings.csv');

  for (const row of rows) {
    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    if (!generic) {
      console.warn(`Lactation warning skipped: ${row.generic_slug}`);
      continue;
    }

    await prisma.lactationWarning.upsert({
      where: { genericId: generic.id },
      update: {
        riskLevel: normalizeEnum(row.risk_level, allowed, 'UNKNOWN') as LactationRiskLevel,
        warning: toNullableString(row.warning),
        recommendation: toNullableString(row.recommendation),
      },
      create: {
        genericId: generic.id,
        riskLevel: normalizeEnum(row.risk_level, allowed, 'UNKNOWN') as LactationRiskLevel,
        warning: toNullableString(row.warning),
        recommendation: toNullableString(row.recommendation),
      },
    });
  }

  console.log(`Imported lactation warnings: ${rows.length}`);
};