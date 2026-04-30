export const labTestPaths = {
  '/lab-test/search': {
    get: {
      tags: ['Lab Tests'],
      summary: 'Search for lab tests',
      operationId: 'searchLabTests',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: false,
          description: 'Search query for lab tests',
        },
        {
          in: 'query',
          name: 'category',
          schema: { type: 'string' },
          required: false,
          description: 'Filter by lab test category',
        },
        {
          in: 'query',
          name: 'specimen',
          schema: { type: 'string' },
          required: false,
          description: 'Filter by specimen type',
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', format: 'int32', minimum: 1, maximum: 50, default: 10 },
          required: false,
          description: 'Number of results to return (default: 10, max: 50)',
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', format: 'int32', minimum: 1, default: 1 },
          required: false,
          description: 'Page number (default: 1)',
        },
      ],
      responses: {
        '200': {
          description: 'Successful search',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/LabTest', // Placeholder: assuming a LabTest schema will be defined
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/schemas/BadRequestError',
        },
      },
    },
  },
};
