import { Router } from 'express';

import { labTestRoutes } from '@/modules/lab-test/labTest.route';


export const apiRouter = Router();

apiRouter.use('/lab-tests', labTestRoutes);

