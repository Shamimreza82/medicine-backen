import { Router } from 'express';

import { validateRequest } from '@/middlewares/validateRequest';

import { AuthControllers} from './auth.controller';
import { AuthValidationSchemas } from '../domain/auth.schema';

const router = Router();

router.post('/register', validateRequest(AuthValidationSchemas.registerSchema), AuthControllers.register);
router.post('/login',  validateRequest(AuthValidationSchemas.loginSchema), AuthControllers.login);
router.post('/refresh-token', AuthControllers.refreshToken);

export const authRoutes = router;
