import type { LactationRiskLevel, PregnancyRiskLevel, SeverityLevel } from '@prisma/client';

export interface MedicineSearchQuery {
  q: string;
  limit: number;
}

export interface MedicineProductSuggestion {
  id: string;
  strength: string;
  dosageForm: string;
  route: string | null;
  packSize: string | null;
  unitPerPack: number | null;
  price: string | null;
  isPrescriptionRequired: boolean;
}

export interface MedicineBrandSuggestion {
  id: string;
  name: string;
  slug: string;
  manufacturer: {
    id: string;
    name: string;
  };
  generic: {
    id: string;
    name: string;
    slug: string;
  };
  products: MedicineProductSuggestion[];
}

export interface MedicineGenericSuggestion {
  id: string;
  name: string;
  slug: string;
  scientificName: string | null;
  drugClass: string | null;
  therapeuticClass: string | null;
  commonDoseTemplate: {
    adultDose: string | null;
    childDose: string | null;
    dosageGuideline: string | null;
    administration: string | null;
  };
  availableBrands: Array<{
    id: string;
    name: string;
  }>;
}

export interface MedicineDoseTemplate {
  genericId: string;
  genericName: string;
  adultDose: string | null;
  childDose: string | null;
  dosageGuideline: string | null;
  administration: string | null;
  monitoring: string | null;
  precaution: string | null;
}

export interface MedicineWarningCheckInput {
  candidateGenericId: string;
  currentGenericIds?: string[];
  pregnancy?: boolean;
  lactation?: boolean;
  allergyNotes?: string[];
}

export interface MedicineWarningSummary {
  pregnancy: null | {
    category: PregnancyRiskLevel;
    warning: string | null;
    recommendation: string | null;
  };
  lactation: null | {
    riskLevel: LactationRiskLevel;
    warning: string | null;
    recommendation: string | null;
  };
  contraindications: Array<{
    condition: string;
    note: string | null;
  }>;
  interactions: Array<{
    withGenericId: string;
    withGenericName: string;
    severity: SeverityLevel;
    effect: string | null;
    management: string | null;
    note: string | null;
  }>;
  allergyAdvisory: string | null;
}
