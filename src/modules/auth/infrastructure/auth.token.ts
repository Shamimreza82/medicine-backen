import jwt from 'jsonwebtoken';

import { envConfig } from '@/config/env.config';

import { TJwtPayload } from '../domain/auth.types';

import type { JwtPayload, SignOptions } from 'jsonwebtoken';




export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envConfig.jwtAccessSecret, {
    expiresIn: envConfig.jwtExpiresIn as SignOptions["expiresIn"],
  })
}


export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, envConfig.jwtRefreshSecret , {
    expiresIn: envConfig.jwtRefreshExpiresIn as SignOptions["expiresIn"],
  })
}


export const verifyAccessToken = (token: string): TJwtPayload => {
  return jwt.verify( token, envConfig.jwtAccessSecret) as TJwtPayload 
}


export const verifyRefreshToken = (token: string): JwtPayload  => {
  return jwt.verify( token, envConfig.jwtRefreshSecret ) as JwtPayload 
}

