import { prisma } from '@/bootstrap/prisma';

export const LabTestRepository = {
  search(query: string, category: string | undefined, specimen: string | undefined, limit: number, page: number) {
    const where = {
      isActive: true,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' as const } },
              { slug: { contains: query, mode: 'insensitive' as const } },
              { shortName: { contains: query, mode: 'insensitive' as const } },
              { description: { contains: query, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(category
        ? {
            category: { equals: category, mode: 'insensitive' as const },
          }
        : {}),
      ...(specimen
        ? {
            specimen: { equals: specimen, mode: 'insensitive' as const },
          }
        : {}),
    };

    return prisma.$transaction([
      prisma.labTest.count({ where }),
      prisma.labTest.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
  },
};
