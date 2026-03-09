import { createHttpError } from '../common/httpError';
import { verifyAccessToken } from '../modules/auth/infrastructure/auth.token';

import type { RequestHandler } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  const token = authHeader.replace(/^Bearer\s+/iu, '').trim();
  if (!token) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(createHttpError(401, 'Unauthorized'));
  }
};
