// import { Queue } from 'bullmq';
// import Redis from 'ioredis';

// import { logger } from './logger';
// import { env } from '../config/env';

// let redisClient: Redis | null = null;
// let backgroundQueue: Queue | null = null;

// export type RedisClient = Redis;

// export const connectRedis = async (): Promise<RedisClient> => {
//   if (redisClient) {
//     return redisClient;
//   }

//   redisClient = new Redis(env.redisUrl, {
//     maxRetriesPerRequest: null,
//     lazyConnect: true,
//   });

//   redisClient.on('error', (error: unknown) => {
//     logger.error({ err: error }, 'Redis error');
//   });

//   await redisClient.connect();
//   backgroundQueue = new Queue('background-jobs', {
//     connection: {
//       url: env.redisUrl,
//     },
//   });
//   logger.info('Redis and BullMQ initialized');

//   return redisClient;
// };

// export const disconnectRedis = async (): Promise<void> => {
//   if (backgroundQueue) {
//     await backgroundQueue.close();
//     backgroundQueue = null;
//   }

//   if (redisClient) {
//     await redisClient.quit();
//     redisClient = null;
//   }
// };
