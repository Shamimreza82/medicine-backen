import { errorResponses } from './responses/error.response';
import { successResponses } from './responses/success.response';
import { authSchemas } from './schemas/auth.schema';
import { healthSchemas } from './schemas/health.schema';
import { hospitalSchemas } from './schemas/hospital.schema';

export const schemas = {
  ...healthSchemas,
  ...authSchemas,
  ...hospitalSchemas,
  ...successResponses,
  ...errorResponses,
};
