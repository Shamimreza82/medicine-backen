import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

export const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req, _res, _next) => {
    const user = req.user;

    if (!user) {
      new AppError(401, 'Unauthorized');
      return;
    }

    // SUPER ADMIN BYPASS
    if (user.role === 'SUPER_ADMIN') {
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      new AppError(403, 'Forbidden');
      return;
    }
  };
};
