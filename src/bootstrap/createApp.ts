import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { corsConfig } from '@/config/cors.config';
import globalErrorHandler from '@/middlewares/globalErrorHandler';
import { sendResponse } from '@/shared/utils/sendResponse';

import { logger } from './logger';
import { appConfig } from '../config/app.config';
import { openApiDocument } from '../docs/openapi';
import { notFound } from '../middlewares/notFound';
import { rateLimiter } from '../middlewares/rateLimiter';
import { apiRouter } from '../routes';
import '@/workers';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  if (appConfig.trustProxy) {
    app.set('trust proxy', 1);
  }

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(rateLimiter);
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (_req, res) => {
    sendResponse(res, 200, {
      success: true,
      message: 'api work file',
    });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/api/v1', apiRouter);
  app.use(notFound);
  app.use(globalErrorHandler);

  return app;
};
