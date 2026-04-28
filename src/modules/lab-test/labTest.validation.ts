import { z } from 'zod'

export const searchLabTestSchema = z.object({
  q: z.string().trim().optional().default(''),
  category: z.string().trim().optional(),
  specimen: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  page: z.coerce.number().int().min(1).optional().default(1),
})