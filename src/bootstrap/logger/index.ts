import { createLogger } from './createLogger';

export const logger = createLogger('app.log');
export const errorLogger = createLogger('error.log', 'error');
export const auditLogger = createLogger('audit.log', 'info');

export { httpLogger } from './httpLogger';
