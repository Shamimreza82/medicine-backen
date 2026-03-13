import type { RequestHandler } from 'express';
import type { Logger } from 'pino';

type RequestWithContext = {
  id?: string;
  log?: Logger;
  user?: { id: string; role: string };
};

export const requestContext: RequestHandler = (req, _res, next) => {
  const request = req as typeof req & RequestWithContext;

  if (request.log) {
    request.log = request.log.child({
      requestId: request.id,
      userId: request.user?.id,
    });
  }

  next();
};
