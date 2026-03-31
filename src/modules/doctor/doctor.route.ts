import { Router } from 'express';

import { auth } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { Role } from '@/shared/constend/auth.const';


import { DoctorControllers } from './doctor.controller';
import { DoctorValidationSchemas } from './doctor.validation';




const router = Router();

//doctors/
router.post(
  '/',
  auth(Role.SUPER_ADMIN),
  validateRequest(DoctorValidationSchemas.doctorRegisterSchema),
  DoctorControllers.createDoctor,
);


export const doctorRoutes = router;

