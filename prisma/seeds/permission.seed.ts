import { prisma } from '@/bootstrap/prisma';

export async function seedPermissions() {
  const permissions = [
    { name: 'PATIENT:CREATE', resource: 'PATIENT', action: 'CREATE' },
    { name: 'PATIENT:VIEW', resource: 'PATIENT', action: 'VIEW' },
    { name: 'PATIENT:UPDATE', resource: 'PATIENT', action: 'UPDATE' },
    { name: 'PRESCRIPTION:CREATE', resource: 'PRESCRIPTION', action: 'CREATE' },
    { name: 'PRESCRIPTION:PRINT', resource: 'PRESCRIPTION', action: 'PRINT' },
  ];

  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });
}
