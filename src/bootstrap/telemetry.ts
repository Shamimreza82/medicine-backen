import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

import { logger } from './logger';

let sdk: NodeSDK | null = null;

export const startTelemetry = (): void => {
  if (sdk) {
    return;
  }

  sdk = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  logger.info('OpenTelemetry initialized');
};

export const stopTelemetry = async (): Promise<void> => {
  if (!sdk) {
    return;
  }

  await sdk.shutdown();
  sdk = null;
  logger.info('OpenTelemetry shutdown completed');
};
