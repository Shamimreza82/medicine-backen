import { Job, Worker } from 'bullmq';

import { auditLogger, errorLogger } from '@/bootstrap/logger';
import { prisma } from '@/bootstrap/prisma';
import { connection } from '@/shared/queues/connection';

const auditWorker = new Worker(
  'audit-log',
  async (job: Job) => {
    auditLogger.info({ jobId: job.id }, 'Audit worker processing job');

    try {
      await prisma.auditLog.create({
        data: job.data,
      });
    } catch (error) {
      errorLogger.error({ jobId: job.id, err: error }, 'Audit worker database write failed');
      throw error;
    }
  },
  {
    connection: connection as any,
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 5000 },
  },
);

auditWorker.on('failed', (job, err) => {
  errorLogger.error({ jobId: job?.id, err }, 'Audit worker job failed after retries');
});

export default auditWorker;
