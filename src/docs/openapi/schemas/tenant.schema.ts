export const tenantSchemas = {
  CreateTenantRequest: {
    type: 'object',
    required: ['name', 'tenantTypeId', 'email', 'phone'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 150, example: 'City Care Hospital' },
      slug: {
        type: 'string',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'city-care-hospital',
      },
      tenantTypeId: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email', example: 'hello@citycare.example' },
      phone: { type: 'string', example: '+8801712345678' },
      code: { type: 'string', maxLength: 20, example: 'CCH001' },
      address: { type: 'string', maxLength: 255, example: 'Dhaka, Bangladesh' },
      website: { type: 'string', format: 'uri', example: 'https://citycare.example' },
      logoUrl: { type: 'string', format: 'uri', example: 'https://cdn.example/logo.png' },
      status: {
        type: 'string',
        enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED'],
        example: 'PENDING',
      },
      metadata: { type: 'object', additionalProperties: true },
    },
  },
};
