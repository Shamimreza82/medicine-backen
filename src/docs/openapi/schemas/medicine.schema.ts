export const medicineSchemas = {
  PaginationMeta: {
    type: 'object',
    properties: {
      page: { type: 'integer' },
      limit: { type: 'integer' },
      total: { type: 'integer' },
      totalPages: { type: 'integer' },
    },
  },
  Brand: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      form: { type: 'string', nullable: true },
      strength: { type: 'string', nullable: true },
      price: { type: 'string', nullable: true },
      packSize: { type: 'string', nullable: true },
      isSponsored: { type: 'boolean' },
      company: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
      generic: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
    },
  },
  Generic: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      indication: { type: 'string', nullable: true },
      therapeuticClass: { type: 'string', nullable: true },
    },
  },
  Indication: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  Company: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
  CombinedSearchResponse: {
    type: 'object',
    properties: {
      brands: {
        type: 'array',
        items: { $ref: '#/components/schemas/Brand' },
      },
      generics: {
        type: 'array',
        items: { $ref: '#/components/schemas/Generic' },
      },
      indications: {
        type: 'array',
        items: { $ref: '#/components/schemas/Indication' },
      },
      companies: {
        type: 'array',
        items: { $ref: '#/components/schemas/Company' },
      },
    },
  },
  PaginatedBrands: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Brand' },
      },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
  PaginatedGenerics: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Generic' },
      },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
  PaginatedIndications: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Indication' },
      },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
  PaginatedCompanies: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Company' },
      },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
};
