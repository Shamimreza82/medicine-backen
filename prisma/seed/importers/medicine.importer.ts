import fs from 'fs/promises';
import path from 'path';

import { PrismaClient } from '@prisma/client';

import { batchInsert } from '../helpers/batch';

const DATA_ROOT = path.join(process.cwd(), 'data/medicine_data');

const loadJson = async (fileName: string): Promise<Record<string, string>[]> => {
  const filePath = path.join(DATA_ROOT, fileName);
  const rawData = await fs.readFile(filePath, 'utf8');
  return JSON.parse(rawData) as Record<string, string>[];
};

export const importCompanies = async (prisma: PrismaClient) => {
  const data = await loadJson('t_company_name.json');
  const cleaned = data.map((item) => ({
    id: parseInt(item.company_id, 10),
    name: item.company_name.trim(),
    order: parseInt(item.company_order ?? '0', 10),
  }));
  await batchInsert(prisma, 'company', cleaned);
};

export const importPregnancyCategories = async (prisma: PrismaClient) => {
  const data = await loadJson('t_pregnancy_category.json');
  const cleaned = data.map((item) => ({
    id: parseInt(item.pregnancy_id, 10),
    name: item.pregnancy_name,
    description: item.pregnancy_description,
  }));
  await batchInsert(prisma, 'pregnancyCategory', cleaned);
};

export const importDrugGenerics = async (prisma: PrismaClient) => {
  const data = await loadJson('t_drug_generic.json');

  const validCategories = await prisma.pregnancyCategory.findMany({
    select: { id: true },
  });
  const validCategoryIds = new Set(validCategories.map((c) => c.id));

  const cleaned = data.map((item) => {
    let pregnancyCategoryId = item.pregnancy_category_id ? parseInt(item.pregnancy_category_id, 10) : null;

    if (pregnancyCategoryId !== null && !validCategoryIds.has(pregnancyCategoryId)) {
      pregnancyCategoryId = null;
    }

    return {
      id: parseInt(item.generic_id, 10),
      name: item.generic_name.trim(),
      indication: item.indication,
      administration: item.administration,
      adultDose: item.adult_dose,
      childDose: item.child_dose,
      renalDose: item.renal_dose,
      contraIndication: item.contra_indication,
      precaution: item.precaution,
      sideEffect: item.side_effect,
      interaction: item.interaction,
      modeOfAction: item.mode_of_action,
      pregnancyCategoryId,
      pregnancyCategoryNote: item.pregnancy_category_note,
    };
  });
  await batchInsert(prisma, 'drugGeneric', cleaned);
};

export const importDrugBrands = async (prisma: PrismaClient) => {
  const data = await loadJson('t_drug_brand.json');

  const validCompanies = await prisma.company.findMany({ select: { id: true } });
  const validGenerics = await prisma.drugGeneric.findMany({ select: { id: true } });

  const validCompanyIds = new Set(validCompanies.map((c) => c.id));
  const validGenericIds = new Set(validGenerics.map((g) => g.id));

  const cleaned = data
    .filter((item) => {
      const companyId = parseInt(item.company_id, 10);
      const genericId = parseInt(item.generic_id, 10);
      return validCompanyIds.has(companyId) && validGenericIds.has(genericId);
    })
    .map((item) => ({
      id: parseInt(item.brand_id, 10),
      name: item.brand_name.trim(),
      companyId: parseInt(item.company_id, 10),
      genericId: parseInt(item.generic_id, 10),
      form: item.form,
      packSize: item.packsize,
      price: item.price,
      strength: item.strength,
    }));
  await batchInsert(prisma, 'drugBrand', cleaned);
};

export const importHerbalGenerics = async (prisma: PrismaClient) => {
  const data = await loadJson('t_herbal_generic.json');
  const cleaned = data.map((item) => ({
    id: parseInt(item.generic_id, 10),
    name: item.generic_name.trim(),
    composition: item.composition,
    indication: item.indication,
    description: item.description,
    dosage: item.dosage,
    sideEffects: item.side_effects,
    contraindication: item.contraindication,
    drugInteraction: item.drug_interaction,
    precaution: item.precaution,
    pregnancyLactation: item.pregnancy_lactation,
    modeOfActions: item.mode_of_actions,
    therapeuticClass: item.therapeutic_class,
  }));
  await batchInsert(prisma, 'herbalGeneric', cleaned);
};

export const importHerbalBrands = async (prisma: PrismaClient) => {
  const data = await loadJson('t_herbal_brand.json');

  const validCompanies = await prisma.company.findMany({ select: { id: true } });
  const validGenerics = await prisma.herbalGeneric.findMany({ select: { id: true } });

  const validCompanyIds = new Set(validCompanies.map((c) => c.id));
  const validGenericIds = new Set(validGenerics.map((g) => g.id));

  const cleaned = data
    .filter((item) => {
      const companyId = parseInt(item.company_id, 10);
      const genericId = parseInt(item.generic_id, 10);
      return validCompanyIds.has(companyId) && validGenericIds.has(genericId);
    })
    .map((item) => ({
      id: parseInt(item.brand_id, 10),
      name: item.brand_name.trim(),
      companyId: parseInt(item.company_id, 10),
      genericId: parseInt(item.generic_id, 10),
      form: item.form,
      packSize: item.packsize,
      price: item.price,
      strength: item.strength,
    }));
  await batchInsert(prisma, 'herbalBrand', cleaned);
};

