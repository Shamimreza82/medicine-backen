import { StatusCodes } from 'http-status-codes';

import { sendError } from '@/shared/utils/sendError';

import type { Response } from 'express';

export const syntaxErrorHandler = (err: unknown, res: Response) => {
  const stack = err instanceof Error ? err.stack : undefined;

  const message = err instanceof Error ? err.message : 'Invalid JSON syntax';

  return sendError(res, StatusCodes.BAD_REQUEST, {
    success: false,
    message: 'Syntax Error',
    error: message || err,
    stack: stack,
  });
};
