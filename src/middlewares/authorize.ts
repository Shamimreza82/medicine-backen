import { createHttpError } from '../common/httpError';

import type { RequestHandler } from 'express';

export const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(createHttpError(401, 'Unauthorized'));
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      next(createHttpError(403, 'Forbidden'));
      return;
    }

    next();
  };
};
