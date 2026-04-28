import { PrismaClient, SeverityLevel } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { normalizeEnum, toNullableString, toSlug } from '../helpers/normalize';
import { SideEffectCsvRow } from '../helpers/parsers';

const allowed = ['LOW', 'MODERATE', 'HIGH', 'SEVERE'] as const;

export const importSideEffects = async (prisma: PrismaClient) => {
  const rows = readCsv<SideEffectCsvRow>('side_effects.csv');

  for (const row of rows) {
    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    if (!generic) {
      console.warn(`Side effect skipped, generic not found: ${row.generic_slug}`);
      continue;
    }

    await prisma.sideEffect.create({
      data: {
        genericId: generic.id,
        effect: row.effect.trim(),
        severity: normalizeEnum(row.severity, allowed, 'LOW') as SeverityLevel,
        frequency: toNullableString(row.frequency),
        note: toNullableString(row.note),
      },
    });
  }

  console.log(`Imported side effects: ${rows.length}`);
};