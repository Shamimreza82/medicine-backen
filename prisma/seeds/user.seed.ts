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

  const password = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@system.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@system.com',
      password,
      hospitalId,
      roleId: role.id,
    },
  });
}
