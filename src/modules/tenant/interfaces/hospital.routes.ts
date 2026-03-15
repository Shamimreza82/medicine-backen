import { Router } from 'express';

import { authPermission } from '@/middlewares/authPermission';
import { validateRequest } from '@/middlewares/validateRequest';

import { TenantController } from './hospital.controller';
import { createTenantSchema } from '../validation/tenant.validation';


const router = Router();

router.post('/',
    authPermission("USER:CREATE"),
    validateRequest(createTenantSchema),
    TenantController.createTenant);

export const tenantRoutes = router;
