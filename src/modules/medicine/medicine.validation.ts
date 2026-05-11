import { z } from 'zod';

export const searchMedicineQuerySchema = z.object({
  q: z.string().trim().optional().default(''),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  page: z.coerce.number().int().min(1).optional().default(1),
});

export const searchMedicineSchema = z.object({
  query: searchMedicineQuerySchema,
});

