import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { calculatePagination } from '@/shared/utils/pagination';

import { LabTestSearchQuery } from './labTest.types';

export const LabTestRepository = {
  privateFormatQuery(q: string | undefined): string {
    let search = String(q ?? '').trim();
    if (search.startsWith('"') && search.endsWith('"')) {
      search = search.substring(1, search.length - 1);
    }
    return search;
  },

  async search(query: LabTestSearchQuery) {
    const { limit, skip } = calculatePagination(query);
    const q = this.privateFormatQuery(query.q);

    const where: Prisma.LabTestWhereInput = {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { slug: { contains: q, mode: 'insensitive' } },
              { shortName: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.category
        ? {
            category: { equals: query.category, mode: 'insensitive' },
          }
        : {}),
      ...(query.specimen
        ? {
            specimen: { equals: query.specimen, mode: 'insensitive' },
          }
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.labTest.count({ where }),
      prisma.labTest.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    return { data, total };
  },
};
