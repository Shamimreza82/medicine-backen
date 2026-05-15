import { prisma } from '@/bootstrap/prisma';

export class AdminRepository {
  async getDashboardStats() {
    const [brands, generics, companies, indications, labTests] = await Promise.all([
      prisma.drugBrand.count(),
      prisma.drugGeneric.count(),
      prisma.company.count(),
      prisma.indication.count(),
      prisma.labTest.count(),
    ]);

    return {
      brands,
      generics,
      companies,
      indications,
      labTests,
    };
  }

  async getRecentActivities(limit = 10) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createAuditLog(data: {
    action: string;
    target: string;
    details?: string;
    userId?: string;
    userName?: string;
  }) {
    return prisma.auditLog.create({
      data,
    });
  }
}

export const adminRepository = new AdminRepository();
