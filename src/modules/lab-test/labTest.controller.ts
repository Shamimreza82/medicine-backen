import { AppError } from '@/shared/errors/AppError';
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

const getLabTestById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LabTestService.getLabTestById(id);

  sendResponse(res, 200, {
    success: true,
    message: 'Lab test retrieved successfully',
    data: result,
  });
});

const createLabTest = catchAsync(async (req, res) => {
  const result = await LabTestService.createLabTest(req.body);

  sendResponse(res, 201, {
    success: true,
    message: 'Lab test created successfully',
    data: result,
  });
});

const updateLabTest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LabTestService.updateLabTest(id, req.body);

  sendResponse(res, 200, {
    success: true,
    message: 'Lab test updated successfully',
    data: result,
  });
});

const deleteLabTest = catchAsync(async (req, res) => {
  const { id } = req.params;
  await LabTestService.deleteLabTest(id);

  sendResponse(res, 200, {
    success: true,
    message: 'Lab test deleted successfully',
    data: null,
  });
});

const bulkUpload = catchAsync(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new AppError(400, 'Please upload a CSV file');
  }

  const result = await LabTestService.bulkUploadLabTests(file.buffer);

  sendResponse(res, 200, {
    success: true,
    message: `Bulk upload completed. Success: ${result.successCount}, Skipped: ${result.skippedCount}`,
    data: result,
  });
});

const exportToCsv = catchAsync(async (req, res) => {
  const result = await LabTestService.getExportData();
  const data = result.data;

  const headers = ['name', 'slug', 'shortName', 'category', 'description', 'specimen', 'preparation', 'normalRange', 'unit', 'isActive', 'metadata'];
  
  let csvContent = headers.join(',') + '\n';

  data.forEach((test: any) => {
    const row = headers.map(header => {
      let value = (test as any)[header];
      
      if (header === 'metadata') {
        value = value ? JSON.stringify(value).replace(/"/g, '""') : '';
      }
      
      if (value === null || value === undefined) {
        value = '';
      }

      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvContent += row.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=lab_tests_export.csv');
  res.status(200).send(csvContent);
});

export const LabTestController = {
  searchLabTests,
  getLabTestById,
  createLabTest,
  updateLabTest,
  deleteLabTest,
  bulkUpload,
  exportToCsv,
};



