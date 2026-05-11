import { prisma } from '@/bootstrap/prisma';

import { importMedicineData } from './seed/importers/medicine.importer';
import { importLabTests } from './seed-lab-tests';

const run = async () => {
  console.log('--- Starting Database Seed ---');

  // Import medicine data from JSON files (t_*.json)
  await importMedicineData(prisma);

  // Import lab tests from CSV
  await importLabTests(prisma);

  console.log('--- Database Seed Completed Successfully ---');
};

run()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
