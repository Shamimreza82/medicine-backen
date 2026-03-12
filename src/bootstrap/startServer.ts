import { appConfig } from '@/config/app.config';
import { envConfig } from '@/config/env.config';

import { createApp } from './createApp';
import { logger } from './logger';
import { connectRedis } from './redis';

import type { Server } from 'node:http';

const shutdown = async (server: Server, signal: string): Promise<void> => {
  logger.info({ signal }, 'Received shutdown signal');

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  // await disconnectRedis();
  logger.info('Shutdown completed');
};

export const startServer = async (): Promise<Server> => {
  const app = createApp();

  // startTelemetry();
  // await getPrisma().$connect();
  await connectRedis();

  const server = app.listen(appConfig.port, appConfig.host, () => {
    logger.info(
      {
        host: appConfig.host,
        port: appConfig.port,
        environment: envConfig.nodeEnv ?? 'development',
      },
      'Server started',
    );

    console.log("server start")
  });

  const handleSignal = (signal: 'SIGINT' | 'SIGTERM'): void => {
    void shutdown(server, signal)
      .catch((error: unknown) => {
        logger.error({ err: error }, 'Shutdown failed');
      })
      .finally(() => {
        process.exit(0);
      });
  };

  process.on('SIGINT', () => {
    handleSignal('SIGINT');
  });

  process.on('SIGTERM', () => {
    handleSignal('SIGTERM');
  });

  return server;
};
