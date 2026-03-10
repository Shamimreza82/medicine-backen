import { Response } from 'express';

import { envConfig } from '@/config/env.config';

export interface TErrorResponse {
  success: false;
  message: string;
  error?: unknown;
  stack?: string;
}

export const sendError = (res: Response, statusCode: number, payload: TErrorResponse): void => {
  res.status(statusCode).json({
    success: false,
    message: payload.message,
    error: payload.error,
    stack: envConfig.nodeEnv === 'development' ? payload.stack : undefined,
  });
};
