import { Router } from 'express';
import multer from 'multer';

import { validateRequest } from '@/middlewares/validateRequest';

import { LabTestController } from './labTest.controller';
import { 
  searchLabTestSchema, 
  createLabTestSchema, 
  updateLabTestSchema 
} from './labTest.validation';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get(
  '/search',
  validateRequest(searchLabTestSchema),
  LabTestController.searchLabTests,
);

router.post(
  '/bulk-upload',
  upload.single('file'),
  LabTestController.bulkUpload,
);

router.get(
  '/export-csv',
  LabTestController.exportToCsv,
);


router.get(
  '/:id',
  LabTestController.getLabTestById,
);

router.post(
  '/',
  validateRequest(createLabTestSchema),
  LabTestController.createLabTest,
);

router.patch(
  '/:id',
  validateRequest(updateLabTestSchema),
  LabTestController.updateLabTest,
);

router.delete(
  '/:id',
  LabTestController.deleteLabTest,
);

export const labTestRoutes = router;

