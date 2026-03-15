import { StatusCodes } from 'http-status-codes';

import { prisma } from '@/bootstrap/prisma';
import { AUTH_MESSAGES } from '@/modules/auth/domain/auth.constants';
import { TAuthPermission } from '@/shared/lib/data/authPermissions';
import { redisService } from '@/shared/services/redis.service';

import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

export const authPermission = (...requiredPermissions: TAuthPermission[]): RequestHandler =>
  async (req, _res, next) => {
    const user = req.user;

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // SUPER ADMIN BYPASS
    if (user.role === 'SUPER_ADMIN') {
      return next();
    }

    const cacheKey = `role_permissions:${user.role}`;

    // 1️⃣ Try Redis first
    let permissions = await redisService.get(cacheKey);


    let userPermissions: string[];
    

    if (permissions) { 
      userPermissions = permissions;
    } else {
      // 2️⃣ If not in Redis → fetch DB
      const userDb = await prisma.user.findUnique({
        where: {
          id: user.userId,
          tenantId: user.tenantId,
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      if (!userDb) {
        throw new AppError(StatusCodes.UNAUTHORIZED, AUTH_MESSAGES.USER_NOT_FOUND);
      }

      userPermissions = userDb.role?.rolePermissions?.map((rp) => rp.permission.name) || [];

      // 3️⃣ Save to Redis
      await redisService.set(cacheKey, userPermissions, 60 * 60); // 1 hour
    }


    
    const hasPermission = requiredPermissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden');
    }

    next();
  };
