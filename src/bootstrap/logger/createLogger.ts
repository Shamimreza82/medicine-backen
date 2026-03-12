import path from 'node:path';

import pino from 'pino';

import { envConfig } from '@/config/env.config';

import { getFileTransport, getPrettyTransport, logDir } from './transports';

const isProduction = envConfig.nodeEnv === 'production';

export const createLogger = (
  fileName: string,
  level: pino.Level = 'info'
) => {
  return pino(
    {
      level,
      base: {
        service: 'hosp-management-api',
        environment: envConfig.nodeEnv,
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: {
        paths: [
          'req.headers.authorization',
          'password',
          'token',
          'refreshToken',
          'accessToken',
        ],
        remove: true,
      },
    },
    isProduction
      ? getFileTransport(path.join(logDir, fileName))
      : getPrettyTransport()
  );
};
