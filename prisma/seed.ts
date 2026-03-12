import { logger } from '@/bootstrap/logger';
import { prisma } from '@/bootstrap/prisma';

import { seedFeatures, seedHospital } from './seeds/hospital.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedSuperAdmin } from './seeds/user.seed';

async function main() {
  logger.info('🌱 Seeding started...');

  await prisma.$transaction(async () => {

    await seedPermissions();

    const hospital = await seedHospital();

    await seedRoles(hospital.id);

    await seedSuperAdmin(hospital.id);

    await seedFeatures();

  }, { timeout: 60000 }); // Set a timeout of 10 minutes for the transaction

  logger.info('✅ Seeding completed');
}

main()
  .catch((error) => {
    logger.error('❌ Error occurred while seeding');
    logger.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });