import 'dotenv/config';
import { createClient } from 'redis';

import { envConfig } from '@/config/env.config';

export const redis = createClient({
  password: envConfig.redisPassword,
  socket: {
    host: envConfig.redisHost,
    port: envConfig.redisPort,
    // Add reconnection logic
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis: Max reconnection attempts reached.');
        return new Error('Retry attempts exhausted');
      }
      return Math.min(retries * 100, 3000); // Wait longer each time, up to 3s
    },
  },
});

// Remove process.exit(1) here!
// Let the reconnectStrategy handle transient failures.
redis.on('error', (err) => {
  console.error('⚠️ Redis Client Error:', err);
});

redis.on('ready', () => {
  console.log('✅ Redis is ready and accepting commands');
});

export async function connectRedis() {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    console.error('❌ Failed to connect to Redis initially:', error);
    // In production, you might want to throw here so the app doesn't
    // start without its cache/session store.
    throw error;
  }
}
