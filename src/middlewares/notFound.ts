import { AppError } from '../common/errors/AppError';

import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
