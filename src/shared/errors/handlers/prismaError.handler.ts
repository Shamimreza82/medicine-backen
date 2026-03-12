import { Prisma } from "@prisma/client";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const handlePrismaError = (err: unknown, res: Response) => {

  // Known DB errors (constraint, foreign key etc)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    switch (err.code) {

      case "P2002":
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Unique constraint failed",
          error: err.meta,
          stack: err.stack,
        });

      case "P2003":
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Foreign key constraint failed",
             error: err.meta,
          stack: err.stack,
        });

      case "P2025":
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Record not found",
             error: err.meta,
          stack: err.stack,
        });

      case "P2014":
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Invalid relation",
             error: err.meta,
          stack: err.stack,
        });

      default:
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Database request error",
             error: err.meta,
          stack: err.stack,
        });
    }
  }

  // Validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Prisma validation error",
      error: err,
      stack: err.stack,
    });
  }

  // Unknown request error
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Unknown database error",
      error: err,
      stack: err.stack,
    });
  }

  // DB initialization error
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Database connection failed",
      error: err,
      stack: err.stack,
    });
  }

  // Prisma engine panic
  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Database engine panic",
      error: err,
      stack: err.stack,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Unexpected database error",
    error: err,
    stack: err instanceof Error ? err.stack : undefined,
  });
};