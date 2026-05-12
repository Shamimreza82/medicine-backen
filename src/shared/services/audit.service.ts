import { Prisma } from '@prisma/client';

import { logAuditEvent } from '@/shared/logging/audit';

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

export function auditLog(data: TAuditLogInput) {
  logAuditEvent({
    action: data.action,
    entity: data.entity,
    entityId: data.entityId,
    actorUserId: data.userId,
    hospitalId: data.hospitalId,
    ip: data.ipAddress,
    metadata: {
      module: data.module,
      oldValues: data.oldValues,
      newValues: data.newValues,
      userAgent: data.userAgent,
    },
  });
}
