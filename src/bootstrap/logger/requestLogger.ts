import path from 'node:path';

import pino from 'pino';

import { envConfig } from '@/config/env.config';

import { getFileTransport, getPrettyTransport, logDir } from './transports';

const isProduction = envConfig.nodeEnv === 'production';

const requestStream = isProduction
  ? getFileTransport(path.join(logDir, 'request.log'))
  : getPrettyTransport();

export const requestPino = pino(
  {
    level: 'info',
    base: {
      service: 'hosp-management-api',
      environment: envConfig.nodeEnv,
      loggerType: 'request',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.token',
      ],
      remove: true,
    },
  },
  requestStream
);