import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';

import { MedicineRepository } from './medicine.repository';
import type {
  MedicineBrandSuggestion,
  MedicineDoseTemplate,
  MedicineGenericSuggestion,
  MedicineProductSuggestion,
  MedicineSearchQuery,
  MedicineWarningCheckInput,
  MedicineWarningSummary,
} from './medicine.types';

const mapProduct = (product: {
  id: string;
  strength: string;
  dosageForm: string;
  route: string | null;
  packSize: string | null;
  unitPerPack: number | null;
  price: { toString(): string } | null;
  isPrescriptionRequired: boolean;
}): MedicineProductSuggestion => ({
  id: product.id,
  strength: product.strength,
  dosageForm: product.dosageForm,
  route: product.route,
  packSize: product.packSize,
  unitPerPack: product.unitPerPack,
  price: product.price?.toString() ?? null,
  isPrescriptionRequired: product.isPrescriptionRequired,
});

const buildAllergyAdvisory = (allergyNotes: string[], contraindications: string[]) => {
  if (allergyNotes.length === 0) {
    return null;
  }

  return `Patient allergy notes: ${allergyNotes.join(', ')}. This app does not yet have structured allergy-to-medicine matching, so confirm manually against the contraindications and ingredient list. Relevant contraindications: ${contraindications.join(', ') || 'none listed'}.`;
};

