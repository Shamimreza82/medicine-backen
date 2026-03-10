import { envConfig } from './env.config';

import type { CorsOptions } from 'cors';

const parseOrigins = (origins: string): string[] => {
  return origins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

const allowedOrigins = parseOrigins(envConfig.corsOrigins);

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed'));
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],

  allowedHeaders: ['Content-Type', 'Authorization'],
};
