import { prisma } from '@/bootstrap/prisma';
import { roles } from '@/shared/lib/data/roles';

export async function seedRoles(tenantId: string) {
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        tenantId_slug: {
          slug: role.slug,
          tenantId: tenantId,
        },
      },
      update: {},
      create: {
        ...role,
        tenantId: tenantId,
      },
    });
  }

  console.log(`✅ Seeded ${roles.length} roles`);
}
