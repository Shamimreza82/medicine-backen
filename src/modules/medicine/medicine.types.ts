import { z } from 'zod';

import { searchMedicineQuerySchema } from './medicine.validation';

export type MedicineSearchQuery = z.infer<typeof searchMedicineQuerySchema>;

export interface BrandResponse {
  id: number;
  name: string;
  form: string | null;
  strength: string | null;
  price: string | null;
  packSize: string | null;
  isSponsored: boolean;
  company: {
    id: number;
    name: string;
  };
  generic: {
    id: number;
    name: string;
    therapeuticGenerics?: Array<{
      therapeutic: {
        id: number;
        name: string;
      };
    }>;
  };
}

export interface GenericResponse {
  id: number;
  name: string;
  indication: string | null;
  administration: string | null;
  adultDose: string | null;
  childDose: string | null;
  renalDose: string | null;
  therapeuticClass?: string | null;
  therapeuticGenerics?: Array<{
    therapeutic: {
      id: number;
      name: string;
    };
  }>;
}

export interface IndicationResponse {
  id: number;
  name: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
}

export interface CombinedSearchResponse {
  brands: BrandResponse[];
  generics: GenericResponse[];
  indications: IndicationResponse[];
  companies: CompanyResponse[];
}
