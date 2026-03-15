import { StatusCodes } from 'http-status-codes';

import { logger } from '@/bootstrap/logger';
import { TJwtPayload } from "@/modules/auth/domain/auth.types"
import { AppError } from "@/shared/errors/AppError"

import { ROLE_MESSAGES } from '../../domain/role.constants';
import { RoleRepository } from "../../infrastructure/role.repository"
import { TCreateRoleInput } from "../../validation/role.validation"


const createRoleService = async (
  payload: TCreateRoleInput,
  user: TJwtPayload
) => {
  const { tenantId } = user;
  const { slug } = payload;

  // Check existing role
  const existingRole =
    await RoleRepository.getTenantByTenantIdWithSlug(tenantId, slug);

  if (existingRole) {
    throw new AppError(
      StatusCodes.CONFLICT,
      ROLE_MESSAGES.ALREADY_EXISTS
    );
  }

  // Create role
  const role = await RoleRepository.createRole(tenantId, payload);

  // Logging
  logger.info({
    tenantId,
    roleId: role.id,
    slug: role.slug,
    createdBy: user.userId
  }, ROLE_MESSAGES.CREATED );

  return {
    role,
  };
};


export default createRoleService