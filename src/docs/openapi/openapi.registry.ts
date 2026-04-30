import { schemas } from './openapi.register';
import { labTestPaths } from './paths/labTest.paths';
import { medicinePaths } from './paths/medicine.paths';

export { schemas };

export const paths = {
  ...medicinePaths,
  ...labTestPaths,
};
