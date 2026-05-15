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

  getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.getStats();
    sendResponse(res, 200, {
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: result,
    });
  });

  createBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.createBrand(req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Brand created successfully',
      data: result,
    });
  });

  updateBrand = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.updateBrand(Number(id), req.body);
    sendResponse(res, 200, {
      success: true,
      message: 'Brand updated successfully',
      data: result,
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

  createGeneric = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.createGeneric(req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Generic created successfully',
      data: result,
    });
  });

  updateGeneric = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.updateGeneric(Number(id), req.body);
    sendResponse(res, 200, {
      success: true,
      message: 'Generic updated successfully',
      data: result,
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

  createIndication = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.createIndication(req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Indication created successfully',
      data: result,
    });
  });

  updateIndication = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.updateIndication(Number(id), req.body);
    sendResponse(res, 200, {
      success: true,
      message: 'Indication updated successfully',
      data: result,
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

  createCompany = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.createCompany(req.body);
    sendResponse(res, 201, {
      success: true,
      message: 'Company created successfully',
      data: result,
    });
  });

  updateCompany = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await medicineService.updateCompany(Number(id), req.body);
    sendResponse(res, 200, {
      success: true,
      message: 'Company updated successfully',
      data: result,
    });
  });

  getPregnancyCategories = catchAsync(async (req: Request, res: Response) => {
    const result = await medicineService.getPregnancyCategories();
    sendResponse(res, 200, {
      success: true,
      message: 'Pregnancy categories retrieved successfully',
      data: result,
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
