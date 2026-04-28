import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toNullableString, toSlug } from '../helpers/normalize';
import { ContraindicationCsvRow } from '../helpers/parsers';

export const importContraindications = async (prisma: PrismaClient) => {
  const rows = readCsv<ContraindicationCsvRow>('contraindications.csv');

  for (const row of rows) {
    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    if (!generic) {
      console.warn(`Contraindication skipped, generic not found: ${row.generic_slug}`);
      continue;
    }

    await prisma.contraindication.create({
      data: {
        genericId: generic.id,
        condition: row.condition.trim(),
        note: toNullableString(row.note),
      },
    });
  }

  console.log(`Imported contraindications: ${rows.length}`);
};