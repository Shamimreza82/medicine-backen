import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { authRoutes } from '@/modules/auth/interfaces/auth.route';
import { roleRoutes } from '@/modules/role/interfaces/role.routes';
import { tenantRoutes } from '@/modules/tenant/interfaces/hospital.routes';


export const apiRouter = Router();


apiRouter.use('/auth', authRoutes);
apiRouter.use(auth)
apiRouter.use('/roles', roleRoutes);
apiRouter.use('/tenants', tenantRoutes);
