import { Router } from 'express';

import { labTestRoutes } from '@/modules/lab-test/labTest.route';
import { medicineRoutes } from '@/modules/medicine/medicine.route';



export const apiRouter = Router();

apiRouter.use('/lab-tests', labTestRoutes);
apiRouter.use('/medicines', medicineRoutes);
