import { envConfig } from "./env.config";



export const appConfig = {
  host: envConfig.host,
  port: envConfig.port,
  trustProxy: envConfig.trustProxy,
  isProduction: envConfig.nodeEnv === 'production',
};
