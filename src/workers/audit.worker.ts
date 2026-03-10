import { Worker, Job } from 'bullmq';

import { prisma } from '@/bootstrap/prisma';
import { connection } from '@/shared/queues/connection';

const auditWorker = new Worker(
  'audit-log',
  async (job: Job) => {
    // 1. Log processing start for monitoring
    console.log(`[AuditWorker] Processing job ${job.id}...`);

    try {
      // 2. Data Persistence
      await prisma.auditLog.create({
        data: job.data,
      });
    } catch (error) {
      console.error(`[AuditWorker] Database Error for job ${job.id}:`, error);
      // Throwing the error tells BullMQ to retry based on your Queue settings
      throw error;
    }
  },
  {
    // Use 'as any' ONLY if the dependency fix above hasn't been run yet
    connection: connection as any,
    concurrency: 5, // Process 5 logs at once for high-traffic hospitals
    removeOnComplete: { count: 100 }, // Keep last 100 successful jobs in Redis for debugging
    removeOnFail: { count: 5000 }, // Keep failures longer to investigate data loss
  },
);

// 3. Event Listeners for Ops/SRE
auditWorker.on('failed', (job, err) => {
  console.error(`🚨 CRITICAL: Audit log ${job?.id} failed after retries!`, err);
  // Suggestion: Integrate Sentry or a Slack webhook here
});

export default auditWorker;
