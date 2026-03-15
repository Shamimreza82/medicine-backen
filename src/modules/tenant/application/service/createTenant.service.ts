import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/shared/errors/AppError';

import { TENANT_MESSAGES } from '../../domain/tenant.constants';
import { TenantRepository } from '../../infrastructure/tenant.repository';
import { TCreateTenantInput } from '../../validation/tenant.validation';

const createTenantService = async (payload: TCreateTenantInput) => {
  const { email } = payload;

  const existingTenantByEmail = await TenantRepository.getTenantByEmail(email);
  if (existingTenantByEmail) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `${TENANT_MESSAGES.EMAIL_ALREADY_EXISTS} try another email`,
    );
  }

  const tenant = await TenantRepository.createTenant(payload);

  return {
    tenant,
  };
};

export default createTenantService;
