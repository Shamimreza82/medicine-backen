import { logger } from '@/bootstrap/logger';
import { prisma } from '@/bootstrap/prisma';

import { seedFeatures } from './seeds/feature.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedTenantTypes } from './seeds/seedTenantTypes';
import { seedTenant } from './seeds/tenant.seed';
import { seedSuperAdmin } from './seeds/user.seed';

async function main() {
  logger.info('🌱 Seeding started...');

  await prisma.$transaction(
    async () => {
      await seedTenantTypes();
      await seedFeatures();
      await seedPermissions();

      const tenant = await seedTenant();

      await seedRoles(tenant.id);

      await seedSuperAdmin(tenant.id);
    },
    { timeout: 60000 },
  ); // Set a timeout of 10 minutes for the transaction

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
