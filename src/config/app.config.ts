import { env } from './env';

export const appConfig = {
  host: env.host,
  port: env.port,
  trustProxy: env.trustProxy,
  isProduction: env.nodeEnv === 'production',
};
