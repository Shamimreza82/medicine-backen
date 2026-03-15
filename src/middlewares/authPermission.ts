import { userInfo } from 'node:os';

import { StatusCodes } from 'http-status-codes';
import { tr } from 'zod/v4/locales';

import { prisma } from '@/bootstrap/prisma';
import { AUTH_MESSAGES } from '@/modules/auth/domain/auth.constants';
import { findUserByEmail, findUserById } from '@/modules/auth/infrastructure/auth.repository';
import { TAuthPermission } from '@/shared/lib/data/authPermissions';

import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

export const authPermission = (...requiredPermissions: TAuthPermission[]): RequestHandler => {
  return async (req, _res, next) => {

    const user = req.user;

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const dbUser = await findUserById(user.userId, user.tenantId);

    const userdb = await prisma.role.findFirst({
      where: {
        tenantId: user.tenantId
      },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!dbUser) {
      throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // console.log(dbUser)

    // SUPER ADMIN BYPASS
    if (user.role === "SUPER_ADMIN") {
      return next();
    }

    const userPermissions =
      dbUser.role.rolePermissions.map(
        (rp) => rp.permission.name
      );

    const hasPermission = requiredPermissions.some((p) =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      throw new AppError(StatusCodes.FORBIDDEN, "Forbidden");
    }

    next();
  };
};
