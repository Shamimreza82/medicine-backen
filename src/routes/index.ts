import { Router } from 'express';

import { authRoutes } from '@/modules/auth/interfaces/auth.route';
import { healthRouter } from '@/modules/health/interfaces/health.route';
import { hospitalRoutes } from '@/modules/hospital/interfaces/hospital.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/hospitals', hospitalRoutes);
