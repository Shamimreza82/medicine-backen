import { Request, Response } from 'express';

import { catchAsync } from '@/shared/utils/catchAsync';
import { sendResponse } from '@/shared/utils/sendResponse';

import { medicineService } from './medicine.service';
import { MedicineSearchQuery } from './medicine.types';

export class MedicineController {
  searchBrands = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as MedicineSearchQuery;
    const result = await medicineService.searchBrands(query);
    sendResponse(res, 200, {
      success: true,
      message: 'Brands retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  });

  searchGenerics = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as MedicineSearchQuery;
    const result = await medicineService.searchGenerics(query);
    sendResponse(res, 200, {
      success: true,
      message: 'Generics retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  });

  searchIndications = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as MedicineSearchQuery;
    const result = await medicineService.searchIndications(query);
    sendResponse(res, 200, {
      success: true,
      message: 'Indications retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  });

  searchCompanies = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as MedicineSearchQuery;
    const result = await medicineService.searchCompanies(query);
    sendResponse(res, 200, {
      success: true,
      message: 'Companies retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  });

  getClassificationTree = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.getClassificationTree();
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    sendResponse(res, 200, {
      success: true,
      message: 'Classification tree retrieved successfully',
      data: result,
    });
  });

  combinedSearch = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as MedicineSearchQuery;
    const result = await medicineService.combinedSearch(query);
    sendResponse(res, 200, {
      success: true,
      message: 'Search results retrieved successfully',
      data: result,
    });
  });

  getBrandById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.getBrandById(Number(id));
    sendResponse(res, 200, {
      success: true,
      message: 'Brand retrieved successfully',
      data: result,
    });
  });

  getGenericById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.getGenericById(Number(id));
    sendResponse(res, 200, {
      success: true,
      message: 'Generic retrieved successfully',
      data: result,
    });
  });

  getCompanyById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.getCompanyById(Number(id));
    sendResponse(res, 200, {
      success: true,
      message: 'Company retrieved successfully',
      data: result,
    });
  });

  getIndicationById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.getIndicationById(Number(id));
    sendResponse(res, 200, {
      success: true,
      message: 'Indication retrieved successfully',
      data: result,
    });
  });

  getDistinctForms = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as unknown as MedicineSearchQuery;
    const result = await medicineService.getDistinctForms(query);
    sendResponse(res, 200, {
      success: true,
      message: 'Dosage forms retrieved successfully',
      data: result.data,
      meta: result.meta,
    });
  });
}

export const medicineController = new MedicineController();
