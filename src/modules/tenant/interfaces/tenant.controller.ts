import { StatusCodes } from 'http-status-codes';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import createTenantService from '../application/service/createTenant.service';
import { TENANT_MESSAGES } from '../domain/tenant.constants';
import { TCreateTenantInput } from '../validation/tenant.validation';

const createTenant = catchAsync(async (req, res) => {
  const body: TCreateTenantInput = req.body;

  console.log(body);
  const result = await createTenantService(body);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: TENANT_MESSAGES.CREATED,
    data: result,
  });
});

export const TenantController = {
  createTenant,
};
