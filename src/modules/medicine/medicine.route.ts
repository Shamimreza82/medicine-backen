import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest';

import { medicineController } from './medicine.controller';
import { searchMedicineSchema } from './medicine.validation';

const router = Router();

router.get(
  '/brands',
  validateRequest(searchMedicineSchema),
  medicineController.searchBrands,
);

router.get(
  '/generics',
  validateRequest(searchMedicineSchema),
  medicineController.searchGenerics,
);

router.get(
  '/indications',
  validateRequest(searchMedicineSchema),
  medicineController.searchIndications,
);

router.get(
  '/search',
  validateRequest(searchMedicineSchema),
  medicineController.combinedSearch,
);

export const medicineRoutes = router;