export const MedicineService = {
  async searchMedicines(query: MedicineSearchQuery) {
    const [brands, generics] = await Promise.all([
      MedicineRepository.searchBrands(query.q, query.limit),
      MedicineRepository.searchGenerics(query.q, query.limit),
    ]);

    const brandSuggestions: MedicineBrandSuggestion[] = brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      manufacturer: brand.manufacturer,
      generic: brand.generic,
      products: brand.products.map(mapProduct),
    }));

    const genericSuggestions: MedicineGenericSuggestion[] = generics.map((generic) => ({
      id: generic.id,
      name: generic.name,
      slug: generic.slug,
      scientificName: generic.scientificName,
      drugClass: generic.drugClass,
      therapeuticClass: generic.therapeuticClass,
      commonDoseTemplate: {
        adultDose: generic.detail?.adultDose ?? null,
        childDose: generic.detail?.childDose ?? null,
        dosageGuideline: generic.dosageGuideline ?? null,
        administration: generic.detail?.administration ?? null,
      },
      availableBrands: generic.brands,
    }));

    return {
      brands: brandSuggestions,
      generics: genericSuggestions,
    };
  },

  async searchBrands(query: MedicineSearchQuery) {
    const brands = await MedicineRepository.searchBrands(query.q, query.limit);

    return brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      manufacturer: brand.manufacturer,
      generic: brand.generic,
      products: brand.products.map(mapProduct),
    }));
  },

  async searchGenerics(query: MedicineSearchQuery) {
    const generics = await MedicineRepository.searchGenerics(query.q, query.limit);

    return generics.map((generic) => ({
      id: generic.id,
      name: generic.name,
      slug: generic.slug,
      scientificName: generic.scientificName,
      drugClass: generic.drugClass,
      therapeuticClass: generic.therapeuticClass,
      commonDoseTemplate: {
        adultDose: generic.detail?.adultDose ?? null,
        childDose: generic.detail?.childDose ?? null,
        dosageGuideline: generic.dosageGuideline ?? null,
        administration: generic.detail?.administration ?? null,
      },
      availableBrands: generic.brands,
    }));
  },

  async getBrandProducts(brandId: string) {
    const brand = await MedicineRepository.findBrandProducts(brandId);

    if (!brand) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Brand not found');
    }

    return {
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      },
      manufacturer: brand.manufacturer,
      generic: {
        id: brand.generic.id,
        name: brand.generic.name,
        slug: brand.generic.slug,
      },
      commonDoseTemplate: {
        adultDose: brand.generic.detail?.adultDose ?? null,
        childDose: brand.generic.detail?.childDose ?? null,
        dosageGuideline: brand.generic.dosageGuideline ?? null,
        administration: brand.generic.detail?.administration ?? null,
      },
      products: brand.products.map(mapProduct),
      strengths: [...new Set(brand.products.map((product) => product.strength))],
      dosageForms: [...new Set(brand.products.map((product) => product.dosageForm))],
    };
  },

  async getGenericDoseTemplate(genericId: string): Promise<MedicineDoseTemplate> {
    const generic = await MedicineRepository.findGenericDoseTemplate(genericId);

    if (!generic) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Generic medicine not found');
    }

    return {
      genericId: generic.id,
      genericName: generic.name,
      adultDose: generic.detail?.adultDose ?? null,
      childDose: generic.detail?.childDose ?? null,
      dosageGuideline: generic.dosageGuideline ?? null,
      administration: generic.detail?.administration ?? null,
      monitoring: generic.detail?.monitoring ?? null,
      precaution: generic.detail?.precaution ?? null,
    };
  },

  async getDiseaseSuggestions(diseaseId: string, limit: number) {
    const suggestions = await MedicineRepository.findDiseaseSuggestions(diseaseId, limit);

    if (suggestions.length === 0) {
      throw new AppError(StatusCodes.NOT_FOUND, 'No medicine suggestions found for this disease');
    }

    const firstSuggestion = suggestions[0];

    if (!firstSuggestion) {
      throw new AppError(StatusCodes.NOT_FOUND, 'No medicine suggestions found for this disease');
    }

    return {
      disease: firstSuggestion.disease,
      medicines: suggestions.map((item) => ({
        genericId: item.generic.id,
        genericName: item.generic.name,
        genericSlug: item.generic.slug,
        isPrimary: item.isPrimary,
        note: item.note,
        commonDoseTemplate: {
          adultDose: item.generic.detail?.adultDose ?? null,
          childDose: item.generic.detail?.childDose ?? null,
          dosageGuideline: item.generic.dosageGuideline ?? null,
          administration: item.generic.detail?.administration ?? null,
        },
        brands: item.generic.brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          manufacturer: brand.manufacturer,
          products: brand.products.map(mapProduct),
        })),
      })),
    };
  },

  async checkWarnings(input: MedicineWarningCheckInput): Promise<MedicineWarningSummary> {
    const generic = await MedicineRepository.findGenericWithWarnings(input.candidateGenericId);

    if (!generic) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Generic medicine not found');
    }

    const currentGenericIds = [...new Set(input.currentGenericIds ?? [])].filter(
      (genericId) => genericId !== input.candidateGenericId,
    );

    const interactions = await MedicineRepository.findInteractions(generic.id, currentGenericIds);
    const contraindications = generic.contraindications.map((item) => item.condition);

    return {
      pregnancy: input.pregnancy
        ? generic.pregnancyCategory
          ? {
              category: generic.pregnancyCategory.category,
              warning: generic.pregnancyCategory.warning,
              recommendation: generic.pregnancyCategory.recommendation,
            }
          : null
        : null,
      lactation: input.lactation
        ? generic.lactationWarning
          ? {
              riskLevel: generic.lactationWarning.riskLevel,
              warning: generic.lactationWarning.warning,
              recommendation: generic.lactationWarning.recommendation,
            }
          : null
        : null,
      contraindications: generic.contraindications.map((item) => ({
        condition: item.condition,
        note: item.note,
      })),
      interactions: interactions.map((interaction) => {
        const counterpart =
          interaction.sourceGenericId === generic.id
            ? interaction.targetGeneric
            : interaction.sourceGeneric;

        return {
          withGenericId: counterpart.id,
          withGenericName: counterpart.name,
          severity: interaction.severity,
          effect: interaction.effect,
          management: interaction.management,
          note: interaction.note,
        };
      }),
      allergyAdvisory: buildAllergyAdvisory(input.allergyNotes ?? [], contraindications),
    };
  },
};
