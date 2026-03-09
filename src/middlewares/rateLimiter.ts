import rateLimit from 'express-rate-limit';

import { rateLimitConfig } from '../config/rate-limit.config';

export const rateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  limit: rateLimitConfig.maxRequests,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  skip: (request) => request.path === '/api/v1/health',
});
