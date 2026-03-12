export const healthPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Get service health status',
      responses: {
        '200': {
          description: 'Service is healthy',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/HealthResponse' },
            },
          },
        },
      },
    },
  },
};
