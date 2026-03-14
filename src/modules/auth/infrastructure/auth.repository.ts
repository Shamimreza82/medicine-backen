import { prisma } from '@/bootstrap/prisma';



export const findUserByEmail = async (email: string, tenantId?: string) => {
  return prisma.user.findFirst({
    where: { email, tenantId },
    include: {
      role: {
        select: {
          slug: true
        }
      }
    }
  });
};

export const findUserById = async (id: string, tenantId?: string) => {
  return prisma.user.findUnique({
    where: { id, tenantId },
    include: {
      role: {
        select: {
          slug: true
        }
      }
    }
  });
};


export const createAuthUser = async (data: any) => {
  return await prisma.user.create({
    data: {
      ...data
    },
    include: {
      role: {
        select: {
          slug: true
        }
      }
    }
  });
};