export const importIndications = async (prisma: PrismaClient) => {
  const data = await loadJson('t_indication.json');
  const cleaned = data.map((item) => ({
    id: parseInt(item.indication_id, 10),
    name: item.indication_name.trim(),
  }));
  await batchInsert(prisma, 'indication', cleaned);
};

export const importIndicationGenericMap = async (prisma: PrismaClient) => {
  const data = await loadJson('t_indication_generic_index.json');

  const validGenerics = await prisma.drugGeneric.findMany({ select: { id: true } });
  const validIndications = await prisma.indication.findMany({ select: { id: true } });

  const validGenericIds = new Set(validGenerics.map((g) => g.id));
  const validIndicationIds = new Set(validIndications.map((i) => i.id));

  const cleaned = data
    .filter((item) => {
      const genericId = parseInt(item.generic_id, 10);
      const indicationId = parseInt(item.indication_id, 10);
      return validGenericIds.has(genericId) && validIndicationIds.has(indicationId);
    })
    .map((item) => ({
      id: parseInt(item.id, 10),
      genericId: parseInt(item.generic_id, 10),
      indicationId: parseInt(item.indication_id, 10),
    }));
  await batchInsert(prisma, 'indicationGeneric', cleaned);
};

export const importSystemic = async (prisma: PrismaClient) => {
  const data = await loadJson('t_systemic.json');
  const cleaned = data.map((item) => {
    const parentId = parseInt(item.systemic_parent_id ?? '0', 10);
    return {
      id: parseInt(item.systemic_id, 10),
      name: item.systemic_name.trim(),
      parentId: parentId === 0 ? null : parentId,
    };
  });
  await batchInsert(prisma, 'systemic', cleaned);
};

export const importTherapeutics = async (prisma: PrismaClient) => {
  const data = await loadJson('t_therapitic.json');

  const validSystemics = await prisma.systemic.findMany({ select: { id: true } });
  const validSystemicIds = new Set(validSystemics.map((s) => s.id));

  const cleaned = data
    .filter((item) => {
      const systemicId = parseInt(item.therapitic_systemic_class_id, 10);
      return validSystemicIds.has(systemicId);
    })
    .map((item) => ({
      id: parseInt(item.therapitic_id, 10),
      name: item.therapitic_name.trim(),
      systemicClassId: parseInt(item.therapitic_systemic_class_id, 10),
    }));
  await batchInsert(prisma, 'therapeutic', cleaned);
};

export const importTherapeuticGenericMap = async (prisma: PrismaClient) => {
  const data = await loadJson('t_therapitic_generic.json');

  const validGenerics = await prisma.drugGeneric.findMany({ select: { id: true } });
  const validTherapeutics = await prisma.therapeutic.findMany({ select: { id: true } });

  const validGenericIds = new Set(validGenerics.map((g) => g.id));
  const validTherapeuticIds = new Set(validTherapeutics.map((t) => t.id));

  const cleaned = data
    .filter((item) => {
      const genericId = parseInt(item.generic_id, 10);
      const therapeuticId = parseInt(item.therapitic_id, 10);
      return validGenericIds.has(genericId) && validTherapeuticIds.has(therapeuticId);
    })
    .map((item) => ({
      id: parseInt(item.id, 10),
      genericId: parseInt(item.generic_id, 10),
      therapeuticId: parseInt(item.therapitic_id, 10),
    }));
  await batchInsert(prisma, 'therapeuticGeneric', cleaned);
};

export const importSponsoredBrands = async (prisma: PrismaClient) => {
  const data = await loadJson('t_sponsored_brand.json');

  const validBrands = await prisma.drugBrand.findMany({ select: { id: true } });
  const validGenerics = await prisma.drugGeneric.findMany({ select: { id: true } });

  const validBrandIds = new Set(validBrands.map((b) => b.id));
  const validGenericIds = new Set(validGenerics.map((g) => g.id));

  const cleaned = data
    .filter((item) => {
      const brandId = parseInt(item.brand_id, 10);
      const genericId = parseInt(item.generic_id, 10);
      return validBrandIds.has(brandId) && validGenericIds.has(genericId);
    })
    .map((item) => ({
      brandId: parseInt(item.brand_id, 10),
      genericId: parseInt(item.generic_id, 10),
    }));
  await batchInsert(prisma, 'sponsoredBrand', cleaned);
};

/**
 * Main orchestration function for all medicine-related data.
 */
export const importMedicineData = async (prisma: PrismaClient) => {
  console.log('--- Starting Medicine Data Import ---');

  // Step 1: Independent tables
  await importCompanies(prisma);
  await importPregnancyCategories(prisma);
  await importIndications(prisma);
  await importSystemic(prisma);

  // Step 2: Dependent on Step 1
  await importTherapeutics(prisma);
  await importDrugGenerics(prisma);
  await importHerbalGenerics(prisma);

  // Step 3: Dependent on Generics/Companies
  await importDrugBrands(prisma);
  await importHerbalBrands(prisma);

  // Step 4: Junction/Mapping tables
  await importIndicationGenericMap(prisma);
  await importTherapeuticGenericMap(prisma);
  await importSponsoredBrands(prisma);

  console.log('--- Medicine Data Import Complete ---');
};
