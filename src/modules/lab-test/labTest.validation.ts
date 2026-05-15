import { z } from 'zod';

export const searchLabTestQuerySchema = z.object({
  q: z.string().trim().optional().default(''),
  category: z.string().trim().min(1).optional(),
  specimen: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export const searchLabTestSchema = z.object({
  query: searchLabTestQuerySchema,
});

export const createLabTestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    shortName: z.string().trim().optional(),
    category: z.string().trim().optional(),
    description: z.string().trim().optional(),
    specimen: z.string().trim().optional(),
    preparation: z.string().trim().optional(),
    normalRange: z.string().trim().optional(),
    unit: z.string().trim().optional(),
    isActive: z.boolean().optional().default(true),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const updateLabTestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    shortName: z.string().trim().optional(),
    category: z.string().trim().optional(),
    description: z.string().trim().optional(),
    specimen: z.string().trim().optional(),
    preparation: z.string().trim().optional(),
    normalRange: z.string().trim().optional(),
    unit: z.string().trim().optional(),
    isActive: z.boolean().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

