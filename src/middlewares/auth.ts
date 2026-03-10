import { verifyAccessToken } from '../modules/auth/infrastructure/auth.token';
import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export const auth: RequestHandler = (req, _res, next) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    throw new AppError(401, 'Unauthorized');
  }

  const token = authHeader.replace(/^Bearer\s+/iu, '').trim();
  if (!token) {
    throw new AppError(401, 'Unauthorized');
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new AppError(401, 'Unauthorized');
  }
};
