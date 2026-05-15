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
  form: z.string().trim().optional(),
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

export const createGenericSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    indication: z.string().trim().optional(),
    administration: z.string().trim().optional(),
    adultDose: z.string().trim().optional(),
    childDose: z.string().trim().optional(),
    renalDose: z.string().trim().optional(),
    contraIndication: z.string().trim().optional(),
    precaution: z.string().trim().optional(),
    sideEffect: z.string().trim().optional(),
    interaction: z.string().trim().optional(),
    modeOfAction: z.string().trim().optional(),
    pregnancyCategoryId: z.number().int().optional().nullable(),
    pregnancyCategoryNote: z.string().trim().optional(),
  }),
});

export const updateGenericSchema = z.object({
  params: medicineIdSchema,
  body: createGenericSchema.shape.body.partial(),
});

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    companyId: z.number().int().positive('Company is required'),
    genericId: z.number().int().positive('Generic is required'),
    form: z.string().trim().optional(),
    packSize: z.string().trim().optional(),
    price: z.string().trim().optional(),
    strength: z.string().trim().optional(),
    isSponsored: z.boolean().optional().default(false),
  }),
});

export const updateBrandSchema = z.object({
  params: medicineIdSchema,
  body: createBrandSchema.shape.body.partial(),
});

export const createIndicationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
  }),
});

export const updateIndicationSchema = z.object({
  params: medicineIdSchema,
  body: createIndicationSchema.shape.body.partial(),
});

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    order: z.number().int().optional().default(0),
  }),
});

export const updateCompanySchema = z.object({
  params: medicineIdSchema,
  body: createCompanySchema.shape.body.partial(),
});
