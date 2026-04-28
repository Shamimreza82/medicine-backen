import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toBoolean, toNullableString, toSlug } from '../helpers/normalize';
import { GenericIndicationCsvRow } from '../helpers/parsers';

export const importGenericIndications = async (prisma: PrismaClient) => {
  const rows = readCsv<GenericIndicationCsvRow>('generic_indications.csv');

  for (const row of rows) {
    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    const disease = await prisma.disease.findUnique({
      where: { slug: toSlug(row.disease_slug) },
      select: { id: true },
    });

    if (!generic || !disease) {
      console.warn(`Indication skipped: ${row.generic_slug} -> ${row.disease_slug}`);
      continue;
    }

    await prisma.genericIndication.upsert({
      where: {
        genericId_diseaseId: {
          genericId: generic.id,
          diseaseId: disease.id,
        },
      },
      update: {
        note: toNullableString(row.note),
        isPrimary: toBoolean(row.is_primary ?? 'false'),
      },
      create: {
        genericId: generic.id,
        diseaseId: disease.id,
        note: toNullableString(row.note),
        isPrimary: toBoolean(row.is_primary ?? 'false'),
      },
    });
  }

  console.log(`Imported generic indications: ${rows.length}`);
};