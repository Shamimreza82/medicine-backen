import { Prisma } from '@prisma/client';

import { errorLogger } from '@/bootstrap/logger';
import { logAuditEvent } from '@/shared/logging/audit';

import { auditQueue } from '../queues/audit.queue';

interface TAuditLogInput {
  hospitalId?: string;
  userId?: string;

  module: string;
  entity: string;
  entityId?: string;

  action: string;

  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;

  ipAddress?: string;
  userAgent?: string;
}

export async function auditLog(data: TAuditLogInput) {
  try {
    const job = await auditQueue.add('audit-log', data);

    logAuditEvent({
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      actorUserId: data.userId,
      hospitalId: data.hospitalId,
      ip: data.ipAddress,
      metadata: {
        queueJobId: job.id,
        module: data.module,
      },
    });
  } catch (error) {
    errorLogger.error(
      {
        err: error,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        userId: data.userId,
      },
      'Failed to enqueue audit log',
    );

    throw error;
  }
}

// export async function auditLog(data: TAuditLogInput) {
//   try {
//     await prisma.auditLog.create({
//       data: {
//         hospitalId: data.hospitalId,
//         userId: data.userId,

//         module: data.module,
//         entity: data.entity,
//         entityId: data.entityId,

//         action: data.action,

//         oldValues: data.oldValues,
//         newValues: data.newValues,

//         ipAddress: data.ipAddress,
//         userAgent: data.userAgent,
//       },
//     });
//   } catch (error) {
//     console.error("Audit log failed:", error);
//   }
// }

// Example usage:

// await auditLog({
//   hospitalId,
//   userId: adminId,

//   module: "USER",
//   entity: "ROLE",
//   entityId: targetUserId,

//   action: "ROLE_CHANGE",

//   oldValues: { role: "RECEPTIONIST" },
//   newValues: { role: "ADMIN" }
// });
