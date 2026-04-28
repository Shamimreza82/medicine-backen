import { prisma } from '@/bootstrap/prisma';

import { importBrands } from './seed/importers/brands.importer';
import { importContraindications } from './seed/importers/contraindications.importer';
import { importDiseases } from './seed/importers/diseases.importer';
import { importDrugInteractions } from './seed/importers/drug-interactions.importer';
import { importGenericDetails } from './seed/importers/generic-details.importer';
import { importGenericIndications } from './seed/importers/generic-indications.importer';
import { importGenerics } from './seed/importers/generics.importer';
import { importLactationWarnings } from './seed/importers/lactation-warnings.importer';
import { importManufacturers } from './seed/importers/manufacturers.importer';
import { importPregnancyCategories } from './seed/importers/pregnancy-categories.importer';
import { importProducts } from './seed/importers/products.importer';
import { importSideEffects } from './seed/importers/side-effects.importer';
import { importLabTests } from './seed-lab-tests';



const run = async () => {
  console.log('Starting medicine seed...');

  await importManufacturers(prisma);
  await importGenerics(prisma);
  await importDiseases(prisma);

  await importGenericDetails(prisma);
  await importPregnancyCategories(prisma);
  await importLactationWarnings(prisma);

  await importGenericIndications(prisma);
  await importSideEffects(prisma);
  await importContraindications(prisma);
  await importDrugInteractions(prisma);

  await importBrands(prisma);
  await importProducts(prisma);
  await importLabTests(prisma);

  console.log('Medicine seed completed successfully.');
};

run()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
