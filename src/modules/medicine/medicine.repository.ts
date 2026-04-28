import { prisma } from '@/bootstrap/prisma';

const activeProductWhere = {
  isActive: true,
  status: 'ACTIVE' as const,
};

export const MedicineRepository = {
  searchBrands(query: string, limit: number) {
    return prisma.brand.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { generic: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      orderBy: { name: 'asc' },
      take: limit,
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
          },
        },
        generic: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        products: {
          where: activeProductWhere,
          orderBy: [{ strength: 'asc' }, { dosageForm: 'asc' }],
          take: 5,
        },
      },
    });
  },

  searchGenerics(query: string, limit: number) {
    return prisma.generic.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
          { scientificName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: limit,
      include: {
        detail: true,
        brands: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
          take: 5,
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  findBrandProducts(brandId: string) {
    return prisma.brand.findFirst({
      where: {
        id: brandId,
        isActive: true,
      },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
          },
        },
        generic: {
          include: {
            detail: true,
          },
        },
        products: {
          where: activeProductWhere,
          orderBy: [{ strength: 'asc' }, { dosageForm: 'asc' }],
        },
      },
    });
  },

  findGenericDoseTemplate(genericId: string) {
    return prisma.generic.findFirst({
      where: {
        id: genericId,
        isActive: true,
      },
      include: {
        detail: true,
      },
    });
  },

  findDiseaseSuggestions(diseaseId: string, limit: number) {
    return prisma.genericIndication.findMany({
      where: {
        diseaseId,
      },
      orderBy: [{ isPrimary: 'desc' }, { generic: { name: 'asc' } }],
      take: limit,
      include: {
        disease: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        generic: {
          include: {
            detail: true,
            brands: {
              where: { isActive: true },
              orderBy: { name: 'asc' },
              take: 5,
              include: {
                manufacturer: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                products: {
                  where: activeProductWhere,
                  orderBy: [{ strength: 'asc' }, { dosageForm: 'asc' }],
                  take: 5,
                },
              },
            },
          },
        },
      },
    });
  },

  findGenericWithWarnings(genericId: string) {
    return prisma.generic.findFirst({
      where: {
        id: genericId,
        isActive: true,
      },
      include: {
        pregnancyCategory: true,
        lactationWarning: true,
        contraindications: {
          orderBy: { condition: 'asc' },
        },
      },
    });
  },

  findInteractions(candidateGenericId: string, currentGenericIds: string[]) {
    if (currentGenericIds.length === 0) {
      return Promise.resolve([]);
    }

    return prisma.drugInteraction.findMany({
      where: {
        OR: [
          {
            sourceGenericId: candidateGenericId,
            targetGenericId: {
              in: currentGenericIds,
            },
          },
          {
            targetGenericId: candidateGenericId,
            sourceGenericId: {
              in: currentGenericIds,
            },
          },
        ],
      },
      include: {
        sourceGeneric: {
          select: {
            id: true,
            name: true,
          },
        },
        targetGeneric: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ severity: 'desc' }, { updatedAt: 'desc' }],
    });
  },
};
