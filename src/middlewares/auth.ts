import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TJwtPayload } from '@/modules/auth/domain/auth.types';
import { findUserById } from '@/modules/auth/infrastructure/auth.repository';
import { verifyAccessToken } from '@/modules/auth/infrastructure/auth.token';
import { AppError } from '@/shared/errors/AppError';
import { catchAsync } from '@/shared/utils/catchAsync';

import type { Logger } from 'pino';


declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
    log?: Logger;
    user?: {
      id: string;
      role: string;
    };
  }
}


export const auth: RequestHandler = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(401, "Unauthorized: Token missing");
  }

  const token = authHeader.split(" ")[1]
  const decoded = verifyAccessToken(token!)

  const user = await findUserById(decoded.userId)

  if (user && user?.status === "INACTIVE" || user?.status === "LOCKED" || user?.status === "SUSPENDED") {
    throw new AppError(StatusCodes.LOCKED, `Account temporarily ${user.status}, please contect admin`)
  }
    req.user = decoded
  next()

})  
