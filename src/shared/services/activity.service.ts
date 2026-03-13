import { Prisma } from '@prisma/client';

import { logger } from '@/bootstrap/logger';
import { prisma } from '@/bootstrap/prisma';

interface TLogActivityInput {
  hospitalId?: string;
  userId?: string;
  action: string;
  resource: string;
  description?: string;
  method?: string;
  endpoint?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function logActivity(data: TLogActivityInput) {
  try {
    const { hospitalId, userId, ...rest } = data;

    await prisma.activityLog.create({
      data: {
        ...rest,
        hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });
  } catch (error) {
    logger.error({err: error}, 'Activity log failed');
  }
}

// Example usage:
// await logActivity({
//   hospitalId: req.user.hospitalId,
//   userId: req.user.id,
//   action: "CREATE",
//   resource: "PATIENT",
//   description: "Patient created",
//   method: "POST",
//   endpoint: "/patients",
//   metadata: {
//     patientId: "abc123",
//     doctorId: "doc456"
//   }
// });
