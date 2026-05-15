import { envConfig } from './env.config';

import type { CorsOptions } from 'cors';

const parseOrigins = (origins: string): string[] => {
  return origins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

const allowedOrigins = [
  ...parseOrigins(envConfig.corsOrigins),
  'https://medicine-server-frontend.vercel.app',
];

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false); // Return false instead of Error to avoid triggering error handlers
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
  ],

  exposedHeaders: ['Content-Range', 'X-Content-Range'],

  maxAge: 86400, // 24 hours
};
