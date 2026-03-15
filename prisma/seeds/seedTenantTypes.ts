import { prisma } from '@/bootstrap/prisma';
import { tenantTypes } from '@/shared/lib/data/tenantTypes';

export async function seedTenantTypes() {
  for (const type of tenantTypes) {
    await prisma.tenantType.upsert({
      where: { code: type.code },
      update: {},
      create: type,
    });
  }

  console.log('✅ Tenant Types seeded');
}
