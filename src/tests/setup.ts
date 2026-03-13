/* eslint-disable @typescript-eslint/require-await */
// src/tests/setup.ts
import { beforeAll, afterAll } from 'vitest';

import { logger } from '@/bootstrap/logger';
import { prisma } from '@/bootstrap/prisma';

beforeAll(async () => {
  logger.info('Test started');
});

afterAll(async () => {
  await prisma.$disconnect();
});

// 1️⃣ setup.ts

// এটা global test setup file।

// Vitest/Jest সব test run করার আগে এই file execute করে।
// Use cases
// env load
// DB reset
// mocks
// global config
