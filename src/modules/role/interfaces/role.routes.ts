import { Router } from "express";

import { validateRequest } from "@/middlewares/validateRequest";
import { baseQuerySchema } from "@/shared/utils/validation/baseQuery.validation";

import { RoleController } from "./role.controller";


const router = Router();

router.get("/", validateRequest(baseQuerySchema), RoleController.getRoles)

export const roleRoutes = router;
