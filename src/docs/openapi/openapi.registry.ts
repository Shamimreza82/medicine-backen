
import { schemas } from './openapi.register';
import { authPaths } from './paths/auth.paths';
import { healthPaths } from './paths/health.schema';
import { hospitalPaths } from './paths/hospital.paths';

export { schemas };

export const paths = {
  ...healthPaths,
  ...authPaths,
  ...hospitalPaths,
};
