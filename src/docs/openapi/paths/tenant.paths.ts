export const tenantPaths = {
  '/tenants': {
    post: {
      tags: ['Tenants'],
      summary: 'Create tenant',
      description: 'Requires authentication and the `TENANT:CREATE` permission.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTenantRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Tenant created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StandardSuccessResponse' },
            },
          },
        },
        '400': {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
        '401': {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '403': {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
      },
    },
  },
};
