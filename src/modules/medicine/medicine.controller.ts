import { sendResponse } from '@/shared/utils/sendResponse';

import { MedicineService } from './medicine.service';
import {
  brandProductsParamsSchema,
  checkWarningsSchema,
  diseaseSuggestionParamsSchema,
  genericDoseTemplateParamsSchema,
  searchBrandsSchema,
  searchGenericsSchema,
  searchMedicinesSchema,
} from './medicine.validation';

import type { RequestHandler } from 'express';

const searchMedicines: RequestHandler = async (req, res, next) => {
  try {
    const validated = searchMedicinesSchema.parse({ query: req.query });
    const result = await MedicineService.searchMedicines(validated.query);

    sendResponse(res, 200, {
      success: true,
      message: 'Medicine suggestions retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const searchBrands: RequestHandler = async (req, res, next) => {
  try {
    const validated = searchBrandsSchema.parse({ query: req.query });
    const result = await MedicineService.searchBrands(validated.query);

    sendResponse(res, 200, {
      success: true,
      message: 'Brand suggestions retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const searchGenerics: RequestHandler = async (req, res, next) => {
  try {
    const validated = searchGenericsSchema.parse({ query: req.query });
    const result = await MedicineService.searchGenerics(validated.query);

    sendResponse(res, 200, {
      success: true,
      message: 'Generic suggestions retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getBrandProducts: RequestHandler = async (req, res, next) => {
  try {
    const validated = brandProductsParamsSchema.parse({ params: req.params });
    const result = await MedicineService.getBrandProducts(validated.params.brandId);

    sendResponse(res, 200, {
      success: true,
      message: 'Brand product suggestions retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getGenericDoseTemplate: RequestHandler = async (req, res, next) => {
  try {
    const validated = genericDoseTemplateParamsSchema.parse({ params: req.params });
    const result = await MedicineService.getGenericDoseTemplate(validated.params.genericId);

    sendResponse(res, 200, {
      success: true,
      message: 'Dose template retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDiseaseSuggestions: RequestHandler = async (req, res, next) => {
  try {
    const validated = diseaseSuggestionParamsSchema.parse({
      params: req.params,
      query: req.query,
    });
    const result = await MedicineService.getDiseaseSuggestions(
      validated.params.diseaseId,
      validated.query.limit,
    );

    sendResponse(res, 200, {
      success: true,
      message: 'Disease-wise medicine suggestions retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const checkWarnings: RequestHandler = async (req, res, next) => {
  try {
    const validated = checkWarningsSchema.parse({ body: req.body });
    const result = await MedicineService.checkWarnings(validated.body);

    sendResponse(res, 200, {
      success: true,
      message: 'Medicine warnings checked successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const MedicineController = {
  searchMedicines,
  searchBrands,
  searchGenerics,
  getBrandProducts,
  getGenericDoseTemplate,
  getDiseaseSuggestions,
  checkWarnings,
};
