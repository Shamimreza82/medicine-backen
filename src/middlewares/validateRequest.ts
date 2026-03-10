import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

export const validateRequest =
  (schema: ZodTypeAny): RequestHandler =>
  async (req, _res, next) => {
    try {
      await schema.parseAsync({
        body: req.body as unknown,
        query: req.query as unknown,
        params: req.params as unknown,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
