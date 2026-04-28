import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toNullableString, toSlug } from '../helpers/normalize';
import { GenericDetailCsvRow } from '../helpers/parsers';

export const importGenericDetails = async (prisma: PrismaClient) => {
  const rows = readCsv<GenericDetailCsvRow>('generic_details.csv');

  for (const row of rows) {
    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    if (!generic) {
      console.warn(`Generic not found for detail: ${row.generic_slug}`);
      continue;
    }

    await prisma.genericDetail.upsert({
      where: { genericId: generic.id },
      update: {
        overview: toNullableString(row.overview),
        indicationSummary: toNullableString(row.indication_summary),
        adultDose: toNullableString(row.adult_dose),
        childDose: toNullableString(row.child_dose),
        renalDoseAdjustment: toNullableString(row.renal_dose_adjustment),
        hepaticDoseAdjustment: toNullableString(row.hepatic_dose_adjustment),
        administration: toNullableString(row.administration),
        monitoring: toNullableString(row.monitoring),
        precaution: toNullableString(row.precaution),
        storageCondition: toNullableString(row.storage_condition),
        notes: toNullableString(row.notes),
      },
      create: {
        genericId: generic.id,
        overview: toNullableString(row.overview),
        indicationSummary: toNullableString(row.indication_summary),
        adultDose: toNullableString(row.adult_dose),
        childDose: toNullableString(row.child_dose),
        renalDoseAdjustment: toNullableString(row.renal_dose_adjustment),
        hepaticDoseAdjustment: toNullableString(row.hepatic_dose_adjustment),
        administration: toNullableString(row.administration),
        monitoring: toNullableString(row.monitoring),
        precaution: toNullableString(row.precaution),
        storageCondition: toNullableString(row.storage_condition),
        notes: toNullableString(row.notes),
      },
    });
  }

  console.log(`Imported generic details: ${rows.length}`);
};