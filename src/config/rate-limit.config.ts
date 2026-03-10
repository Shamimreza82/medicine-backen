import { envConfig } from './env.config';

export const rateLimitConfig = {
  windowMs: envConfig.rateLimitWindowMs,
  maxRequests: envConfig.rateLimitMaxRequests,
};
