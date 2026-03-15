import { Router } from "express";

import { validateRequest } from "@/middlewares/validateRequest";
import { baseQuerySchema } from "@/shared/utils/validation/baseQuery.validation";

import { RoleController } from "./role.controller";
import { PermissionValidationSchema } from "../validation/permission.validation";
import { RoleValidationSchemas } from "../validation/role.validation";


const router = Router();

router.get("/", validateRequest(baseQuerySchema), RoleController.getRoles)

router.post(
  "/",
  validateRequest(RoleValidationSchemas.createRoleSchema),
  RoleController.createRole
);

router.post(
  "/:roleId/permissions",
  validateRequest(PermissionValidationSchema.assignPermissionsSchema),
  RoleController.createPermission
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
