import path from 'node:path';

import pino, { type Level, type LoggerOptions } from 'pino';

import { envConfig } from '@/config/env.config';

import { getFileTransport, getPrettyTransport, logDir } from './transports';

const isProduction = envConfig.nodeEnv === 'production';

const redactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.token',
  'req.body.refreshToken',
  'password',
  'token',
  'refreshToken',
  'accessToken',
];

export const createLogger = (fileName: string, level: Level = envConfig.logLevel) => {
  const options: LoggerOptions = {
    level,
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        pid: bindings['pid'],
        host: bindings['hostname'],
        service: 'medicine-backend',
        environment: envConfig.nodeEnv,
      }),
    },
    redact: {
      paths: redactPaths,
      remove: true,
    },
  };

  return pino(
    options,
    isProduction ? getFileTransport(path.join(logDir, fileName)) : getPrettyTransport(),
  );
};
