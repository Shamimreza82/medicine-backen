import { prisma } from '@/bootstrap/prisma';

import { seedFeatures, seedHospital } from './seeds/hospital.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedSuperAdmin } from './seeds/user.seed';

async function main() {
  console.log('✅ Seeding started......');
  await seedPermissions();
  console.log('🌱 Permissions seeded');

  const hospital = await seedHospital();
  console.log('🌱 Hospital seeded');

  await seedRoles(hospital.id);
  console.log('🌱 Roles seeded');

  await seedSuperAdmin(hospital.id);

  console.log('🌱 Super admin seeded');
  await seedFeatures();
  console.log('🌱 Features seeded');
  
  console.log('✅ Seeding completed');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
