import jwt from 'jsonwebtoken';

import { env } from '../../../config/env';

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
    env.jwtAccessSecret,
    {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    },
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.jwtAccessSecret);
  if (typeof decoded === 'string' || decoded === null) {
    throw new Error('Invalid access token');
  }

  const payload = decoded as JwtPayload & { role?: unknown };
  const sub = payload.sub;
  const role = payload.role;
  if (typeof sub !== 'string' || typeof role !== 'string') {
    throw new Error('Invalid access token payload');
  }

  return { sub, role };
};
