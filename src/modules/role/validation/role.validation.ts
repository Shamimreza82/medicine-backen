import { z } from "zod";

/* ---------------- JSON Schema ---------------- */

const jsonValueSchema: z.ZodTypeAny = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ])
);

/* ---------------- Reusable Fields ---------------- */

const uuidSchema = (field: string) =>
  z.string().uuid(`Invalid ${field} format`);

const roleNameSchema = z
  .string()
  .trim()
  .min(2, "Role name must be at least 2 characters")
  .max(100, "Role name cannot exceed 100 characters");

const roleSlugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters")
  .max(50)
  .regex(
    /^[A-Z_]+$/,
    "Slug must be uppercase letters and underscore only (example: DOCTOR, LAB_TECHNICIAN)"
  );

const descriptionSchema = z
  .string()
  .trim()
  .max(255, "Description cannot exceed 255 characters");

const levelSchema = z
  .number()
  .int("Level must be an integer")
  .min(0, "Level cannot be negative");

/* ---------------- Base Role Schema ---------------- */

const roleBaseSchema = z.object({
  name: roleNameSchema,
  slug: roleSlugSchema,
  description: descriptionSchema.optional(),
  isSystem: z.boolean().optional(),
  isActive: z.boolean().optional(),
  level: levelSchema.optional(),
  metadata: jsonValueSchema.optional(),
});

/* ---------------- Create Role ---------------- */

export const createRoleSchema = z.object({
  body: roleBaseSchema,
});

/* ---------------- Update Role ---------------- */

export const updateRoleSchema = z.object({
  params: z.object({
    id: uuidSchema("role id"),
  }),

  body: roleBaseSchema.partial(),
});

/* ---------------- Role Id Param ---------------- */

export const roleIdParamSchema = z.object({
  params: z.object({
    id: uuidSchema("role id"),
  }),
});

/* ---------------- Export ---------------- */

export const RoleValidationSchemas = {
  createRoleSchema,
  updateRoleSchema,
  roleIdParamSchema,
};

/* ---------------- Types ---------------- */

export type TCreateRoleInput = z.infer<typeof createRoleSchema>["body"];
export type TUpdateRoleInput = z.infer<typeof updateRoleSchema>["body"];
export type TRoleIdParam = z.infer<typeof roleIdParamSchema>["params"];