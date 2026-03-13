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
    level: envConfig.httpLogLevel,
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        pid: bindings['pid'],
        host: bindings['hostname'],
        service: 'hosp-management-api',
        environment: envConfig.nodeEnv,
        loggerType: 'request',
      }),
    },
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.body.password',
        'req.body.token',
        'req.body.refreshToken',
      ],
      remove: true,
    },
  },
  requestStream,
);
