import fs from 'node:fs';
import path from 'node:path';

import { envConfig } from '@/config/env.config';

interface MeiliTaskResponse {
  taskUid: number;
}

interface MeiliTaskStatusResponse {
  status: 'enqueued' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  error?: unknown;
}

const MEILI_URL = envConfig.meilisearchUrl || 'http://127.0.0.1:7700';
const MEILI_API_KEY = envConfig.meilisearchApiKey || 'masterKey';

async function waitForTask(taskUid: number) {
  console.log('Waiting for import to complete...');

  while (true) {
    const res = await fetch(`${MEILI_URL}/tasks/${taskUid}`, {
      headers: {
        Authorization: `Bearer ${MEILI_API_KEY}`,
      },
    });

    const task = (await res.json()) as MeiliTaskStatusResponse;

    if (task.status === 'succeeded') {
      console.log('Import completed successfully');
      return;
    }

    if (task.status === 'failed') {
      console.error('Import failed:', task.error);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function importLabTests() {
  const csvPath = path.resolve(process.cwd(), 'data/lab_tests.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found: ${csvPath}`);
  }

  console.log('CSV found:', csvPath);

  const fileBuffer = fs.readFileSync(csvPath);

  const res = await fetch(`${MEILI_URL}/indexes/lab-tests/documents?primaryKey=slug`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MEILI_API_KEY}`,
      'Content-Type': 'text/csv',
    },
    body: fileBuffer,
  });

  const data = (await res.json()) as MeiliTaskResponse;

  console.log('Import task enqueued:', data);

  await waitForTask(data.taskUid);
}

void importLabTests();
