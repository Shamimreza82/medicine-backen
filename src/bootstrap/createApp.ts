import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { logger } from './logger';
import { appConfig } from '../config/app.config';
import { corsConfig } from '../config/cors.config';
import { openApiDocument } from '../docs/openapi';
import { errorHandler } from '../middlewares/errorHandler';
import { notFound } from '../middlewares/notFound';
import { rateLimiter } from '../middlewares/rateLimiter';
import { apiRouter } from '../routes';

export const createApp = (): express.Express => {
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
    res.status(200).json({
      success: true,
      message: 'Hospital Management API',
    });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.use('/api/v1', apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
