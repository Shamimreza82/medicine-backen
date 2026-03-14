import { StatusCodes } from 'http-status-codes';

import { AUTH_MESSAGES } from '@/modules/auth/domain/auth.constants';
import { TAuthPermission } from '@/shared/lib/data/authPermissions';

import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

export const authPermission = (...requiredPermissions: TAuthPermission[]): RequestHandler => {
  return (req, _res, _next) => {
    const user = req.user;

    if (!user) throw new AppError(StatusCodes.CONFLICT, AUTH_MESSAGES.USER_NOT_FOUND)

    // SUPER ADMIN BYPASS
    if (user.role === 'SUPER_ADMIN') {
      return;
    }

    if ( requiredPermissions.length > 0 &&  !requiredPermissions.includes(user.role as TAuthPermission)
    ) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden');
    }
  };
};
