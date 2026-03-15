export const roleSchemas = {
  CreateRoleRequest: {
    type: 'object',
    required: ['name', 'slug'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100, example: 'Tenant Admin' },
      slug: { type: 'string', pattern: '^[A-Z_]+$', example: 'TENANT_ADMIN' },
      description: { type: 'string', maxLength: 255, example: 'Administrative tenant role' },
      isSystem: { type: 'boolean', example: false },
      isActive: { type: 'boolean', example: true },
      level: { type: 'integer', minimum: 0, example: 10 },
      metadata: { type: 'object', additionalProperties: true },
    },
  },
  AssignPermissionsRequest: {
    type: 'object',
    required: ['permissions'],
    properties: {
      permissions: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'string',
          enum: [
            'TENANT:CREATE',
            'TENANT:VIEW',
            'TENANT:UPDATE',
            'TENANT:SUSPEND',
            'TENANT:ARCHIVE',
            'USER:CREATE',
            'USER:VIEW',
            'USER:UPDATE',
            'USER:DELETE',
            'ROLE:CREATE',
            'ROLE:VIEW',
            'ROLE:UPDATE',
            'ROLE:DELETE',
            'PERMISSION:ASSIGN',
            'PERMISSION:REMOVE',
            'PERMISSION:VIEW',
            'REPORT:VIEW',
            'REPORT:EXPORT',
          ],
        },
      },
    },
  },
};
