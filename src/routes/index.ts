import { Router } from 'express';

import { labTestRoutes } from '@/modules/lab-test/labTest.route';
import { medicineRoutes } from '@/modules/medicine/medicine.route';
import { adminRoutes } from '@/modules/admin/admin.route';

export const apiRouter = Router();

apiRouter.use('/lab-tests', labTestRoutes);
apiRouter.use('/medicines', medicineRoutes);
apiRouter.use('/admin', adminRoutes);
