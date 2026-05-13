import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest';

import { medicineController } from './medicine.controller';
import { getMedicineSchema, searchMedicineSchema } from './medicine.validation';

const router = Router();

router.get(
  '/brands',
  validateRequest(searchMedicineSchema),
  medicineController.searchBrands,
);

router.get(
  '/brands/:id',
  validateRequest(getMedicineSchema),
  medicineController.getBrandById,
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

router.get(
  '/classifications',
  medicineController.getClassificationTree,
);

router.get(
  '/search',
  validateRequest(searchMedicineSchema),
  medicineController.combinedSearch,
);

export const medicineRoutes = router;
