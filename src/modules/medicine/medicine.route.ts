import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest';

import { medicineController } from './medicine.controller';
import {
  createBrandSchema,
  createCompanySchema,
  createGenericSchema,
  createIndicationSchema,
  getMedicineSchema,
  searchMedicineSchema,
  updateBrandSchema,
  updateCompanySchema,
  updateGenericSchema,
  updateIndicationSchema,
} from './medicine.validation';

const router = Router();

router.get(
  '/brands',
  validateRequest(searchMedicineSchema),
  medicineController.searchBrands,
);

router.get(
  '/stats',
  medicineController.getStats,
);

router.get(
  '/brands/:id',
  validateRequest(getMedicineSchema),
  medicineController.getBrandById,
);

router.post(
  '/brands',
  validateRequest(createBrandSchema),
  medicineController.createBrand,
);

router.patch(
  '/brands/:id',
  validateRequest(updateBrandSchema),
  medicineController.updateBrand,
);

router.get(
  '/generics',
  validateRequest(searchMedicineSchema),
  medicineController.searchGenerics,
);

router.get(
  '/generics/:id',
  validateRequest(getMedicineSchema),
  medicineController.getGenericById,
);

router.post(
  '/generics',
  validateRequest(createGenericSchema),
  medicineController.createGeneric,
);

router.patch(
  '/generics/:id',
  validateRequest(updateGenericSchema),
  medicineController.updateGeneric,
);

router.get(
  '/indications',
  validateRequest(searchMedicineSchema),
  medicineController.searchIndications,
);

router.get(
  '/indications/:id',
  validateRequest(getMedicineSchema),
  medicineController.getIndicationById,
);

router.post(
  '/indications',
  validateRequest(createIndicationSchema),
  medicineController.createIndication,
);

router.patch(
  '/indications/:id',
  validateRequest(updateIndicationSchema),
  medicineController.updateIndication,
);

router.get(
  '/companies',
  validateRequest(searchMedicineSchema),
  medicineController.searchCompanies,
);

router.get(
  '/companies/:id',
  validateRequest(getMedicineSchema),
  medicineController.getCompanyById,
);

router.post(
  '/companies',
  validateRequest(createCompanySchema),
  medicineController.createCompany,
);

router.patch(
  '/companies/:id',
  validateRequest(updateCompanySchema),
  medicineController.updateCompany,
);

router.get(
  '/pregnancy-categories',
  medicineController.getPregnancyCategories,
);

router.get(
  '/classifications',
  medicineController.getClassificationTree,
);

router.get(
  '/dosage-forms',
  medicineController.getDistinctForms,
);

router.get(
  '/search',
  validateRequest(searchMedicineSchema),
  medicineController.combinedSearch,
);

export const medicineRoutes = router;
