/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

export const baseQuerySchema = z.object({
  query: z
    .object({
      // Pagination
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),

      // Search
      search: z.string().trim().optional(),

      // Sorting
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),

      // Field selection
      fields: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',') : undefined)),

      // Include relations
      include: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(',') : undefined)),

      // Filters
      filters: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;

          const obj: Record<string, any> = {};

          val.split(',').forEach((item) => {
            const [key, value] = item.split(':');
            obj[key] = value;
          });

          return obj;
        }),

      // Date range
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),

      // Boolean filter
      isActive: z.coerce.boolean().optional(),

      // Cursor pagination
      cursor: z.string().optional(),
    })
    .strip(),
});

export type TBaseQueryInput = z.infer<typeof baseQuerySchema>['query'];
