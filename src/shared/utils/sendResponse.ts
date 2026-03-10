import type { Response } from 'express';

export interface TResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export const sendResponse = <T>(res: Response, statusCode: number, payload: TResponse<T>): void => {
  res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
  });
};
