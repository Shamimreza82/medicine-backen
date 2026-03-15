import { logger } from '@/bootstrap/logger';
import { redis } from '@/bootstrap/redis';

export const redisService = {
  /**
   * Set a value with optional TTL (Time To Live)
   */
  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (ttl) {
        // Use EX (seconds) or PX (milliseconds)
        await redis.set(key, data, { EX: ttl });
      } else {
        await redis.set(key, data);
      }
    } catch (error) {
      logger.error({ key, err: error }, 'Redis SET failed');
    }
  },

  /**
   * Get and parse a value. Returns null if key doesn't exist or parsing fails.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;

      return JSON.parse(data) as T;
    } catch (error) {
      logger.error({ key, err: error }, 'Redis GET/PARSE failed');
      return null; // Fail gracefully in production
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error({ key, err: error }, 'Redis DEL failed');
    }
  },

  /**
   * Check if a key exists without fetching the whole payload
   */
  async exists(key: string): Promise<boolean> {
    const count = await redis.exists(key);
    return count > 0;
  },
};

// Example usage:

// const CACHE_KEYS = {
//   PATIENT_PROFILE: (id: string) => `patient:profile:${id}`,
//   AUTH_SESSION: (token: string) => `auth:session:${token}`,
// };

// // Use in your service
// await RedisService.set(CACHE_KEYS.PATIENT_PROFILE("p123"), patientData, 3600);
