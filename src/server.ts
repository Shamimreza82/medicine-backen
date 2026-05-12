import { errorLogger } from './bootstrap/logger';
import { startServer } from './bootstrap/startServer';

try {
  startServer();
} catch (error: unknown) {
  errorLogger.fatal({ err: error }, 'Startup failed');
  process.exit(1);
}
