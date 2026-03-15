# API Guide

## API Docs UI

When the server is running, Swagger UI is available at:

- `GET /docs`
- Local URL: `http://localhost:4000/docs`

The documented API server base URL is:

- `http://localhost:4000/api/v1`

## Current Runtime API

Public routes:

- `GET /`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`

Protected routes:

- `GET /api/v1/roles`
- `POST /api/v1/roles`
- `POST /api/v1/roles/:roleId/permissions`
- `POST /api/v1/tenants`

`/api/v1/auth/*` routes are mounted before the global auth middleware. `/api/v1/roles` and `/api/v1/tenants` are mounted after it, so they require `Authorization: Bearer <accessToken>`.

## Endpoint Notes

### Auth

- `POST /api/v1/auth/register`
  - Body: `name`, `email`, `phone`, `password`
  - Optional: `roleId`, `tenantId`
  - Returns `201 Created`
- `POST /api/v1/auth/login`
  - Body: `email`, `password`
  - Returns an access token in the JSON response
  - Sets `refreshToken` as an HTTP-only cookie
- `POST /api/v1/auth/refresh-token`
  - Reads the `refreshToken` cookie
  - Returns a new access token
  - Rotates the `refreshToken` cookie

### Roles

- `GET /api/v1/roles`
  - Requires a valid bearer token
  - Supports query params from `baseQuerySchema`: `page`, `limit`, `search`, `sortBy`, `sortOrder`, `fields`, `include`, `filters`, `startDate`, `endDate`, `isActive`, `cursor`
- `POST /api/v1/roles`
  - Requires a valid bearer token
  - Requires `ROLE:CREATE`
  - Body: `name`, `slug`
  - Optional: `description`, `isSystem`, `isActive`, `level`, `metadata`
- `POST /api/v1/roles/:roleId/permissions`
  - Requires a valid bearer token
  - Body: `permissions` as a non-empty string array

### Tenants

- `POST /api/v1/tenants`
  - Requires a valid bearer token
  - Requires `TENANT:CREATE`
  - Body: `name`, `tenantTypeId`, `email`, `phone`
  - Optional: `slug`, `code`, `address`, `website`, `logoUrl`, `status`, `metadata`

## Current Permission Checks

The implemented route middleware currently enforces these permission checks:

- `ROLE:CREATE` on `POST /api/v1/roles`
- `TENANT:CREATE` on `POST /api/v1/tenants`

`POST /api/v1/roles/:roleId/permissions` is authenticated but does not currently apply a dedicated permission middleware.

## OpenAPI Source

OpenAPI sources live under `src/docs/openapi`:

- `openapi.document.ts`: root document
- `openapi.registry.ts`: path registration
- `openapi.register.ts`: schema/response registration
- `paths/*`: endpoint docs
- `schemas/*`: schema definitions
- `responses/*`: reusable response definitions

## Updating API Docs

1. Update route/controller/service behavior first.
2. Update corresponding `src/docs/openapi/paths/*`.
3. Add or adjust `schemas/*` and `responses/*`.
4. Verify changes in Swagger at `/docs`.
