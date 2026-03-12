import { pinoHttp } from 'pino-http';

import { requestPino } from './requestLogger';

export const httpLogger = pinoHttp({
  logger: requestPino,
  autoLogging: true,

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },

  customErrorMessage(req, res) {
    return `${req.method} ${req.url} failed with ${res.statusCode}`;
  },

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      };
    },

    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});