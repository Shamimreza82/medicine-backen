import { prisma } from '@/bootstrap/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '@/shared/errors/AppError';
import { StatusCodes } from 'http-status-codes';

export async function seedSuperAdmin(hospitalId: string) {
  const role = await prisma.role.findFirst({
    where: { slug: 'SUPER_ADMIN' },
  });

  if (!role) {
    throw new AppError(StatusCodes.NOT_FOUND, 'SUPER_ADMIN role not found');
  }

  const password = await bcrypt.hash('123456', 10);
  console.log('🌱 Hashed password for super admin');
  await prisma.user.upsert({
    where: {
      hospitalId_email: {
        hospitalId: hospitalId,
        email: 'admin@system.com',
      },
    },
    update: {
      name: 'System Admin',
      email: 'admin@system.com',
      password,
      hospitalId,
      roleId: role.id,
      emailVerified: true,
      phoneVerified: true,
    },
    create: {
      name: 'System Admin',
      email: 'admin@system.com',
      password,
      hospitalId,
      roleId: role.id,
      emailVerified: true,
      phoneVerified: true,
    },
  });
}
