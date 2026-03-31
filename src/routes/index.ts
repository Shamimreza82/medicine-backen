import { Router } from 'express';

import { authRoutes } from '@/modules/auth/auth.route';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);




// POST   /api/v1/auth/register
// POST   /api/v1/auth/login
// POST   /api/v1/auth/logout
// POST   /api/v1/auth/refresh-token
// POST   /api/v1/auth/forgot-password
// POST   /api/v1/auth/reset-password
// POST   /api/v1/auth/change-password
// POST   /api/v1/auth/verify-email
// POST   /api/v1/auth/resend-verification
// GET    /api/v1/auth/me
// POST   /api/v1/auth/switch-hospital
