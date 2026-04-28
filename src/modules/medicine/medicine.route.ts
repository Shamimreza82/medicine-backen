import { Router } from 'express';

import { MedicineController } from './medicine.controller';

const router = Router();

router.get('/search', MedicineController.searchMedicines);
router.get('/brands/search', MedicineController.searchBrands);
router.get('/generics/search', MedicineController.searchGenerics);
router.get('/brands/:brandId/products', MedicineController.getBrandProducts);
router.get('/generics/:genericId/dose-templates', MedicineController.getGenericDoseTemplate);
router.get('/diseases/:diseaseId/suggestions', MedicineController.getDiseaseSuggestions);
router.post('/check-warnings', MedicineController.checkWarnings);

export const medicineRoutes = router;
