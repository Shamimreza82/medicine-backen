import { errorResponses } from './responses/error.response';
import { successResponses } from './responses/success.response';
import { authSchemas } from './schemas/auth.schema';
import { healthSchemas } from './schemas/health.schema';
import { hospitalSchemas } from './schemas/hospital.schema';
import { roleSchemas } from './schemas/role.schema';
import { tenantSchemas } from './schemas/tenant.schema';

export const schemas = {
  ...healthSchemas,
  ...authSchemas,
  ...hospitalSchemas,
  ...roleSchemas,
  ...tenantSchemas,
  ...successResponses,
  ...errorResponses,
};
