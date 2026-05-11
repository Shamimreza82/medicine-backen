import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest';

import { LabTestController } from './labTest.controller';
import { searchLabTestSchema } from './labTest.validation';

const router = Router();

router.get(
  '/search',
  validateRequest(searchLabTestSchema),
  LabTestController.searchLabTests,
);

export const labTestRoutes = router;
