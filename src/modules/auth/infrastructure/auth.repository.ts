import { prisma } from '@/bootstrap/prisma';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: { email },
    include: {
      role: {
        select: {
          slug: true
        }
      }
    }
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        select: {
          slug: true
        }
      }
    }
  });
};


