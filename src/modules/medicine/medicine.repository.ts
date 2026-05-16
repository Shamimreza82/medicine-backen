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

  async getStats() {
    const [brands, generics, companies, indications] = await Promise.all([
      prisma.drugBrand.count(),
      prisma.drugGeneric.count(),
      prisma.company.count(),
      prisma.indication.count(),
    ]);

    return { brands, generics, companies, indications };
  }

  async searchBrands(query: MedicineSearchQuery) {
    const { limit, skip } = calculatePagination(query);
    const q = this.formatQuery(query.q);

    const where: Prisma.DrugBrandWhereInput = {};

    if (q) {
      where.name = { startsWith: q, mode: 'insensitive' };
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

    if (query.strength) {
      where.strength = {
        contains: query.strength,
        mode: 'insensitive',
      };
    }

    if (query.letter) {
      where.name = {
        startsWith: query.letter,
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

    const orderBy: Prisma.DrugBrandOrderByWithRelationInput = {};
    if (query.sortBy === 'price') {
      orderBy.price = query.sortOrder;
    } else {
      orderBy.name = query.sortOrder || 'asc';
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
        orderBy,
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
        startsWith: q,
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
          administration: true,
          adultDose: true,
          childDose: true,
          contraIndication: true,
          interaction: true,
          modeOfAction: true,
          precaution: true,
          pregnancyCategoryId: true,
          pregnancyCategoryNote: true,
          renalDose: true,
          sideEffect: true,
          pregnancyCategory: true,
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

  async createCompany(data: Prisma.CompanyCreateInput) {
    if (!data.id) {
      const lastCompany = await prisma.company.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      data.id = (lastCompany?.id ?? 0) + 1;
    }

    return prisma.company.create({
      data,
    });
  }

  async updateCompany(id: number, data: Prisma.CompanyUpdateInput) {
    return prisma.company.update({
      where: { id },
      data,
    });
  }

  async createIndication(data: Prisma.IndicationCreateInput) {
    if (!data.id) {
      const lastIndication = await prisma.indication.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      data.id = (lastIndication?.id ?? 0) + 1;
    }

    return prisma.indication.create({
      data,
    });
  }

  async updateIndication(id: number, data: Prisma.IndicationUpdateInput) {
    return prisma.indication.update({
      where: { id },
      data,
    });
  }

  async createBrand(data: Prisma.DrugBrandCreateInput) {
    if (!data.id) {
      const lastBrand = await prisma.drugBrand.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      data.id = (lastBrand?.id ?? 0) + 1;
    }

    return prisma.drugBrand.create({
      data,
      include: {
        company: true,
        generic: true,
      },
    });
  }

  async updateBrand(id: number, data: Prisma.DrugBrandUpdateInput) {
    return prisma.drugBrand.update({
      where: { id },
      data,
      include: {
        company: true,
        generic: true,
      },
    });
  }

  async createGeneric(data: Prisma.DrugGenericCreateInput) {
    // If ID is not provided, calculate the next one
    if (!data.id) {
      const lastGeneric = await prisma.drugGeneric.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      data.id = (lastGeneric?.id ?? 0) + 1;
    }

    return prisma.drugGeneric.create({
      data,
    });
  }

  async updateGeneric(id: number, data: Prisma.DrugGenericUpdateInput) {
    return prisma.drugGeneric.update({
      where: { id },
      data,
    });
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

    const where: Prisma.IndicationWhereInput = {};

    if (q) {
      where.name = {
        startsWith: q,
        mode: 'insensitive',
      };
    }

    if (query.letter) {
      where.name = {
        startsWith: query.letter,
        mode: 'insensitive',
      };
    }

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

    const where: Prisma.CompanyWhereInput = {};

    if (q) {
      where.name = {
        startsWith: q,
        mode: 'insensitive',
      };
    }

    if (query.letter) {
      where.name = {
        startsWith: query.letter,
        mode: 'insensitive',
      };
    }

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

  async getPregnancyCategories() {
    return prisma.pregnancyCategory.findMany({
      orderBy: { name: 'asc' },
    });
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

    const drugWhere: Prisma.DrugBrandWhereInput = {
      form: {
        not: null,
      },
    };

    const herbalWhere: Prisma.HerbalBrandWhereInput = {
      form: {
        not: null,
      },
    };

    if (q) {
      drugWhere.form = {
        startsWith: q,
        mode: 'insensitive',
      };
      herbalWhere.form = {
        startsWith: q,
        mode: 'insensitive',
      };
    }

    if (query.letter) {
      drugWhere.form = {
        startsWith: query.letter,
        mode: 'insensitive',
      };
      herbalWhere.form = {
        startsWith: query.letter,
        mode: 'insensitive',
      };
    }

    const [drugFormCounts, herbalFormCounts] = await Promise.all([
      prisma.drugBrand.groupBy({
        by: ['form'],
        _count: {
          _all: true,
        },
        where: drugWhere,
      }),
      prisma.herbalBrand.groupBy({
        by: ['form'],
        _count: {
          _all: true,
        },
        where: herbalWhere,
      }),
    ]);

    const formMap = new Map<string, number>();

    drugFormCounts.forEach((f) => {
      if (f.form) {
        formMap.set(f.form, (formMap.get(f.form) || 0) + f._count._all);
      }
    });

    herbalFormCounts.forEach((f) => {
      if (f.form) {
        formMap.set(f.form, (formMap.get(f.form) || 0) + f._count._all);
      }
    });

    const allForms = Array.from(formMap.entries())
      .map(([form, count]) => ({ form, count }))
      .sort((a, b) => a.form.localeCompare(b.form));

    const total = allForms.length;
    const data = allForms.slice(skip, skip + limit);

    return { data, total };
  }
}

export const medicineRepository = new MedicineRepository();
