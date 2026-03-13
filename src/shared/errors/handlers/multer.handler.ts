import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { sendError } from '@/shared/utils/sendError';

export const multerErrorHandler = (err: unknown, res: Response) => {
  const stack = err instanceof Error ? err.stack : undefined;

  return sendError(res, StatusCodes.BAD_REQUEST, {
    success: false,
    message: 'File upload Error',
    error: err,
    stack: stack,
  });
};
