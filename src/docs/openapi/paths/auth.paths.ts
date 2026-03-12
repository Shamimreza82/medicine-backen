export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new user',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        '404': {
          description: 'Registration response',
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
      },
    },
  },
};
