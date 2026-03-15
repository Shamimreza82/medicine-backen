import { z } from 'zod';

const status = z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED']).default('PENDING');

export const createTenantSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Tenant name must be at least 2 characters')
      .max(150, 'Tenant name must be less than 150 characters'),

    slug: z
      .string()
      .min(2, 'Slug is required')
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and hyphen-separated')
      .optional(),

    tenantTypeId: z.string().uuid().min(1, 'Tenant type ID is required'),

    email: z.string().email('Invalid email address').min(1, 'Email is required'),

    phone: z.string().regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid phone number'),

    code: z.string().max(20, 'Code must be less than 20 characters').optional(),
    address: z.string().max(255, 'Address must be less than 255 characters').optional(),

    website: z.string().url('Invalid website URL').optional(),

    logoUrl: z.string().url('Invalid logo URL').optional(),

    status: status.optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

export type TCreateTenantInput = z.infer<typeof createTenantSchema>['body'];
