import { sendResponse } from '@/shared/utils/sendResponse';

import { LabTestService } from './labTest.service';
import { searchLabTestSchema } from './labTest.validation';

import type { RequestHandler } from 'express';

const searchLabTests: RequestHandler = async (req, res, next) => {
  try {
    const validated = searchLabTestSchema.parse({ query: req.query });
    const result = await LabTestService.searchLabTests(validated.query);

    sendResponse(res, 200, {
      success: true,
      message: 'Lab tests retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const LabTestController = {
  searchLabTests,
};
