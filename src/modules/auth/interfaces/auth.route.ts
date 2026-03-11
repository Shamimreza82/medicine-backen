import { Router } from 'express';

import { registerController } from './auth.controller';



const router = Router();

router.post('/register', registerController);

export const authRoutes = router;

// router.post('/login', login);
// router.post('/refresh-token', refreshToken);
// router.post('/logout', logout);

// import { Router } from 'express'
// import {
//   loginController,
//   logoutController,
//   refreshTokenController,
//   registerController,
// } from './auth.controller'
// import { validateRequest } from '../../../middlewares/validateRequest'
// import {
//   loginSchema,
//   refreshTokenSchema,
//   registerSchema,
// } from '../domain/auth.schema'
// import { authenticate } from '../../../middlewares/authenticate'

// const router = Router()

// router.post('/register', validateRequest(registerSchema), registerController)
// router.post('/login', validateRequest(loginSchema), loginController)
// router.post('/refresh-token', validateRequest(refreshTokenSchema), refreshTokenController)
// router.post('/logout', authenticate, logoutController)

// export default router
