import path from 'node:path';

import pino from 'pino';

const logDir = path.join(process.cwd(), 'logs');

export const getFileTransport = (destination: string) =>
  pino.transport({
    target: 'pino/file',
    options: {
      destination,
      mkdir: true,
    },
  });

export const getPrettyTransport = () =>
  pino.transport({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,host',
      singleLine: true,
    },
  });

export { logDir };
