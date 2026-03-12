export const hospitalSchemas = {
  CreateHospitalRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 150, example: 'Apollo Hospital' },
      slug: { type: 'string', example: 'apollo-hospital' },
      email: { type: 'string', format: 'email', example: 'admin@apollo.com' },
      phone: { type: 'string', example: '+8801712345678' },
      address: { type: 'string', maxLength: 255, example: 'Dhaka, Bangladesh' },
      website: { type: 'string', format: 'uri', example: 'https://apollo.example.com' },
      status: {
        type: 'string',
        enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
        example: 'ACTIVE',
      },
      logo: { type: 'string', format: 'uri', example: 'https://cdn.example.com/logo.png' },
    },
  },
  HospitalEntity: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'uuid' },
      name: { type: 'string', example: 'Apollo Hospital' },
      slug: { type: 'string', example: 'apollo-hospital' },
      email: { type: 'string', format: 'email', nullable: true },
      phone: { type: 'string', nullable: true },
      address: { type: 'string', nullable: true },
      logo: { type: 'string', nullable: true },
      website: { type: 'string', nullable: true },
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  HospitalAdminUserEntity: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'uuid' },
      name: { type: 'string', example: 'Hospital Admin' },
      email: { type: 'string', format: 'email' },
      hospitalId: { type: 'string', example: 'uuid' },
      roleId: { type: 'string', example: 'uuid' },
      status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'LOCKED'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateHospitalSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Hospital created successfully' },
      data: {
        type: 'object',
        properties: {
          hospital: { $ref: '#/components/schemas/HospitalEntity' },
          adminUser: { $ref: '#/components/schemas/HospitalAdminUserEntity' },
        },
      },
    },
  },
};
