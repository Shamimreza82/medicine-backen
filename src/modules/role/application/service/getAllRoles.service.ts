import { TJwtPayload } from '@/modules/auth/domain/auth.types';
import { TBaseQueryInput } from '@/shared/utils/validation/baseQuery.validation';

import { RoleRepository } from '../../infrastructure/role.repository';

const getAllRoleService = async (user: TJwtPayload, query: TBaseQueryInput) => {
  return await RoleRepository.getRoles(user.tenantId, query);
};

export default getAllRoleService;
