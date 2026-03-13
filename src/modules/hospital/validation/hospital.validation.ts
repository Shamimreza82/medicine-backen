import { z } from 'zod';

export const createHospitalSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Hospital name must be at least 2 characters')
      .max(150, 'Hospital name must be less than 150 characters'),

    slug: z
      .string()
      .min(2, 'Slug is required')
      .max(160, 'Slug must be less than 160 characters')
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and hyphen-separated')
      .optional(),

    email: z.string().email('Invalid email address').optional(),

    phone: z
      .string()
      .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number')
      .optional(),

    address: z.string().max(255, 'Address must be less than 255 characters').optional(),

    website: z.string().url('Invalid website URL').optional(),

    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE').optional(),

    logo: z.string().url('Invalid logo URL').optional(),
  }),
});

export type TCreateHospitalInput = z.infer<typeof createHospitalSchema.shape.body>;
