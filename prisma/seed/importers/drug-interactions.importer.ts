import { PrismaClient, SeverityLevel } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { normalizeEnum, toNullableString, toSlug } from '../helpers/normalize';
import { DrugInteractionCsvRow } from '../helpers/parsers';

const allowed = ['LOW', 'MODERATE', 'HIGH', 'SEVERE'] as const;

export const importDrugInteractions = async (prisma: PrismaClient) => {
  const rows = readCsv<DrugInteractionCsvRow>('drug_interactions.csv');

  for (const row of rows) {
    const source = await prisma.generic.findUnique({
      where: { slug: toSlug(row.source_generic_slug) },
      select: { id: true },
    });

    const target = await prisma.generic.findUnique({
      where: { slug: toSlug(row.target_generic_slug) },
      select: { id: true },
    });

    if (!source || !target) {
      console.warn(`Interaction skipped: ${row.source_generic_slug} -> ${row.target_generic_slug}`);
      continue;
    }

    await prisma.drugInteraction.upsert({
      where: {
        sourceGenericId_targetGenericId: {
          sourceGenericId: source.id,
          targetGenericId: target.id,
        },
      },
      update: {
        severity: normalizeEnum(row.severity, allowed, 'MODERATE') as SeverityLevel,
        effect: toNullableString(row.effect),
        management: toNullableString(row.management),
        note: toNullableString(row.note),
      },
      create: {
        sourceGenericId: source.id,
        targetGenericId: target.id,
        severity: normalizeEnum(row.severity, allowed, 'MODERATE') as SeverityLevel,
        effect: toNullableString(row.effect),
        management: toNullableString(row.management),
        note: toNullableString(row.note),
      },
    });
  }

  console.log(`Imported drug interactions: ${rows.length}`);
};