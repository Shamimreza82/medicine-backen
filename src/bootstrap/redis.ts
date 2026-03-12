import 'dotenv/config';
import { createClient } from 'redis';

import { envConfig } from '@/config/env.config';

import { logger } from './logger';

export const redis = createClient({
  password: envConfig.redisPassword,
  socket: {
    host: envConfig.redisHost,
    port: envConfig.redisPort,
    // Add reconnection logic
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('❌ Redis: Max reconnection attempts reached.');
        return new Error('Retry attempts exhausted');
      }
      return Math.min(retries * 100, 3000); // Wait longer each time, up to 3s
    },
  },
});

// Remove process.exit(1) here!
// Let the reconnectStrategy handle transient failures.
redis.on('error', (err) => {
  logger.error({err: err}, '⚠️ Redis Client Error:');
});

redis.on('ready', () => {
  logger.info('✅ Redis is ready and accepting commands');
});

export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    logger.error({err: error},'❌ Failed to connect to Redis initially:');
    // In production, you might want to throw here so the app doesn't
    // start without its cache/session store.
    throw error;
  }
}
