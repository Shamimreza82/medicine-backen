import { prisma } from '@/bootstrap/prisma';

export async function seedRoles() {
  const roles = [
    { name: 'Super Admin', slug: 'SUPER_ADMIN', isSystem: true },
    { name: 'Hospital Admin', slug: 'HOSPITAL_ADMIN', isSystem: true },
    { name: 'Doctor', slug: 'DOCTOR', isSystem: true },
    { name: 'Receptionist', slug: 'RECEPTIONIST', isSystem: true },
    { name: 'Patient', slug: 'PATIENT', isSystem: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        hospitalId_slug: {
          slug: role.slug,
          hospitalId: '',
        },
      },
      update: {},
      create: role,
    });
  }
}
