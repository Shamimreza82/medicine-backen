export interface ManufacturerCsvRow {
  name: string;
  slug: string;
  country?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  is_active?: string;
}

export interface GenericCsvRow {
  name: string;
  slug: string;
  scientific_name?: string;
  drug_class?: string;
  therapeutic_class?: string;
  description?: string;
  mechanism_of_action?: string;
  pharmacokinetics?: string;
  dosage_guideline?: string;
  is_active?: string;
}

export interface GenericDetailCsvRow {
  generic_slug: string;
  overview?: string;
  indication_summary?: string;
  adult_dose?: string;
  child_dose?: string;
  renal_dose_adjustment?: string;
  hepatic_dose_adjustment?: string;
  administration?: string;
  monitoring?: string;
  precaution?: string;
  storage_condition?: string;
  notes?: string;
}

export interface DiseaseCsvRow {
  name: string;
  slug: string;
  code?: string;
  description?: string;
  category?: string;
  is_active?: string;
}

export interface GenericIndicationCsvRow {
  generic_slug: string;
  disease_slug: string;
  note?: string;
  is_primary?: string;
}

export interface SideEffectCsvRow {
  generic_slug: string;
  effect: string;
  severity?: string;
  frequency?: string;
  note?: string;
}

export interface ContraindicationCsvRow {
  generic_slug: string;
  condition: string;
  note?: string;
}

export interface DrugInteractionCsvRow {
  source_generic_slug: string;
  target_generic_slug: string;
  severity?: string;
  effect?: string;
  management?: string;
  note?: string;
}

export interface PregnancyCategoryCsvRow {
  generic_slug: string;
  category?: string;
  warning?: string;
  recommendation?: string;
}

export interface LactationWarningCsvRow {
  generic_slug: string;
  risk_level?: string;
  warning?: string;
  recommendation?: string;
}

export interface BrandCsvRow {
  name: string;
  slug: string;
  manufacturer_slug: string;
  generic_slug: string;
  description?: string;
  is_active?: string;
}

export interface ProductCsvRow {
  brand_slug: string;
  sku?: string;
  strength: string;
  dosage_form: string;
  route?: string;
  pack_size?: string;
  unit_per_pack?: string;
  price?: string;
  status?: string;
  registration_number?: string;
  barcode?: string;
  is_prescription_required?: string;
  is_active?: string;
}