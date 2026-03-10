import jwt from 'jsonwebtoken';

import { AppError } from '@/shared/errors/AppError';

import { envConfig } from '../../../config/env.config';

import type { JwtPayload } from 'jsonwebtoken';

interface AccessTokenClaims {
  role: string;
}

export interface AccessTokenPayload {
  sub: string;
  role: string;
}

export const signAccessToken = (subject: string, claims: AccessTokenClaims): string => {
  return jwt.sign(
    {
      sub: subject,
      role: claims.role,
    },
    envConfig.jwtAccessSecret,
    {
      expiresIn: envConfig.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, envConfig.jwtAccessSecret);
  if (typeof decoded === 'string' || decoded === null) {
    throw new AppError(500, 'Invalid access token');
  }

  const payload = decoded as JwtPayload & { role?: unknown };
  const sub = payload.sub;
  const role = payload.role;
  if (typeof sub !== 'string' || typeof role !== 'string') {
    throw new AppError(500, 'Invalid access token payload');
  }

  return { sub, role };
};
