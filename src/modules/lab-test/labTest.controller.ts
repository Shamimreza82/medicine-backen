import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { LabTestService } from './labTest.service';
import { LabTestSearchQuery } from './labTest.types';

const searchLabTests = catchAsync(async (req, res) => {
  const query = req.query as unknown as LabTestSearchQuery;
  const result = await LabTestService.searchLabTests(query);

  sendResponse(res, 200, {
    success: true,
    message: 'Lab tests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const LabTestController = {
  searchLabTests,
};
