import 'dotenv/config';
import { createClient } from 'redis';

import { envConfig } from '@/config/env.config';

import { errorLogger, logger } from './logger';

export const redis = createClient({
  password: envConfig.redisPassword,
  socket: {
    host: envConfig.redisHost,
    port: envConfig.redisPort,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        errorLogger.error({ retries }, 'Redis max reconnection attempts reached');
        return new Error('Retry attempts exhausted');
      }

      return Math.min(retries * 100, 3000);
    },
  },
});

redis.on('error', (err) => {
  errorLogger.error({ err }, 'Redis client error');
});

redis.on('ready', () => {
  logger.info('Redis is ready and accepting commands');
});





function isUnsupportedRedisConfigError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes('ERR Unsupported CONFIG parameter') ||
    error.message.includes("unknown command 'CONFIG'") ||
    error.message.includes('unknown command `CONFIG`')
  );
}

async function ensureRedisEvictionPolicy() {
  const expectedPolicy = envConfig.redisMaxmemoryPolicy;
  let response: string[];

  try {
    response = await redis.sendCommand<string[]>(['CONFIG', 'GET', 'maxmemory-policy']);
  } catch (error) {
    if (isUnsupportedRedisConfigError(error)) {
      logger.warn(
        { expectedPolicy, err: error },
        'Redis server does not support CONFIG for maxmemory-policy; skipping eviction policy enforcement',
      );
      return;
    }

    throw error;
  }

  const currentPolicy = response[1];

  if (currentPolicy === expectedPolicy) {
    return;
  }

  logger.warn(
    { currentPolicy, expectedPolicy },
    'Redis eviction policy mismatch detected; attempting to update it',
  );

  try {
    await redis.sendCommand(['CONFIG', 'SET', 'maxmemory-policy', expectedPolicy]);
  } catch (error) {
    if (isUnsupportedRedisConfigError(error)) {
      logger.warn(
        { currentPolicy, expectedPolicy, err: error },
        'Redis server rejected maxmemory-policy update; continuing without enforcing eviction policy',
      );
      return;
    }

    throw error;
  }

  const verification = await redis.sendCommand<string[]>(['CONFIG', 'GET', 'maxmemory-policy']);
  const appliedPolicy = verification[1];

  if (appliedPolicy !== expectedPolicy) {
    throw new Error(
      `Redis eviction policy must be "${expectedPolicy}" but is "${appliedPolicy ?? 'unknown'}"`,
    );
  }

  logger.info({ expectedPolicy }, 'Redis eviction policy verified');
}

export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
    await ensureRedisEvictionPolicy();
    return true;
  } catch (error) {
    if (envConfig.nodeEnv !== 'production') {
      logger.warn({ err: error }, 'Redis unavailable, continuing without Redis');
      return false;
    }

    errorLogger.error({ err: error }, 'Failed to connect to Redis initially');
    throw error;
  }
}
