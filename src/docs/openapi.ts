export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Hospital Management API',
    version: '1.0.0',
    description: 'API documentation for the Hospital Management backend service.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Version 1 API',
    },
    {
      url: '/api/v2',
      description: 'Version 2 API',
    },
  ],
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Users' }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Get service health status',
        responses: {
          '200': {
            description: 'Service is healthy',
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        responses: {
          '200': {
            description: 'Registration response',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate user credentials',
        responses: {
          '200': {
            description: 'Login response',
          },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh an access token',
        responses: {
          '200': {
            description: 'Token refresh response',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout the current user',
        responses: {
          '200': {
            description: 'Logout response',
          },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        responses: {
          '200': {
            description: 'List of users',
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user',
        responses: {
          '201': {
            description: 'User created',
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Single user response',
          },
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User updated',
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted',
          },
        },
      },
    },
  },
} as const;
