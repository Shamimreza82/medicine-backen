import { schemas } from './openapi.register';
import { paths } from './openapi.registry';

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Multi-Tenant SaaS Backend API',
    version: '1.0.0',
    description: 'API documentation for the currently mounted auth, role, and tenant endpoints.',
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1',
      description: 'Version 1 API',
    },
  ],
  tags: [{ name: 'Auth' }, { name: 'Roles' }, { name: 'Tenants' }],
  paths,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas,
  },
} as const;
