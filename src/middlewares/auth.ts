import { RequestHandler } from 'express';

import { assertActiveUser, findUserById, verifyAccessToken } from '@/modules/auth/auth.utils';
import { AppError } from '@/shared/errors/AppError';
import { catchAsync } from '@/shared/utils/catchAsync';

export const auth: RequestHandler = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized: Token missing');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token!);

  const user = await findUserById(decoded.userId);

  assertActiveUser(user?.status);
  
  req.user = decoded;
  next();
});
