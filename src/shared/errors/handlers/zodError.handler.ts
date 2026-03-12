import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { sendError } from "@/shared/utils/sendError";

export const handleZodError = (err: ZodError, res: Response) => {
  const errors = err.issues.map((issue) => ({
    field: issue.path.join("."),
    error: issue.message,
  }));

  return sendError(res, StatusCodes.BAD_REQUEST, {
    success: false,
    message: "Invalid input data",
    error: errors,
    stack: err.stack,
  });
};