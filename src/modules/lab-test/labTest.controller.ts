import { catchAsync } from '@/shared/utils/catchAsync';

import { LabTestService } from './labTest.service';
import { searchLabTestSchema } from './labTest.validation';




const serchTest = catchAsync(async (req, res) => {

      const validatedQuery = searchLabTestSchema.parse(req.query)

      const result = await LabTestService.searchLabTests(validatedQuery)

      res.status(200).json({    
        success: true,
        message: 'Lab tests retrieved successfully',
        meta: result.meta,
        data: result.data,
      })

})

export const LabTestController = {
serchTest
}

