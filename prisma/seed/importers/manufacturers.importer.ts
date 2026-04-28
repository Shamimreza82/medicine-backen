import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toBoolean, toNullableString, toSlug } from '../helpers/normalize';
import { ManufacturerCsvRow } from '../helpers/parsers';

export const importManufacturers = async (prisma: PrismaClient) => {
  const rows = readCsv<ManufacturerCsvRow>('manufacturers.csv');

  for (const row of rows) {
    await prisma.manufacturer.upsert({
      where: { slug: toSlug(row.slug) },
      update: {
        name: row.name.trim(),
        country: toNullableString(row.country),
        website: toNullableString(row.website),
        email: toNullableString(row.email),
        phone: toNullableString(row.phone),
        address: toNullableString(row.address),
        description: toNullableString(row.description),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
      create: {
        name: row.name.trim(),
        slug: toSlug(row.slug),
        country: toNullableString(row.country),
        website: toNullableString(row.website),
        email: toNullableString(row.email),
        phone: toNullableString(row.phone),
        address: toNullableString(row.address),
        description: toNullableString(row.description),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
    });
  }

  console.log(`Imported manufacturers: ${rows.length}`);
};