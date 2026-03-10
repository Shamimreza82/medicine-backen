import { prisma } from '@/bootstrap/prisma';

import { seedHospital } from './seeds/hospital.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedSuperAdmin } from './seeds/user.seed';

async function main() {
  console.log('🌱 Seeding started');

  await seedPermissions();

  await seedRoles();

  const hospital = await seedHospital();

  if (!hospital?.id) {
    throw new Error('Hospital ID is required for seeding super admin');
  }

  await seedSuperAdmin(hospital.id);

  console.log('✅ Seeding completed');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
