import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { AppError } from '@/shared/errors/AppError';

export type NodeEnvironment = 'development' | 'test' | 'production';
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ENABLED: z.coerce.boolean(),
  HOST: z.string().min(1).default('0.0.0.0'),
  DATABASE_URL: z.string().default(''),
  CORS_ORIGINS: z.string().default('*'),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((value) => value === '1' || value === 'true'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(120),
  JWT_ACCESS_SECRET: z.string().min(16).default('dev-access-secret-change-me'),
  JWT_REFRESH_SECRET: z.string().min(16).default('dev-refress-secret-change-me'),
  JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('365d'),



  REDIS_URL: z.string().url().default('redis://127.0.0.1:6379'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  HTTP_LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  const formattedErrors = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'ENV'}: ${issue.message}`)
    .join('; ');
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `Invalid environment configuration: ${formattedErrors}`,
  );
}

export const envConfig = {
  nodeEnv: parsed.data.NODE_ENV as NodeEnvironment,
  port: parsed.data.PORT,
  host: parsed.data.HOST,
  databaseUrl: parsed.data.DATABASE_URL,
  corsOrigins: parsed.data.CORS_ORIGINS,
  trustProxy: parsed.data.TRUST_PROXY ?? false,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: parsed.data.RATE_LIMIT_MAX_REQUESTS,

  jwtAccessSecret: parsed.data.JWT_ACCESS_SECRET,
  jwtExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  
  redisUrl: parsed.data.REDIS_URL,
  logLevel: parsed.data.LOG_LEVEL as LogLevel,
  httpLogLevel: parsed.data.HTTP_LOG_LEVEL as LogLevel,
  corsEnabled: parsed.data.CORS_ENABLED,
  redisHost: parsed.data.REDIS_HOST,
  redisPort: parsed.data.REDIS_PORT,
  redisPassword: parsed.data.REDIS_PASSWORD,
} as const;
