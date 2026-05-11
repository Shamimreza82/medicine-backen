import { catchAsync } from '@/shared/utils/catchAsync';

import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

interface ValidatedRequest {
  body?: unknown;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const validateRequest = (schema: ZodTypeAny): RequestHandler =>
  catchAsync(async (req, _res, next) => {
    const parsed = (await schema.parseAsync({
      body: req.body as unknown,
      query: { ...req.query } as unknown,
      params: req.params as unknown,
    })) as ValidatedRequest;

    if (parsed.body !== undefined) {
      req.body = parsed.body;
    }

    if (parsed.query !== undefined) {
      // Clear existing query params to ensure only validated ones remain
      // and use Object.assign to update in-place for Express compatibility
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, parsed.query);
    }

    if (parsed.params !== undefined) {
      Object.keys(req.params).forEach((key) => delete req.params[key]);
      Object.assign(req.params, parsed.params);
    }

    next();
  });
