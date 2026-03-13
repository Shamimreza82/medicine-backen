export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['name', 'email', 'phone', 'password'],
    properties: {
      name: { type: 'string', minLength: 2, example: 'John Doe' },
      email: { type: 'string', format: 'email', example: 'john@example.com' },
      phone: { type: 'string', example: '+8801712345678' },
      password: { type: 'string', minLength: 6, example: 'secret123' },
    },
  },
};
