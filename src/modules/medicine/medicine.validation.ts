import { z } from 'zod';

export const searchMedicineQuerySchema = z.object({
  q: z.string().trim().optional().default(''),
  limit: z.coerce.number().int().min(1).optional().default(10),
  page: z.coerce.number().int().min(1).optional().default(1),
  companyId: z.coerce.number().int().optional(),
  genericId: z.coerce.number().int().optional(),
  indicationId: z.coerce.number().int().optional(),
  therapeuticId: z.coerce.number().int().optional(),
  letter: z.string().length(1).optional(),
});

export const searchMedicineSchema = z.object({
  query: searchMedicineQuerySchema,
});

export const medicineIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const getMedicineSchema = z.object({
  params: medicineIdSchema,
});

