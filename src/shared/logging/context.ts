import { logger } from '@/bootstrap/logger';

import type { Request } from 'express';
import type { Logger } from 'pino';

type RequestWithLog = Request & { id?: string; log?: Logger; user?: { id: string; role: string } };

export const getRequestLogger = (req: Request): Logger => {
  const request = req as RequestWithLog;

  if (request.log) {
    return request.log;
  }

  return logger.child({
    requestId: request.id,
    userId: request.user?.id,
  });
};

export const getRequestId = (req: Request): string | undefined => {
  return (req as RequestWithLog).id;
};
