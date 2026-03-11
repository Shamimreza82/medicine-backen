

import { TAuthPermission } from '@/shared/lib/data/authPermissions';
import { TRoles } from '@/shared/lib/data/roles';

import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

export const authorize = (...requiredPermissions: TAuthPermission[]): RequestHandler => {
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

    if (requiredPermissions.length > 0 && !requiredPermissions.includes(user.role as TAuthPermission)) {
      new AppError(403, 'Forbidden');
      return;
    }
  };
};
