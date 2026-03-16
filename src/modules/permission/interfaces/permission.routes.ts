import { Router } from "express";

import { authPermission } from '@/middlewares/authPermission';


import { PermissionController } from "./permission.controller";


const router = Router();
router.get('/',
    authPermission("PERMISSION:VIEW"),
    PermissionController.getPermissions)


export const permissionRoutes = router;
