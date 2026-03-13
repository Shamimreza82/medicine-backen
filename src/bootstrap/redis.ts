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

export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
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
