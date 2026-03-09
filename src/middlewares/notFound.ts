import { createHttpError } from '../common/httpError';

import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, _res, next) => {
  next(createHttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
