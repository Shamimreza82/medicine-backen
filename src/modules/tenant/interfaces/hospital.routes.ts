import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest';

import { TenantController } from './hospital.controller';
import { createTenantSchema } from '../validation/tenant.validation';


const router = Router();

router.post('/', validateRequest(createTenantSchema), TenantController.createTenant);

export const hospitalRoutes = router;
