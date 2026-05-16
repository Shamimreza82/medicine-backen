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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaginatedBrands' },
            },
          },
        },
      },
    },
    post: {
      tags: ['Medicine'],
      summary: 'Create a new brand',
      operationId: 'createBrand',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateBrand' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Brand created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Brand' },
            },
          },
        },
      },
    },
  },
  '/medicines/brands/{id}': {
    get: {
      tags: ['Medicine'],
      summary: 'Get brand by ID',
      operationId: 'getBrandById',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of brand',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Brand' },
            },
          },
        },
        '404': {
          description: 'Brand not found',
        },
      },
    },
    patch: {
      tags: ['Medicine'],
      summary: 'Update a brand',
      operationId: 'updateBrand',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateBrand' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Brand updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Brand' },
            },
          },
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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaginatedGenerics' },
            },
          },
        },
      },
    },
    post: {
      tags: ['Medicine'],
      summary: 'Create a new generic',
      operationId: 'createGeneric',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateGeneric' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Generic created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Generic' },
            },
          },
        },
      },
    },
  },
  '/medicines/generics/{id}': {
    get: {
      tags: ['Medicine'],
      summary: 'Get generic by ID',
      operationId: 'getGenericById',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of generic',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Generic' },
            },
          },
        },
        '404': {
          description: 'Generic not found',
        },
      },
    },
    patch: {
      tags: ['Medicine'],
      summary: 'Update a generic',
      operationId: 'updateGeneric',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateGeneric' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Generic updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Generic' },
            },
          },
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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaginatedIndications' },
            },
          },
        },
      },
    },
    post: {
      tags: ['Medicine'],
      summary: 'Create a new indication',
      operationId: 'createIndication',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateIndication' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Indication created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Indication' },
            },
          },
        },
      },
    },
  },
  '/medicines/indications/{id}': {
    get: {
      tags: ['Medicine'],
      summary: 'Get indication by ID',
      operationId: 'getIndicationById',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of indication',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Indication' },
            },
          },
        },
        '404': {
          description: 'Indication not found',
        },
      },
    },
    patch: {
      tags: ['Medicine'],
      summary: 'Update an indication',
      operationId: 'updateIndication',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateIndication' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Indication updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Indication' },
            },
          },
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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaginatedCompanies' },
            },
          },
        },
      },
    },
    post: {
      tags: ['Medicine'],
      summary: 'Create a new company',
      operationId: 'createCompany',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCompany' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Company created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Company' },
            },
          },
        },
      },
    },
  },
  '/medicines/companies/{id}': {
    get: {
      tags: ['Medicine'],
      summary: 'Get company by ID',
      operationId: 'getCompanyById',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Successful retrieval of company',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Company' },
            },
          },
        },
        '404': {
          description: 'Company not found',
        },
      },
    },
    patch: {
      tags: ['Medicine'],
      summary: 'Update a company',
      operationId: 'updateCompany',
      parameters: [
        {
          in: 'path',
          name: 'id',
          schema: { type: 'integer' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCompany' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Company updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Company' },
            },
          },
        },
      },
    },
  },
  '/medicines/stats': {
    get: {
      tags: ['Medicine'],
      summary: 'Get medicine module statistics',
      operationId: 'getStats',
      responses: {
        '200': {
          description: 'Successful retrieval of statistics',
        },
      },
    },
  },
  '/medicines/pregnancy-categories': {
    get: {
      tags: ['Medicine'],
      summary: 'Get all pregnancy categories',
      operationId: 'getPregnancyCategories',
      responses: {
        '200': {
          description: 'Successful retrieval of pregnancy categories',
        },
      },
    },
  },
  '/medicines/classifications': {
    get: {
      tags: ['Medicine'],
      summary: 'Get medicine classification tree',
      operationId: 'getClassificationTree',
      responses: {
        '200': {
          description: 'Successful retrieval of classification tree',
        },
      },
    },
  },
  '/medicines/dosage-forms': {
    get: {
      tags: ['Medicine'],
      summary: 'Get distinct dosage forms',
      operationId: 'getDistinctForms',
      responses: {
        '200': {
          description: 'Successful retrieval of dosage forms',
        },
      },
    },
  },
};
