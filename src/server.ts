import { logger } from "./bootstrap/logger";
import { startServer } from "./bootstrap/startServer";


void startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown startup error';
  logger.error(message);
  process.exit(1);
});
