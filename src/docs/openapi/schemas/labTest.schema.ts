export const labTestSchemas = {
  // Query Parameters
  LabTestSearchQuery: {
    type: 'object',
    properties: {
      q: { type: 'string', description: 'Search query for lab tests' },
      category: { type: 'string', description: 'Filter by lab test category' },
      specimen: { type: 'string', description: 'Filter by specimen type' },
      limit: { type: 'integer', format: 'int32', minimum: 1, maximum: 50, default: 10, description: 'Number of results to return' },
      page: { type: 'integer', format: 'int32', minimum: 1, default: 1, description: 'Page number' },
    },
  },

  LabTest: {
    type: 'object',
    description: 'Represents a lab test item.',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
      shortName: { type: 'string', nullable: true },
      category: { type: 'string', nullable: true },
      description: { type: 'string', nullable: true },
      specimen: { type: 'string', nullable: true },
      preparation: { type: 'string', nullable: true },
      normalRange: { type: 'string', nullable: true },
      unit: { type: 'string', nullable: true },
      isActive: { type: 'boolean' },
    },
    required: ['id', 'name'],
  },

  PaginatedLabTests: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/LabTest' },
      },
      meta: { $ref: '#/components/schemas/PaginationMeta' },
    },
  },
};
