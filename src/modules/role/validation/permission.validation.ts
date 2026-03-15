import { z } from "zod";

import { authPermissions } from "@/shared/lib/data/authPermissions";



const permissionNames = authPermissions.map((item) => item.name) as [
  string,
  ...string[]
];

export const assignPermissionsSchema = z.object({
  body: z.object({
    permissions: z
      .array(z.enum(permissionNames))
      .min(1, "At least one permission is required"),
  }),
});




export const PermissionValidationSchema = {
    assignPermissionsSchema
}

export type TAssignPermissionsInput = z.infer<typeof assignPermissionsSchema>["body"];
export type TPermissionsName = z.infer<typeof permissionNames>