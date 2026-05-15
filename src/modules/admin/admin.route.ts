import { Router } from 'express';
import { adminController } from './admin.controller';

const router = Router();

router.get('/dashboard', adminController.getDashboardData);

export const adminRoutes = router;
