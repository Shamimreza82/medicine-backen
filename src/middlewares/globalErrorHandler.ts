import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TokenExpiredError } from 'jsonwebtoken';
import multer from 'multer';
import { ZodError } from 'zod';

import { AppError } from '@/shared/errors/AppError';
import { handleAppError } from '@/shared/errors/handlers/appError.handler';
import { handleJwtError } from '@/shared/errors/handlers/jwtError.handler';
import { multerErrorHandler } from '@/shared/errors/handlers/multer.handler';
import { handlePrismaError } from '@/shared/errors/handlers/prismaError.handler';
import { syntaxErrorHandler } from '@/shared/errors/handlers/syntaxError.handler';
import { handleZodError } from '@/shared/errors/handlers/zodError.handler';
import { getRequestId, getRequestLogger } from '@/shared/logging/context';
import { sendError } from '@/shared/utils/sendError';

const globalErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const requestLogger = getRequestLogger(req);

  requestLogger.error(
    {
      err,
      requestId: getRequestId(req),
      userId: req.user?.userId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
    'Unhandled error occurred',
  );
  if (err instanceof SyntaxError) {
    return syntaxErrorHandler(err, res);
  }
  if (err instanceof multer.MulterError) {
    return multerErrorHandler(err, res);
  }

  if (err instanceof TokenExpiredError) {
    return handleJwtError(err, res);
  }

  if (err instanceof ZodError) {
    return handleZodError(err, res);
  }

  if (err instanceof AppError) {
    return handleAppError(err, res);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, {
    success: false,
    message: 'Something went wrong',
    error: err,
    stack: err instanceof Error ? err.stack : undefined,
  });
};

export default globalErrorHandler;
