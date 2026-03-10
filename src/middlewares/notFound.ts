import { AppError } from '../shared/errors/AppError';

import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, _res, _next) => {
  throw new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`);
};
