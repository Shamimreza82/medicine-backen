import { Prisma } from '@prisma/client';

import { prisma } from '@/bootstrap/prisma';
import { calculatePagination } from '@/shared/utils/pagination';

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
    const { limit, skip } = calculatePagination(query);
    const q = this.formatQuery(query.q);

    const where: Prisma.DrugBrandWhereInput = {};

    if (q) {
      where.name = {
        contains: q,
        mode: 'insensitive',
      };
    }

    if (query.companyId) {
      where.companyId = Number(query.companyId);
    }

    if (query.genericId) {
      where.genericId = Number(query.genericId);
    }

    if (query.indicationId) {
      where.generic = {
        indicationGenerics: {
          some: {
            indicationId: Number(query.indicationId),
          },
        },
      };
    }

    const [data, total] = await Promise.all([
      prisma.drugBrand.findMany({
        where,
        include: {
          company: true,
          generic: true,
        },
        take: limit,
        skip,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.drugBrand.count({ where }),
    ]);

    return { data, total };
  }

  async searchGenerics(query: MedicineSearchQuery) {
    const { limit, skip } = calculatePagination(query);
    const q = this.formatQuery(query.q);

    const where: Prisma.DrugGenericWhereInput = {
      name: {
        contains: q,
        mode: 'insensitive',
      },
    };

    const [data, total] = await Promise.all([
      prisma.drugGeneric.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.drugGeneric.count({ where }),
    ]);

    return { data, total };
  }

  async searchIndications(query: MedicineSearchQuery) {
    const { limit, skip } = calculatePagination(query);
    const q = this.formatQuery(query.q);

    const where: Prisma.IndicationWhereInput = {
      name: {
        contains: q,
        mode: 'insensitive',
      },
    };

    const [data, total] = await Promise.all([
      prisma.indication.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.indication.count({ where }),
    ]);

    return { data, total };
  }

  async searchCompanies(query: MedicineSearchQuery) {
    const { limit, skip } = calculatePagination(query);
    const q = this.formatQuery(query.q);

    const where: Prisma.CompanyWhereInput = {
      name: {
        contains: q,
        mode: 'insensitive',
      },
    };

    const [data, total] = await Promise.all([
      prisma.company.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.company.count({ where }),
    ]);

    return { data, total };
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
    });
  }

  async getIndicationById(id: number) {
    return prisma.indication.findUnique({
      where: { id },
    });
  }
}

export const medicineRepository = new MedicineRepository();
