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
