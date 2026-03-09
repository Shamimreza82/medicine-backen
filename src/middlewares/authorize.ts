import { AppError } from '../common/errors/AppError';

import type { RequestHandler } from 'express';

export const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, 'Unauthorized'));
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      next(new AppError(403, 'Forbidden'));
      return;
    }

    next();
  };
};
