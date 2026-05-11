import { prisma } from '@/bootstrap/prisma';

import { MedicineSearchQuery } from './medicine.types';

export class MedicineRepository {
  private formatQuery(q: string | undefined): string {
    let search = String(q ?? '').trim();
    // Remove wrapping quotes if present (e.g. "para" -> para)
    if (search.startsWith('"') && search.endsWith('"')) {
      search = search.substring(1, search.length - 1);
    }
    return search;
  }

  async searchBrands(query: MedicineSearchQuery) {
    const q = this.formatQuery(query.q);
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (Math.max(1, page) - 1) * limit;

    return prisma.drugBrand.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive' as const,
        },
      },
      include: {
        company: true,
        generic: true,
      },
      take: limit,
      skip,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async searchGenerics(query: MedicineSearchQuery) {
    const q = this.formatQuery(query.q);
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (Math.max(1, page) - 1) * limit;

    return prisma.drugGeneric.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive' as const,
        },
      },
      take: limit,
      skip,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async searchIndications(query: MedicineSearchQuery) {
    const q = this.formatQuery(query.q);
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (Math.max(1, page) - 1) * limit;

    return prisma.indication.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive' as const,
        },
      },
      take: limit,
      skip,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async countBrands(q: string) {
    return prisma.drugBrand.count({
      where: {
        name: {
          contains: this.formatQuery(q),
          mode: 'insensitive' as const,
        },
      },
    });
  }

  async countGenerics(q: string) {
    return prisma.drugGeneric.count({
      where: {
        name: {
          contains: this.formatQuery(q),
          mode: 'insensitive' as const,
        },
      },
    });
  }

  async countIndications(q: string) {
    return prisma.indication.count({
      where: {
        name: {
          contains: this.formatQuery(q),
          mode: 'insensitive' as const,
        },
      },
    });
  }
}

export const medicineRepository = new MedicineRepository();
