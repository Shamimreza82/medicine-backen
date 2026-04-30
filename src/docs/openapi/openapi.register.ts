import { errorResponses } from './responses/error.response';
import { successResponses } from './responses/success.response';import { labTestSchemas } from './schemas/labTest.schema';
import { medicineSchemas } from './schemas/medicine.schema';


export const schemas = {
  ...medicineSchemas,
  ...labTestSchemas,
  ...successResponses,
  ...errorResponses,
};
