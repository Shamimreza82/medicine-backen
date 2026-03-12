# Documentation Guide

This project uses Swagger UI and a hand-written OpenAPI document for API documentation.

## Where the docs are available

- Run the backend.
- Open `http://localhost:4000/docs` in the browser.

The docs UI is mounted in `src/bootstrap/createApp.ts`:

```ts
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
```

## How the docs are built

The Swagger document is assembled from files inside `src/docs/openapi`.

- `src/docs/openapi.ts`
  Re-exports the final OpenAPI document.
- `src/docs/openapi/openapi.document.ts`
  Defines the root document like `info`, `servers`, `tags`, `paths`, and `components.schemas`.
- `src/docs/openapi/openapi.register.ts`
  Combines all schema and response definitions.
- `src/docs/openapi/openapi.registry.ts`
  Combines all path definitions.
- `src/docs/openapi/schemas/*`
  Request/response body schemas.
- `src/docs/openapi/responses/*`
  Shared success and error response shapes.
- `src/docs/openapi/paths/*`
  Endpoint documentation for each module.

## How to update docs

When adding a new API feature:

1. Add or update the endpoint in the module route/controller.
2. Add the OpenAPI path entry in `src/docs/openapi/paths`.
3. Add any new schemas in `src/docs/openapi/schemas`.
4. If needed, reuse shared responses from `src/docs/openapi/responses`.
5. Make sure the new file is exported through the existing registry objects.

## Current API groups

The current OpenAPI document includes these tags:

- `Health`
- `Auth`
- `Hospitals`

These match the registered path files:

- `src/docs/openapi/paths/auth.paths.ts`
- `src/docs/openapi/paths/hospital.paths.ts`
- `src/docs/openapi/paths/health.schema.ts`

## Important note

The API routes are served under `/api/v1`, but the Swagger UI is served under `/docs`.

Example:

- Docs UI: `http://localhost:4000/docs`
- Health API: `http://localhost:4000/api/v1/health`
