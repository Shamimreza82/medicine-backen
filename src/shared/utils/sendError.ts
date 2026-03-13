import { Response } from 'express';

import { envConfig } from '@/config/env.config';

export interface TErrorResponse {
  success: false;
  message: string;
  error?: unknown;
  stack?: string;
}

export const sendError = (res: Response, statusCode: number, payload: TErrorResponse): void => {
  const isDev = envConfig.nodeEnv === "development";

  res.status(statusCode).json({
    success: false,
    message: payload.message,
    ...(payload.error ? { error: payload.error } : {}),
    ...(isDev && payload.stack && { stack: payload.stack }),
  });
};
