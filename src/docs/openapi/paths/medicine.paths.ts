export const medicinePaths = {
  '/medicines/search': {
    get: {
      tags: ['Medicine'],
      summary: 'Combined search for brands, generics, indications, and companies',
      operationId: 'combinedSearch',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: false,
          description: 'Search query string',
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
          required: false,
          description: 'Limit results per category',
        },
      ],
      responses: {
        '200': {
          description: 'Successful search',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CombinedSearchResponse',
              },
            },
          },
        },
      },
    },
  },
  '/medicines/brands': {
    get: {
      tags: ['Medicine'],
      summary: 'Search for medicine brands',
      operationId: 'searchBrands',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: false,
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
          required: false,
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          required: false,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of brands',
        },
      },
    },
  },
  '/medicines/generics': {
    get: {
      tags: ['Medicine'],
      summary: 'Search for medicine generics',
      operationId: 'searchGenerics',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: false,
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
          required: false,
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          required: false,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of generics',
        },
      },
    },
  },
  '/medicines/indications': {
    get: {
      tags: ['Medicine'],
      summary: 'Search for indications',
      operationId: 'searchIndications',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: false,
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
          required: false,
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          required: false,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of indications',
        },
      },
    },
  },
  '/medicines/companies': {
    get: {
      tags: ['Medicine'],
      summary: 'Search for medicine companies',
      operationId: 'searchCompanies',
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          required: false,
        },
        {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 10 },
          required: false,
        },
        {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', default: 1 },
          required: false,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of companies',
        },
      },
    },
  },
};
