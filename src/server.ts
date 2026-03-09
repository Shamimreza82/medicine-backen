import { startServer } from './bootstrap/startServer';

void startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown startup error';
  console.error(message);
  process.exit(1);
});
