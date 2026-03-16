import { Router } from 'express';

import { authPermission } from '@/middlewares/authPermission';
import { validateRequest } from '@/middlewares/validateRequest';
import { baseQuerySchema } from '@/shared/utils/validation/baseQuery.validation';

import { RoleController } from './role.controller';
import { PermissionValidationSchema } from '../validation/permission.validation';
import { RoleValidationSchemas } from '../validation/role.validation';

const router = Router();

router.get('/',
  
  validateRequest(baseQuerySchema), 
  RoleController.getRoles);

router.post(
  '/',
  authPermission('ROLE:CREATE'),
  validateRequest(RoleValidationSchemas.createRoleSchema),
  RoleController.createRole,
);

router.post(
  '/:roleId/permissions',
  authPermission('PERMISSION:ASSIGN'),
  validateRequest(PermissionValidationSchema.assignPermissionsSchema),
  RoleController.createPermission,
);

// router.patch(
//   "/:id",
//   validateRequest(roleSchemas.updateRoleSchema),
//   RoleController.updateRole
// );

// router.get(
//   "/:id",
//   validateRequest(roleSchemas.roleIdParamSchema),
//   RoleController.getSingleRole
// );

// router.delete(
//   "/:id",
//   validateRequest(roleSchemas.roleIdParamSchema),
//   RoleController.deleteRole
// );

export const roleRoutes = router;


// GET    /api/v1/roles
// POST   /api/v1/roles
// GET    /api/v1/roles/:id
// PATCH  /api/v1/roles/:id
// DELETE /api/v1/roles/:id

// GET    /api/v1/roles/:id/permissions
// PATCH  /api/v1/roles/:id/permissions