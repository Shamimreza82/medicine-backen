export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'phone', 'password'],
    properties: {
      name: { type: 'string', minLength: 2, example: 'John Doe' },
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      phone: { type: 'string', example: '+8801712345678' },
      password: { type: 'string', minLength: 6, example: 'secret123' },
      roleId: { type: 'string', format: 'uuid' },
      tenantId: { type: 'string', format: 'uuid' },
    },
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      password: { type: 'string', minLength: 6, example: 'secret123' },
    },
  },
  AuthRegisterResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'User registered successfully' },
      data: { type: 'object', nullable: true },
    },
  },
  AuthLoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'User logged in successfully' },
      data: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'jwt-access-token' },
          user: { type: 'object', nullable: true },
        },
      },
    },
  },
  AuthRefreshResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Access token refreshed successfully' },
      data: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'jwt-access-token' },
        },
      },
    },
  },
};
