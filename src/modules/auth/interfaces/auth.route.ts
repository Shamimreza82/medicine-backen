import { Router } from 'express';

import { login, logout, refreshToken, register } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logout);






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