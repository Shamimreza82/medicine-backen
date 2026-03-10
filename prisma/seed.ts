import { logger } from '@/bootstrap/logger';
import { prisma } from '@/bootstrap/prisma';

import { seedFeatures, seedHospital } from './seeds/hospital.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedSuperAdmin } from './seeds/user.seed';

async function main() {
  logger.info('🌱 Seeding started');

  await seedPermissions();
  logger.info('🌱 Permissions seeded');
  await seedRoles();
  logger.info('🌱 Roles seeded');
  await seedFeatures();
  logger.info('🌱 Features seeded');

  const hospital = await seedHospital();

  if (!hospital?.id) {
    throw new Error('Hospital ID is required for seeding super admin');
  }

  await seedSuperAdmin(hospital.id);
  logger.info('✅ Seeding completed');
}

main()
  .catch(logger.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
