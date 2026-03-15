import { Router } from 'express';

import { authPermission } from '@/middlewares/authPermission';
import { validateRequest } from '@/middlewares/validateRequest';


import { TenantController } from './tenant.controller';
import { createTenantSchema } from '../validation/tenant.validation';

const router = Router();

router.post(
  '/',
  authPermission('TENANT:CREATE'),
  validateRequest(createTenantSchema),
  TenantController.createTenant
);

export const tenantRoutes = router;



// ### 0) Common (used by every endpoint)

// - Header: `X-Tenant-Id: uuid` (or tenant from subdomain/domain)
// - Admin scopes:
//     - Platform Admin (manages all tenants)
//     - Tenant Admin (manages only own tenant)

// ---

// ## 1) Tenant Lifecycle (CRUD)

// - `POST /api/v1/tenants` (create)
// - `GET /api/v1/tenants` (list with `page, limit, status, search, tenantTypeId`)
// - `GET /api/v1/tenants/:tenantId` (details)
// - `PATCH /api/v1/tenants/:tenantId` (update basic info)
// - `DELETE /api/v1/tenants/:tenantId` (soft delete)
// - `POST /api/v1/tenants/:tenantId/restore-deleted` (restore soft-deleted tenant)

// ---

// ## 2) Tenant Status + Operations

// - `POST /api/v1/tenants/:tenantId/activate`
// - `POST /api/v1/tenants/:tenantId/suspend`
// - `POST /api/v1/tenants/:tenantId/archive`
// - `POST /api/v1/tenants/:tenantId/restore` (restore from archive/suspend)
// - `POST /api/v1/tenants/:tenantId/maintenance/enable`
// - `POST /api/v1/tenants/:tenantId/maintenance/disable`

// ---

// ## 3) Tenant Resolve + Context (important for frontend)

// - `GET /api/v1/tenants/resolve?host=app.citycare.com` (resolve by domain/subdomain)
// - `GET /api/v1/tenants/by-slug/:slug` (resolve by slug)
// - `GET /api/v1/tenants/me` (current tenant info from token/header)

// ---

// ## 4) Tenant Settings

// - `GET /api/v1/tenants/:tenantId/settings`
// - `PATCH /api/v1/tenants/:tenantId/settings`
// - `PATCH /api/v1/tenants/:tenantId/settings/reset` (reset to defaults)

// ---

// ## 5) Tenant Feature Flags (with config)

// - `GET /api/v1/tenants/:tenantId/features`
// - `GET /api/v1/tenants/:tenantId/features/effective` (global + plan + override merged)
// - `POST /api/v1/tenants/:tenantId/features/:featureId/enable`
// - `POST /api/v1/tenants/:tenantId/features/:featureId/disable`
// - `PATCH /api/v1/tenants/:tenantId/features/:featureId` (update config)
// - `PATCH /api/v1/tenants/:tenantId/features` (bulk update)