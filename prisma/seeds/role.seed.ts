import { prisma } from '@/bootstrap/prisma';
import { roles } from '@/shared/lib/data/roles';

export async function seedRoles(hospitalid: string) {
  

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        hospitalId_slug: {
          slug: role.slug,
          hospitalId: hospitalid,
        },
      },
      update: {},
      create: {
        ...role,
        hospitalId: hospitalid,
      },
    });
  }

  console.log(`✅ Seeded ${roles.length} roles`);
}
