import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

let prismaClient: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (prismaClient) {
    return prismaClient;
  }

  prismaClient = new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.databaseUrl }),
  });
  return prismaClient;
};

export const disconnectPrisma = async (): Promise<void> => {
  if (!prismaClient) {
    return;
  }

  await prismaClient.$disconnect();
  prismaClient = null;
};
