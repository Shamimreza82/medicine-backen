import type { RequestHandler } from "express";


export const getHealthStatus: RequestHandler = (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
};
