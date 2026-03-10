import { Router } from 'express';

import { authRouter } from '../modules/auth';
import { healthRouter } from '../modules/health';
import { userRouter } from '../modules/users';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
