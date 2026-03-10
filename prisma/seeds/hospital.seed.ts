import { prisma } from '@/bootstrap/prisma';
import { Hospital } from '@prisma/client';

export async function seedHospital(): Promise<Hospital> {
  const hospital = await prisma.hospital.upsert({
    where: { email: 'demo@hospital.com' },
    update: {},
    create: {
      name: 'Demo Hospital',
      email: 'demo@hospital.com',
    },
  });

  return hospital;
}
