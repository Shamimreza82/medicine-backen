import { Response } from "express";

import { sendError } from "@/shared/utils/sendError";

import { AppError } from "../AppError";

export const handleAppError = (err: AppError, res: Response) => {
  return sendError(res, err.statusCode, {
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};