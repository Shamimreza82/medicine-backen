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

  async searchCompanies(query: MedicineSearchQuery) {
    const q = this.formatQuery(query.q);
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (Math.max(1, page) - 1) * limit;

    return prisma.company.findMany({
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

  async countCompanies(q: string) {
    return prisma.company.count({
      where: {
        name: {
          contains: this.formatQuery(q),
          mode: 'insensitive' as const,
        },
      },
    });
  }

  async getBrandById(id: number) {
    const brand = await prisma.drugBrand.findUnique({
      where: { id },
      include: {
        company: true,
        generic: {
          include: {
            pregnancyCategory: true,
            therapeuticGenerics: {
              include: {
                therapeutic: true,
              },
            },
          },
        },
      },
    });

    if (!brand) return null;

    // Fetch other forms of the same brand (same generic and same company)
    const otherForms = await prisma.drugBrand.findMany({
      where: {
        genericId: brand.genericId,
        companyId: brand.companyId,
        id: { not: id },
      },
      select: {
        id: true,
        name: true,
        form: true,
        strength: true,
      },
      orderBy: [{ form: 'asc' }, { strength: 'asc' }],
    });

    // Fetch generic alternatives (different companies, same generic)
    const genericAlternatives = await prisma.drugBrand.findMany({
      where: {
        genericId: brand.genericId,
        companyId: { not: brand.companyId },
      },
      take: 10,
      include: {
        company: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      ...brand,
      otherForms,
      genericAlternatives,
    };
  }

  async getGenericById(id: number) {
    return prisma.drugGeneric.findUnique({
      where: { id },
      include: {
        pregnancyCategory: true,
        therapeuticGenerics: {
          include: {
            therapeutic: true,
          },
        },
      },
    });
  }

  async getCompanyById(id: number) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        brands: {
          include: {
            generic: true,
          },
          take: 50, // Limit brands for now
        },
      },
    });
  }

  async getIndicationById(id: number) {
    return prisma.indication.findUnique({
      where: { id },
    });
  }
}

export const medicineRepository = new MedicineRepository();
