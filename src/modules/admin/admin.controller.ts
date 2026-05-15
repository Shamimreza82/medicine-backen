import { Request, Response } from 'express';
import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';
import { adminService } from './admin.service';

export class AdminController {
  getDashboardData = catchAsync(async (req: Request, res: Response) => {
    const data = await adminService.getDashboardData();
    sendResponse(res, 200, {
      success: true,
      message: 'Dashboard data retrieved successfully',
      data,
    });
  });
}

export const adminController = new AdminController();
