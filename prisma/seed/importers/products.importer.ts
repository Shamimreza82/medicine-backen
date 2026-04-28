import { PrismaClient, ProductStatus } from '@prisma/client';

import { readCsv } from '../helpers/csv';
import {
  normalizeEnum,
  toBoolean,
  toNullableFloat,
  toNullableInt,
  toNullableString,
  toSlug,
} from '../helpers/normalize';
import { ProductCsvRow } from '../helpers/parsers';

const allowed = ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] as const;

export const importProducts = async (prisma: PrismaClient) => {
  const rows = readCsv<ProductCsvRow>('products.csv');

  for (const row of rows) {
    const brand = await prisma.brand.findFirst({
      where: { slug: toSlug(row.brand_slug) },
      select: { id: true },
    });

    if (!brand) {
      console.warn(`Product skipped, brand not found: ${row.brand_slug}`);
      continue;
    }

    await prisma.product.upsert({
      where: {
        brandId_strength_dosageForm: {
          brandId: brand.id,
          strength: row.strength.trim(),
          dosageForm: row.dosage_form.trim(),
        },
      },
      update: {
        sku: toNullableString(row.sku),
        route: toNullableString(row.route),
        packSize: toNullableString(row.pack_size),
        unitPerPack: toNullableInt(row.unit_per_pack),
        price: toNullableFloat(row.price),
        status: normalizeEnum(row.status, allowed, 'ACTIVE') as ProductStatus,
        registrationNumber: toNullableString(row.registration_number),
        barcode: toNullableString(row.barcode),
        isPrescriptionRequired: toBoolean(row.is_prescription_required ?? 'false'),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
      create: {
        brandId: brand.id,
        sku: toNullableString(row.sku),
        strength: row.strength.trim(),
        dosageForm: row.dosage_form.trim(),
        route: toNullableString(row.route),
        packSize: toNullableString(row.pack_size),
        unitPerPack: toNullableInt(row.unit_per_pack),
        price: toNullableFloat(row.price),
        status: normalizeEnum(row.status, allowed, 'ACTIVE') as ProductStatus,
        registrationNumber: toNullableString(row.registration_number),
        barcode: toNullableString(row.barcode),
        isPrescriptionRequired: toBoolean(row.is_prescription_required ?? 'false'),
        isActive: toBoolean(row.is_active ?? 'true'),
      },
    });
  }

  console.log(`Imported products: ${rows.length}`);
};