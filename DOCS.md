# Documentation Guide

This project serves Swagger UI from `/docs` and builds the OpenAPI document from source files under `src/docs/openapi`.

## Access

Run the backend and open:

- `http://localhost:4000/docs`

Swagger is mounted in `src/bootstrap/createApp.ts`:

```ts
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
```

The documented API server base URL is:

- `http://localhost:4000/api/v1`

## OpenAPI Source Layout

- `src/docs/openapi.ts`: public export of the final document
- `src/docs/openapi/openapi.document.ts`: root OpenAPI object (`info`, `servers`, `tags`, `paths`, `components`)
- `src/docs/openapi/openapi.registry.ts`: aggregates all path definitions
- `src/docs/openapi/openapi.register.ts`: aggregates schemas and shared responses
- `src/docs/openapi/paths/*`: endpoint path definitions
- `src/docs/openapi/schemas/*`: schema definitions used by requests and responses
- `src/docs/openapi/responses/*`: reusable response payload shapes

## Current Tags

The current document registers these tag groups:

- `Health`
- `Auth`
- `Hospitals`

Current path source files:

- `src/docs/openapi/paths/health.schema.ts`
- `src/docs/openapi/paths/auth.paths.ts`
- `src/docs/openapi/paths/hospital.paths.ts`

## Update Workflow

When adding or changing an endpoint:

1. Update the Express route/controller first.
2. Add or update the corresponding file in `src/docs/openapi/paths`.
3. Add any new request or response schemas in `src/docs/openapi/schemas`.
4. Reuse shared response objects from `src/docs/openapi/responses` where possible.
5. Ensure the new path/schema is exported through the existing OpenAPI registry/register files.

## Important Limitation

The codebase and the OpenAPI files should stay in sync manually. Some service files already exist for future auth endpoints, but the currently mounted auth router only exposes `POST /api/v1/auth/register`.
