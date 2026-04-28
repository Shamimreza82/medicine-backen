import { z } from 'zod';

const paginationLimit = z.coerce.number().int().min(1).max(20).optional().default(10);

export const searchMedicinesSchema = z.object({
  query: z.object({
    q: z.string().trim().min(1, 'Search query is required'),
    limit: paginationLimit,
  }),
});

export const searchBrandsSchema = searchMedicinesSchema;

export const searchGenericsSchema = searchMedicinesSchema;

export const brandProductsParamsSchema = z.object({
  params: z.object({
    brandId: z.string().trim().min(1),
  }),
});

export const genericDoseTemplateParamsSchema = z.object({
  params: z.object({
    genericId: z.string().trim().min(1),
  }),
});

export const diseaseSuggestionParamsSchema = z.object({
  params: z.object({
    diseaseId: z.string().trim().min(1),
  }),
  query: z.object({
    limit: paginationLimit,
  }),
});

export const checkWarningsSchema = z.object({
  body: z.object({
    candidateGenericId: z.string().trim().min(1),
    currentGenericIds: z.array(z.string().trim().min(1)).optional().default([]),
    pregnancy: z.boolean().optional().default(false),
    lactation: z.boolean().optional().default(false),
    allergyNotes: z.array(z.string().trim().min(1)).optional().default([]),
  }),
});
