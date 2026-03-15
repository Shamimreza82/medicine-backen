import { schemas } from './openapi.register';
import { authPaths } from './paths/auth.paths';
import { rolePaths } from './paths/role.paths';
import { tenantPaths } from './paths/tenant.paths';

export { schemas };

export const paths = {
  ...authPaths,
  ...rolePaths,
  ...tenantPaths,
};
