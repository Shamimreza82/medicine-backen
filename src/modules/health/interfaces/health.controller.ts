import { sendResponse } from '@/shared/utils/sendResponse';

import type { RequestHandler } from 'express';

export const getHealthStatus: RequestHandler = (_req, res) => {
  sendResponse(res, 200, {
    success: true,
    message: 'Health check successful',
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
};
