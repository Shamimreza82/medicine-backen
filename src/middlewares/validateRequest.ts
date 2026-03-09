import type { RequestHandler } from 'express';

export const validateRequest = <T>(validator: (input: unknown) => T): RequestHandler => {
  return (req, _res, next) => {
    const validatedBody = validator(req.body);
    req.body = validatedBody;
    next();
  };
};
