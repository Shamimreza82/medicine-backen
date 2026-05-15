import { adminRepository } from './admin.repository';

export class AdminService {
  async getDashboardData() {
    const [stats, activities] = await Promise.all([
      adminRepository.getDashboardStats(),
      adminRepository.getRecentActivities(10),
    ]);

    return {
      stats,
      activities,
    };
  }
}

export const adminService = new AdminService();
