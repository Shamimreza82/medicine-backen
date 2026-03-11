import { StatusCodes } from 'http-status-codes';

import { sendError } from '@/shared/utils/sendError';



import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, res, _next) => {
  sendError(res, StatusCodes.NOT_FOUND, {
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  })
};
