import Redis from 'ioredis';

import { envConfig } from '@/config/env.config';

export const connection = new Redis({
  host: envConfig.redisHost,
  port: envConfig.redisPort,
  password: envConfig.redisPassword,
  maxRetriesPerRequest: null, // Required by BullMQ
});
