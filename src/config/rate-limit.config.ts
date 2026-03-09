import { env } from './env';

export const rateLimitConfig = {
  windowMs: env.rateLimitWindowMs,
  maxRequests: env.rateLimitMaxRequests,
};
