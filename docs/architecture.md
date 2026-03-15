# Architecture Guide

## Stack

- Express 5 + TypeScript
- Prisma + PostgreSQL
- Redis + BullMQ
- Zod validation
- Pino logging
- Vitest testing

## High-Level Structure

```text
src/
  bootstrap/      # app/server/bootstrap wiring
  config/         # env and runtime config
  docs/           # OpenAPI source files
  middlewares/    # auth, rate limit, error, request context
  modules/        # domain modules (auth, role, tenant, ...)
  routes/         # API route mounting
  shared/         # shared libs, errors, services, queues, utils
  tests/          # test helpers and API tests
  workers/        # background worker entrypoints
prisma/
  migrations/
  seeds/
  schema.prisma
  *.prisma
```

## Request Flow

1. `createApp()` sets middleware (logging, security, CORS, rate limit, parsers, context).
2. API routes are mounted under `/api/v1`.
3. Auth routes mount first (`/auth`), then the global `auth` middleware protects subsequent route groups.
4. The current mounted protected groups are `/roles` and `/tenants`.
4. Errors are handled by `notFound` and `globalErrorHandler`.

## Module Pattern

Most modules follow layered folders:

- `domain/`: constants, schemas, types
- `application/service/`: use-case logic
- `infrastructure/`: repository/token/cache implementations
- `interfaces/`: route/controller adapters
- `validation/`: request validation schemas
