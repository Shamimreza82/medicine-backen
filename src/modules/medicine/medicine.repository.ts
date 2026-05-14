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
      where.OR = [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          generic: {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (query.companyId) {
      where.companyId = Number(query.companyId);
    }

    if (query.genericId) {
      where.genericId = Number(query.genericId);
    }

    if (query.form) {
      where.form = {
        equals: query.form,
        mode: 'insensitive',
      };
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
        select: {
          id: true,
          name: true,
          form: true,
          strength: true,
          price: true,
          packSize: true,
          isSponsored: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          generic: {
            select: {
              id: true,
              name: true,
              therapeuticGenerics: {
                select: {
                  therapeutic: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
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

    const where: Prisma.DrugGenericWhereInput = {};

    if (q) {
      where.name = {
        contains: q,
        mode: 'insensitive',
      };
    }

    if (query.letter) {
      where.name = {
        startsWith: query.letter,
        mode: 'insensitive',
      };
    }

    if (query.therapeuticId) {
      where.therapeuticGenerics = {
        some: {
          therapeuticId: Number(query.therapeuticId),
        },
      };
    }

    if (query.indicationId) {
      where.indicationGenerics = {
        some: {
          indicationId: Number(query.indicationId),
        },
      };
    }

    const [data, total] = await Promise.all([
      prisma.drugGeneric.findMany({
        where,
        select: {
          id: true,
          name: true,
          indication: true,
          therapeuticGenerics: {
            select: {
              therapeutic: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
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

  private classificationTreeCache: any = null;
  private lastCacheTime = 0;
  private CACHE_TTL = 1000 * 60 * 60; // 1 hour

  async getClassificationTree() {
    const now = Date.now();
    if (this.classificationTreeCache && now - this.lastCacheTime < this.CACHE_TTL) {
      return this.classificationTreeCache;
    }

    const [systemics, therapeutics] = await Promise.all([
      prisma.systemic.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.therapeutic.findMany({
        orderBy: { name: 'asc' },
      }),
    ]);

    const systemicMap = new Map<number, any>();
    const roots: any[] = [];

    systemics.forEach((s) => {
      systemicMap.set(s.id, { ...s, children: [], therapeutics: [] });
    });

    therapeutics.forEach((t) => {
      const parent = systemicMap.get(t.systemicClassId);
      if (parent) {
        parent.therapeutics.push(t);
      }
    });

    systemics.forEach((s) => {
      const node = systemicMap.get(s.id);
      if (s.parentId) {
        const parent = systemicMap.get(s.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    this.classificationTreeCache = roots;
    this.lastCacheTime = now;
    return roots;
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
        select: {
          id: true,
          name: true,
        },
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
        select: {
          id: true,
          name: true,
        },
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
        company: {
          select: {
            id: true,
            name: true,
          },
        },
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
      select: {
        id: true,
        name: true,
        form: true,
        strength: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
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
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getIndicationById(id: number) {
    const indication = await prisma.indication.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!indication) return null;

    // Fetch unique therapeutics associated with this indication through generics
    const therapeutics = await prisma.therapeutic.findMany({
      where: {
        therapeuticGenerics: {
          some: {
            generic: {
              indicationGenerics: {
                some: {
                  indicationId: id,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      ...indication,
      therapeutics,
    };
  }

  async getDistinctForms(query: MedicineSearchQuery) {
    const { limit, skip } = calculatePagination(query);
    const q = this.formatQuery(query.q);

    const [drugForms, herbalForms] = await Promise.all([
      prisma.drugBrand.findMany({
        distinct: ['form'],
        select: { form: true },
        where: { 
          form: { 
            not: null,
            contains: q,
            mode: 'insensitive'
          } 
        },
      }),
      prisma.herbalBrand.findMany({
        distinct: ['form'],
        select: { form: true },
        where: { 
          form: { 
            not: null,
            contains: q,
            mode: 'insensitive'
          } 
        },
      }),
    ]);

    const allForms = Array.from(new Set([
      ...drugForms.map((f) => f.form as string),
      ...herbalForms.map((f) => f.form as string),
    ])).filter(Boolean).sort();

    const total = allForms.length;
    const data = allForms.slice(skip, skip + limit);

    return { data, total };
  }
}

export const medicineRepository = new MedicineRepository();
