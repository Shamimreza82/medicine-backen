import { prisma } from '@/bootstrap/prisma';

export const LabTestRepository = {
  privateFormatQuery(q: string | undefined): string {
    let search = String(q ?? '').trim();
    if (search.startsWith('"') && search.endsWith('"')) {
      search = search.substring(1, search.length - 1);
    }
    return search;
  },

  search(
    query: string,
    category: string | undefined,
    specimen: string | undefined,
    limit: number,
    page: number,
  ) {
    const q = this.privateFormatQuery(query);
    const where = {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' as const } },
              { slug: { contains: q, mode: 'insensitive' as const } },
              { shortName: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
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
        skip: (Math.max(1, page) - 1) * limit,
        take: limit,
      }),
    ]);
  },
};
