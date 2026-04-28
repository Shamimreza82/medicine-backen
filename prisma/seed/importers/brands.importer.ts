import { PrismaClient } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import { toBoolean, toNullableString, toSlug } from '../helpers/normalize';
import { BrandCsvRow } from '../helpers/parsers';

export const importBrands = async (prisma: PrismaClient) => {
  const rows = readCsv<BrandCsvRow>('brands.csv');

  for (const row of rows) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { slug: toSlug(row.manufacturer_slug) },
      select: { id: true },
    });

    const generic = await prisma.generic.findUnique({
      where: { slug: toSlug(row.generic_slug) },
      select: { id: true },
    });

    if (!manufacturer || !generic) {
      console.warn(`Brand skipped: ${row.slug}`);
      continue;
    }

    await prisma.brand.upsert({
      where: {
        manufacturerId_slug: {
          manufacturerId: manufacturer.id,
          slug: toSlug(row.slug),
        },
      },
      update: {
        name: row.name.trim(),
        genericId: generic.id,
        description: toNullableString(row.description),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
      create: {
        name: row.name.trim(),
        slug: toSlug(row.slug),
        manufacturerId: manufacturer.id,
        genericId: generic.id,
        description: toNullableString(row.description),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
    });
  }

  console.log(`Imported brands: ${rows.length}`);
};