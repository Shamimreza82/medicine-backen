

// import fs from 'node:fs';
// import path from 'node:path';

// import pino from 'pino';
// import { pinoHttp } from 'pino-http';

// import { envConfig } from '@/config/env.config';

// const isProduction = envConfig.nodeEnv === 'production';
// const isDevelopment = envConfig.nodeEnv === 'development';

// const logDir = path.join(process.cwd(), 'logs');

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir, { recursive: true });
// }

// const getFileTransport = (destination: string) =>
//   pino.transport({
//     target: 'pino/file',
//     options: {
//       destination,
//       mkdir: true,
//     },
//   });

// const getPrettyTransport = () =>
//   pino.transport({
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//       translateTime: 'SYS:standard',
//       ignore: 'pid,hostname',
//       mkdir: true,
//     },
//   });

// const createLogger = (fileName: string, level: pino.Level = 'info') => {
//   return pino(
//     {
//       level,
//       base: {
//         service: 'hosp-management-api',
//         environment: envConfig.nodeEnv,
//       },
//       timestamp: pino.stdTimeFunctions.isoTime,
//       redact: {
//         paths: [
//           'req.headers.authorization',
//           'password',
//           'token',
//           'refreshToken',
//           'accessToken',
//         ],
//         remove: true,
//       },
//     },
//     isProduction ? getFileTransport(path.join(logDir, fileName)) : getPrettyTransport()
//   );
// };

// // 1. App logger
// export const logger = createLogger('app.log', isDevelopment ? 'debug' : 'info');

// // 2. Error logger
// export const errorLogger = createLogger('error.log', 'error');

// // 3. Audit logger
// export const auditLogger = createLogger('audit.log', 'info');

// // 4. Request logger
// export const requestStream = isProduction
//   ? getFileTransport(path.join(logDir, 'request.log'))
//   : getPrettyTransport();

  
// export const requestPino = pino(
//   {
//     level: 'info',
//     base: {
//       service: 'hosp-management-api',
//       environment: envConfig.nodeEnv,
//       loggerType: 'request',
//     },
//     timestamp: pino.stdTimeFunctions.isoTime,
//     redact: {
//       paths: [
//         'req.headers.authorization',
//         'req.headers.cookie',
//         'req.body.password',
//         'req.body.token',
//       ],
//       remove: true,
//     },
//   },
//   requestStream
// );





// export const httpLogger = pinoHttp({
//   logger: requestPino,
//   autoLogging: true,
//   customSuccessMessage(req, res) {
//     return `${req.method} ${req.url} completed with ${res.statusCode}`;
//   },
//   customErrorMessage(req, res) {
//     return `${req.method} ${req.url} failed with ${res.statusCode}`;
//   },
//   serializers: {
//     req(req) {
//       return {
//         method: req.method,
//         url: req.url,
//         params: req.params,
//         query: req.query,
//         ip: req.ip,
//         userAgent: req.headers['user-agent'],
//       };
//     },
//     res(res) {
//       return {
//         statusCode: res.statusCode,
//       };
//     },
//   },
// });