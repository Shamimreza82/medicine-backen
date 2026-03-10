/* eslint-disable @typescript-eslint/no-explicit-any */

import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

import { envConfig } from '@/config/env.config';

export const connection = new Redis({
  host: envConfig.redisHost,
  port: envConfig.redisPort,
  password: envConfig.redisPassword,
  maxRetriesPerRequest: null, // Required by BullMQ
});

export const auditQueue = new Queue('audit-log', {
  connection: connection as any,
  defaultJobOptions: {
    attempts: 3, // Critical for production: retry failed audit logs
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true, // Keep Redis memory clean
    removeOnFail: 1000, // Keep failed logs for debugging, but limit them
  },
});
