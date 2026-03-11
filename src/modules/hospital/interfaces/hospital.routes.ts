import { Router } from "express";

import { validateRequest } from "@/middlewares/validateRequest";

import { hospitalController } from "./hospital.controller";
import { createHospitalSchema } from "../validation/hospital.validation";

const router = Router();

router.post('/', 
    validateRequest(createHospitalSchema),
    hospitalController.createHospital)

export const hospitalRoutes = router;