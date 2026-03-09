import { logger } from '../bootstrap/logger';
import { AppError } from '../common/errors/AppError';
import { appConfig } from '../config/app.config';

import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next;

  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    appConfig.isProduction && statusCode >= 500
      ? 'Internal Server Error'
      : error instanceof Error
        ? error.message
        : 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error({ err: error }, 'Unhandled server error');
  } else {
    logger.warn({ err: error, statusCode }, 'Handled client error');
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
