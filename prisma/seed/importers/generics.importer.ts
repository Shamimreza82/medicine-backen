import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toBoolean, toNullableString, toSlug } from '../helpers/normalize';
import { GenericCsvRow } from '../helpers/parsers';

export const importGenerics = async (prisma: PrismaClient) => {
  const rows = readCsv<GenericCsvRow>('generics.csv');

  for (const row of rows) {
    await prisma.generic.upsert({
      where: { slug: toSlug(row.slug) },
      update: {
        name: row.name.trim(),
        scientificName: toNullableString(row.scientific_name),
        drugClass: toNullableString(row.drug_class),
        therapeuticClass: toNullableString(row.therapeutic_class),
        description: toNullableString(row.description),
        mechanismOfAction: toNullableString(row.mechanism_of_action),
        pharmacokinetics: toNullableString(row.pharmacokinetics),
        dosageGuideline: toNullableString(row.dosage_guideline),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
      create: {
        name: row.name.trim(),
        slug: toSlug(row.slug),
        scientificName: toNullableString(row.scientific_name),
        drugClass: toNullableString(row.drug_class),
        therapeuticClass: toNullableString(row.therapeutic_class),
        description: toNullableString(row.description),
        mechanismOfAction: toNullableString(row.mechanism_of_action),
        pharmacokinetics: toNullableString(row.pharmacokinetics),
        dosageGuideline: toNullableString(row.dosage_guideline),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
    });
  }

  console.log(`Imported generics: ${rows.length}`);
};