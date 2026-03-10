import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';

import { logger } from '@/bootstrap/logger';
import { AppError } from '@/shared/errors/AppError';
import { sendError } from '@/shared/utils/sendError';

const globalErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const newMessage = "Something went's wrong";
  ///---------------------------Error Logs--------------------------------------------------------------------------------------------
  const logPayload = {
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    errorName: err instanceof Error ? err.name : undefined,
    errorMessage: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  };

  /// genarate error log for better find error
  logger.error(logPayload, err instanceof Error ? err.message : String(err));

  ///-----------------------------------------------------------------------------------------------------------------------

  if (err instanceof TokenExpiredError) {
    sendError(res, StatusCodes.REQUEST_TIMEOUT, {
      success: false,
      message: 'Session expired. Please refresh your token or log in again.',
      error: err,
      stack: err.stack,
    });
  }

  if (err instanceof SyntaxError) {
    sendError(res, StatusCodes.CONFLICT, {
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
      stack: err.stack,
    });
  }

  if (res.headersSent) {
    return;
  }

  //generics error handle(
  if (err instanceof AppError) {
    sendError(res, err.statusCode, {
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
      stack: err.stack,
    });
  }

  //Zod Validation Error handle
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      error: issue.message,
    }));

    sendError(res, StatusCodes.CONFLICT, {
      success: false,
      message: 'Invalid input data',
      error: errors,
      stack: err.stack,
    });
  }

  ///-----------------------------------------------------------------------------------------------------------------------

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint failed
      res.status(400).json({
        success: false,
        message: `Validation Error: Unique constraint failed on the field: ${String(err?.meta?.['target'])}`,
        statusCode: StatusCodes.BAD_REQUEST,
        error: err,
      });
    } else if (err.code === 'P2025') {
      // Record not found
      res.status(404).json({
        success: false,
        message: 'The record you are trying to update or delete does not exist.',
        error: err,
      });
    } else if (err.code === 'P2003') {
      // Foreign key constraint failed
      res.status(400).json({
        success: false,
        message: 'Foreign key constraint failed.',
        error: err,
      });
    } else if (err.code === 'P2000') {
      // Value too long for column
      res.status(400).json({
        success: false,
        message: 'Value is too long for the column.',
        error: err,
      });
    } else {
      // Default for other Prisma errors
      res.status(500).json({
        success: false,
        message: 'Database error occurred. Please try again later.',
        error: err,
      });
    }
  }

  // Handle Prisma Unknown Errors
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    res.status(500).json({
      status: 'error',
      message: 'Unknown database error',
      details: err.message,
    });
  }

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    const regex = /Invalid value for argument `(.+?)`\.\s*Expected (.+?)\./;
    const match = regex.exec(err.message);

    let invalidField = 'unknown';
    let expectedValue = 'unknown';

    if (match) {
      invalidField = match[1]!;
      expectedValue = match[2]!;
    }

    // Optionally, split and clean up the full error message for additional context.
    const errorLines = err.message
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    res.status(400).json({
      success: false,
      message: 'Database query validation error',
      error: {
        invalidField,
        expectedValue,
        // Provide the full error context as an array of lines
        errorContext: errorLines,
      },
      stack: err.stack,
    });
  }

  ///-----------------------------------------------------------------------------------------------------------------------

  sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, {
    success: false,
    message: newMessage,
    error: err,
    stack: err instanceof Error ? err.stack : undefined,
  });
};

export default globalErrorHandler;
