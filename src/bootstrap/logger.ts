import fs from 'node:fs';
import path from 'node:path';

import pino from 'pino';

import { envConfig } from '@/config/env.config';

const isProd = envConfig.nodeEnv === 'production';

const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = pino(
  {
    level: isProd ? 'info' : 'debug',
    base: {
      service: 'hosp-management-api',
      environment: envConfig.nodeEnv,
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    redact: {
      paths: ['req.headers.authorization'],
      remove: true,
    },
  },
  isProd
    ? pino.destination({
        dest: path.join(logDir, 'app.log'),
        sync: false,
      })
    : pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }),
);
