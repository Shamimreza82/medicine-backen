import { Router } from 'express';

import { LabTestController } from './labTest.controller';

const router = Router();

router.get('/search', LabTestController.searchLabTests);

export const labTestRoutes = router;
