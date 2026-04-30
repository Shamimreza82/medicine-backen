import { schemas } from './openapi.register';
import { paths } from './openapi.registry';

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Multi-Tenant SaaS Backend API',
    version: '1.0.0',
    description: 'API documentation for the medicine-backend project, including authentication, roles, tenants, medicine management, and lab test functionalities.',
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1',
      description: 'Version 1 API',
    },
  ],
  tags: [
    {name: 'Health'},
    { name: 'Medicine' },
    { name: 'Medicine Brands' },
    { name: 'Medicine Generics' },
    { name: 'Medicine Diseases' },
    { name: 'Medicine Warnings' },
    { name: 'Lab Tests' },
  ],
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
