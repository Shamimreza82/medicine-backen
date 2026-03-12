export const hospitalPaths = {
  '/hospitals': {
    post: {
      tags: ['Hospitals'],
      summary: 'Create a hospital',
      description:
        'Creates a hospital, creates a default hospital admin user, and enables all default features.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateHospitalRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Hospital created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateHospitalSuccessResponse' },
            },
          },
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
        '404': {
          description: 'Hospital Admin role not found',
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
