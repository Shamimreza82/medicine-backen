import { prisma } from '@/bootstrap/prisma';
import { authPermissions } from '@/shared/lib/data/authPermissions';


export async function seedPermissions() {

  await prisma.permission.createMany({
    data: [...authPermissions],
    skipDuplicates: true,
  })

  console.log(`✅ Seeded ${authPermissions.length} permissions`);
}


