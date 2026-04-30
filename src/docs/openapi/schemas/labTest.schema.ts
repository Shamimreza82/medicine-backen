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

  // Response Schemas (Placeholders - these would typically come from actual data models)
  LabTest: {
    type: 'object',
    description: 'Represents a lab test item.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      category: { type: 'string' },
      specimen: { type: 'string' },
      // Add other relevant properties of a LabTest
    },
    required: ['id', 'name'],
  },
};
