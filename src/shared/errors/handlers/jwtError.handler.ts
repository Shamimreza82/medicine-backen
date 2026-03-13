import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TokenExpiredError } from 'jsonwebtoken';

import { sendError } from '@/shared/utils/sendError';

export const handleJwtError = (err: TokenExpiredError, res: Response) => {
  return sendError(res, StatusCodes.REQUEST_TIMEOUT, {
    success: false,
    message: 'Session expired. Please login again.',
    error: err,
    stack: err.stack,
  });
};
