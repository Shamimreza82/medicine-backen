export const medicinePaths = {
  '/medicine/search': {
    get: {
      tags: ['Medicine'],
      summary: 'Search for medicines',
      operationId: 'searchMedicines',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: true,
          description: 'Search query for medicines',
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', format: 'int32', minimum: 1, maximum: 20, default: 10 },
          required: false,
          description: 'Number of results to return (default: 10, max: 20)',
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
                  $ref: '#/components/schemas/Medicine', // Placeholder: assuming a Medicine schema will be defined
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
  '/medicine/brands/search': {
    get: {
      tags: ['Medicine Brands'],
      summary: 'Search for medicine brands',
      operationId: 'searchBrands',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: true,
          description: 'Search query for brands',
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', format: 'int32', minimum: 1, maximum: 20, default: 10 },
          required: false,
          description: 'Number of results to return (default: 10, max: 20)',
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
                  $ref: '#/components/schemas/Brand', // Placeholder: assuming a Brand schema will be defined
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
  '/medicine/generics/search': {
    get: {
      tags: ['Medicine Generics'],
      summary: 'Search for medicine generics',
      operationId: 'searchGenerics',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: true,
          description: 'Search query for generics',
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', format: 'int32', minimum: 1, maximum: 20, default: 10 },
          required: false,
          description: 'Number of results to return (default: 10, max: 20)',
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
                  $ref: '#/components/schemas/Generic', // Placeholder: assuming a Generic schema will be defined
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
  '/medicine/brands/{brandId}/products': {
    get: {
      tags: ['Medicine Brands'],
      summary: 'Get products for a specific brand',
      operationId: 'getBrandProducts',
      parameters: [
        {
          in: 'path',
          name: 'brandId',
          schema: { type: 'string' },
          required: true,
          description: 'ID of the brand',
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of products',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Product', // Placeholder: assuming a Product schema will be defined
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/schemas/BadRequestError',
        },
        '404': {
          $ref: '#/components/schemas/NotFoundError',
        },
      },
    },
  },
  '/medicine/generics/{genericId}/dose-templates': {
    get: {
      tags: ['Medicine Generics'],
      summary: 'Get dose templates for a specific generic',
      operationId: 'getGenericDoseTemplate',
      parameters: [
        {
          in: 'path',
          name: 'genericId',
          schema: { type: 'string' },
          required: true,
          description: 'ID of the generic',
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of dose templates',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/DoseTemplate', // Placeholder: assuming a DoseTemplate schema will be defined
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/schemas/BadRequestError',
        },
        '404': {
          $ref: '#/components/schemas/NotFoundError',
        },
      },
    },
  },
  '/medicine/diseases/{diseaseId}/suggestions': {
    get: {
      tags: ['Medicine Diseases'],
      summary: 'Get medicine suggestions for a specific disease',
      operationId: 'getDiseaseSuggestions',
      parameters: [
        {
          in: 'path',
          name: 'diseaseId',
          schema: { type: 'string' },
          required: true,
          description: 'ID of the disease',
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', format: 'int32', minimum: 1, maximum: 20, default: 10 },
          required: false,
          description: 'Number of results to return (default: 10, max: 20)',
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of suggestions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/MedicineSuggestion', // Placeholder: assuming a MedicineSuggestion schema will be defined
                },
              },
            },
          },
        },
        '400': {
          $ref: '#/components/schemas/BadRequestError',
        },
        '404': {
          $ref: '#/components/schemas/NotFoundError',
        },
      },
    },
  },
  '/medicine/check-warnings': {
    post: {
      tags: ['Medicine Warnings'],
      summary: 'Check for medicine warnings based on patient conditions',
      operationId: 'checkWarnings',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CheckWarningsRequest', // Placeholder: assuming a CheckWarningsRequest schema will be defined
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successful warning check',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CheckWarningsResponse', // Placeholder: assuming a CheckWarningsResponse schema will be defined
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
