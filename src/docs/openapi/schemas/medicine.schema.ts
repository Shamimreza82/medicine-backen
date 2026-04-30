export const medicineSchemas = {
  // Query Parameters
  MedicineSearchQuery: {
    type: 'object',
    properties: {
      q: { type: 'string', description: 'Search query' },
      limit: { type: 'integer', format: 'int32', minimum: 1, maximum: 20, default: 10, description: 'Number of results to return' },
    },
    required: ['q'],
  },
  DiseaseSuggestionQuery: {
    type: 'object',
    properties: {
      limit: { type: 'integer', format: 'int32', minimum: 1, maximum: 20, default: 10, description: 'Number of results to return' },
    },
  },

  // Path Parameters
  BrandIdParam: {
    type: 'string',
    description: 'ID of the brand',
    minLength: 1,
  },
  GenericIdParam: {
    type: 'string',
    description: 'ID of the generic',
    minLength: 1,
  },
  DiseaseIdParam: {
    type: 'string',
    description: 'ID of the disease',
    minLength: 1,
  },

  // Request Body
  CheckWarningsRequest: {
    type: 'object',
    properties: {
      candidateGenericId: { type: 'string', description: 'ID of the generic to check warnings for', minLength: 1 },
      currentGenericIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of currently prescribed generic IDs (optional)',
        default: [],
      },
      pregnancy: { type: 'boolean', description: 'Is the patient pregnant? (optional)', default: false },
      lactation: { type: 'boolean', description: 'Is the patient lactating? (optional)', default: false },
      allergyNotes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of allergy notes (optional)',
        default: [],
      },
    },
    required: ['candidateGenericId'],
  },

  // Response Schemas (Placeholders - these would typically come from actual data models)
  Medicine: {
    type: 'object',
    description: 'Represents a medicine item.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      form: { type: 'string' },
      strength: { type: 'string' },
      // Add other relevant properties of a Medicine
    },
    required: ['id', 'name'],
  },
  Brand: {
    type: 'object',
    description: 'Represents a medicine brand.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      // Add other relevant properties of a Brand
    },
    required: ['id', 'name'],
  },
  Generic: {
    type: 'object',
    description: 'Represents a medicine generic.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      // Add other relevant properties of a Generic
    },
    required: ['id', 'name'],
  },
  Product: {
    type: 'object',
    description: 'Represents a product under a brand.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      brandId: { type: 'string', format: 'uuid' },
      // Add other relevant properties of a Product
    },
    required: ['id', 'name', 'brandId'],
  },
  DoseTemplate: {
    type: 'object',
    description: 'Represents a dose template for a generic.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      template: { type: 'string' },
      genericId: { type: 'string', format: 'uuid' },
      // Add other relevant properties of a DoseTemplate
    },
    required: ['id', 'template', 'genericId'],
  },
  MedicineSuggestion: {
    type: 'object',
    description: 'Represents a medicine suggestion for a disease.',
    properties: {
      id: { type: 'string', format: 'uuid' },
      medicineName: { type: 'string' },
      // Add other relevant properties of a MedicineSuggestion
    },
    required: ['id', 'medicineName'],
  },
  CheckWarningsResponse: {
    type: 'object',
    description: 'Response for checking medicine warnings.',
    properties: {
      warnings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', description: 'Type of warning (e.g., contraindication, interaction)' },
            message: { type: 'string', description: 'Warning message' },
            severity: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Severity of the warning' },
          },
          required: ['type', 'message'],
        },
      },
      // Add other relevant properties for the warning response
    },
    required: ['warnings'],
  },
};
