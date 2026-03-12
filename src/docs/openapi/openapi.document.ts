import { schemas } from "./openapi.register";
import { paths } from "./openapi.registry";


export const openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Hospital Management API',
        version: '1.0.0',
        description: 'API documentation for the Hospital Management backend service.',
    },
    servers: [
        {
            url: 'http://localhost:4000/api/v1',
            description: 'Version 1 API',
        },
    ],
    tags: [
        { name: 'Health' },
        { name: 'Auth' },
        { name: 'Hospitals' }
    ],
    paths,
    components: {
        schemas,
    },
} as const;
