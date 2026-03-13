# PROJECT_DOCUMENTATION

## 1. Project Overview

This repository is a modular backend for a hospital management SaaS platform built with TypeScript, Express, Prisma, and PostgreSQL. The codebase is organized around feature modules and a layered architecture so developers can extend business features without coupling routing, business rules, persistence, and cross-cutting infrastructure.

At runtime, the service:

- boots an Express HTTP server
- validates environment variables with Zod
- connects to Redis during startup
- serves REST APIs under `/api/v1`
- exposes Swagger UI under `/docs`
- uses Prisma for database access
- processes audit jobs with BullMQ workers

Current implemented modules:

- `health`
- `auth`
- `hospital`

Current active routes:

- `GET /`
- `GET /docs`
- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/hospitals`

Important current-state note: the repository already contains additional auth service files for login, logout, refresh token handling, caching, and token helpers, but only the register route is mounted today. The documentation below explains both the current runtime behavior and the intended module structure used by the project.

---

## 2. Request and Runtime Flow

### Application boot flow

```text
src/server.ts
  -> src/bootstrap/startServer.ts
  -> src/bootstrap/createApp.ts
  -> middleware + routes + error handlers
```

### HTTP request flow

```text
Client Request
  -> Express middleware
  -> Versioned route (/api/v1)
  -> Module route file
  -> Controller
  -> Application service
  -> Repository / Prisma
  -> PostgreSQL
  -> Standard response helper
```

### Background job flow

```text
Application/service
  -> BullMQ queue producer
  -> Redis
  -> Worker
  -> Prisma persistence
```

---

## 3. High-Level Folder Structure

```text
src/
  bootstrap/
    logger/
  config/
  docs/
    openapi/
      paths/
      responses/
      schemas/
  middlewares/
  modules/
    auth/
      application/
      domain/
      infrastructure/
      interfaces/
      tests/
    health/
      interfaces/
    hospital/
      application/
      domain/
      infrastructure/
      interfaces/
      tests/
      validation/
  routes/
  shared/
    errors/
      handlers/
    lib/
      data/
    middleware/
    queues/
    scripts/
    services/
    utils/
  tests/
    api/
  workers/
  app.ts
  server.ts

prisma/
  migrations/
  seeds/
  activityLog.prisma
  auditLog.prisma
  billing.prisma
  file.prisma
  hospital.prisma
  schema.prisma
  subscription.prisma
  user.prisma
  webhook.prisma
  seed.ts
```

---

## 4. Folder Responsibilities

This section is the primary onboarding reference. New developers should start here.

### `src/`

The application source root. It contains runtime code only: bootstrapping, modules, shared platform code, tests, and workers.

| Path | Responsibility |
| --- | --- |
| `src/server.ts` | Application entry point. Starts the server and handles fatal startup failures. |
| `src/app.ts` | Re-exports the app factory. Useful for tests or alternate entry points. |
| `src/routes/` | Version-level API composition. Mounts feature routers into `/api/v1`. |
| `src/bootstrap/` | Infrastructure bootstrap: app creation, server startup, logger, Redis, Prisma wiring. |
| `src/config/` | Typed runtime configuration derived from environment variables. |
| `src/middlewares/` | HTTP middleware shared across modules, such as validation, auth, rate limiting, not-found, and error handling. |
| `src/modules/` | Feature-based business code. Each module owns its routes, controllers, services, repositories, validation, and tests. |
| `src/shared/` | Reusable cross-module utilities and platform services. Shared code should remain domain-agnostic. |
| `src/docs/` | OpenAPI source files used by Swagger UI. |
| `src/tests/` | Shared test setup, test app bootstrapping, and cross-module integration helpers. |
| `src/workers/` | Background job consumers that run off Redis/BullMQ. |

### `src/bootstrap/`

This folder owns application startup and process-level infrastructure.

| File | Responsibility |
| --- | --- |
| `src/bootstrap/createApp.ts` | Builds the Express application, installs middleware, mounts Swagger UI, mounts `/api/v1`, and attaches 404/error handlers. |
| `src/bootstrap/startServer.ts` | Starts HTTP listening, connects Redis, logs startup metadata, and handles graceful shutdown signals. |
| `src/bootstrap/prisma.ts` | Creates and exports the shared Prisma client using the PostgreSQL adapter. Uses a global singleton in non-production environments. |
| `src/bootstrap/redis.ts` | Creates the Redis client for app-level connectivity and handles reconnect strategy plus initial connection. |
| `src/bootstrap/log.ts` | Logging helper entry point for runtime log access. |
| `src/bootstrap/logger/` | Encapsulates Pino logger creation, request logging, transports, and redaction behavior. |

### `src/bootstrap/logger/`

| File | Responsibility |
| --- | --- |
| `src/bootstrap/logger/index.ts` | Exposes application, error, and audit loggers plus the HTTP logger middleware. |
| `src/bootstrap/logger/createLogger.ts` | Central Pino factory. Applies redaction, metadata, and transport strategy. |
| `src/bootstrap/logger/httpLogger.ts` | Pino HTTP middleware integration for request/response logging. |
| `src/bootstrap/logger/requestLogger.ts` | Request-level log helpers. |
| `src/bootstrap/logger/transports.ts` | Configures pretty logging in development and file transports in production. |

### `src/config/`

Configuration is centralized here so the rest of the codebase imports typed values instead of using `process.env` directly.

| File | Responsibility |
| --- | --- |
| `src/config/env.config.ts` | Source of truth for runtime env validation. Uses Zod to fail fast on invalid or missing variables. |
| `src/config/app.config.ts` | Small app-level derived config, such as port, host, and production flag. |
| `src/config/cors.config.ts` | Parses allowed origins and returns Express CORS options. |
| `src/config/rate-limit.config.ts` | Centralizes window and request count values for rate limiting. |

### `src/middlewares/`

This folder contains request/response pipeline concerns shared by all routes.

| File | Responsibility |
| --- | --- |
| `src/middlewares/validateRequest.ts` | Generic Zod request validation wrapper. Validates `body`, `query`, and `params`. |
| `src/middlewares/auth.ts` | Authentication middleware entry point for JWT-protected routes. |
| `src/middlewares/authorize.ts` | Authorization middleware for permission or role-based access. |
| `src/middlewares/rateLimiter.ts` | Express rate-limiter configuration, currently skipping `/api/v1/health`. |
| `src/middlewares/httpLogger.ts` | Middleware-level request logging bridge. |
| `src/middlewares/notFound.ts` | Standard 404 handler for unmatched routes. |
| `src/middlewares/globalErrorHandler.ts` | Central error handler that normalizes Zod, Prisma, JWT, Multer, syntax, and custom app errors. |

### `src/modules/`

This is the most important business folder. Every domain feature should live here as an isolated vertical slice.

Standard module shape:

```text
module-name/
  application/
    service/
  domain/
  infrastructure/
  interfaces/
  validation/
  tests/
```

Layer meaning:

| Layer | Responsibility |
| --- | --- |
| `application` | Use cases and orchestration. Coordinates domain rules, repositories, queues, and transactions. |
| `domain` | Business constants, schema types, domain rules, and non-framework concepts. |
| `infrastructure` | Database access, external service adapters, cache adapters, token helpers, and implementation details. |
| `interfaces` | Express routes, controllers, presenters, DTO mapping, and request/response boundaries. |
| `validation` | Zod request schemas for API input contracts. |
| `tests` | Module-local tests. Prefer colocating feature-specific tests here. |

### `src/modules/auth/`

Auth is partially scaffolded and represents the intended module design for identity flows.

| Path | Responsibility |
| --- | --- |
| `src/modules/auth/interfaces/auth.route.ts` | Auth route definitions. Currently mounts `POST /register`. |
| `src/modules/auth/interfaces/auth.controller.ts` | Controllers for registration and future login/logout/refresh flows. |
| `src/modules/auth/interfaces/auth.presenter.ts` | Shapes auth service results into API-facing responses. |
| `src/modules/auth/application/service/` | Auth use cases such as `register`, `login`, `logout`, and `refreshToken`. |
| `src/modules/auth/domain/` | Auth constants, validation-related schemas, and types. |
| `src/modules/auth/infrastructure/auth.repository.ts` | Prisma access for user lookups and auth persistence. |
| `src/modules/auth/infrastructure/auth.token.ts` | JWT token generation/verification helpers. |
| `src/modules/auth/infrastructure/auth.cache.ts` | Redis-backed auth/cache coordination. |
| `src/modules/auth/tests/` | Service and worker-related auth tests. |

### `src/modules/health/`

The health module is intentionally small and demonstrates the thinnest valid module.

| File | Responsibility |
| --- | --- |
| `src/modules/health/interfaces/health.route.ts` | Mounts the health check endpoint. |
| `src/modules/health/interfaces/health.controller.ts` | Returns service status, uptime, and timestamp. |

### `src/modules/hospital/`

This is the clearest example of the intended layered architecture.

| Path | Responsibility |
| --- | --- |
| `src/modules/hospital/interfaces/hospital.routes.ts` | Defines hospital endpoints and attaches request validation middleware. |
| `src/modules/hospital/interfaces/hospital.controller.ts` | Accepts validated requests and delegates to the application service. |
| `src/modules/hospital/application/service/createHospita.service.ts` | Main hospital creation use case. Creates the hospital, admin user, and enabled features in one transaction. |
| `src/modules/hospital/infrastructure/hospital.repository.ts` | Encapsulates Prisma transaction operations for hospital-related persistence. |
| `src/modules/hospital/domain/hospital.constants.ts` | User-facing domain messages. |
| `src/modules/hospital/domain/hospital.schema.ts` | Domain schema support for hospital models. |
| `src/modules/hospital/validation/hospital.validation.ts` | Zod request schema and input typing for hospital creation. |
| `src/modules/hospital/tests/` | API and service tests covering the module. |

### `src/routes/`

| File | Responsibility |
| --- | --- |
| `src/routes/index.ts` | Top-level API composition. Mounts module routers under `/api/v1`. |

### `src/shared/`

Shared code must remain generic and reusable. If logic belongs only to one feature, keep it inside that module instead of moving it here.

| Path | Responsibility |
| --- | --- |
| `src/shared/errors/` | Custom `AppError` type plus specific error translators. |
| `src/shared/errors/handlers/` | Converts framework/runtime errors into standardized API responses. |
| `src/shared/utils/` | Helpers such as `catchAsync`, `sendResponse`, `sendError`, and `generateSlug`. |
| `src/shared/services/` | Cross-cutting services such as audit, activity, and Redis access. |
| `src/shared/queues/` | BullMQ connection and queue instances. |
| `src/shared/middleware/` | Generic middleware reused across features. |
| `src/shared/lib/data/` | Seed-like static business reference data such as roles, permissions, and feature definitions. |
| `src/shared/scripts/` | Developer automation scripts. Currently includes `create-module.ts`. |

### `src/docs/`

OpenAPI documentation source files live here. API documentation is not generated automatically from controllers, so route changes should be reflected here manually.

| Path | Responsibility |
| --- | --- |
| `src/docs/openapi.ts` | Public export for the OpenAPI document used by Swagger UI. |
| `src/docs/openapi/openapi.document.ts` | Root OpenAPI metadata, servers, tags, paths, and components. |
| `src/docs/openapi/openapi.registry.ts` | Aggregates path definitions. |
| `src/docs/openapi/openapi.register.ts` | Aggregates schemas and response definitions. |
| `src/docs/openapi/paths/` | Endpoint path definitions by feature. |
| `src/docs/openapi/schemas/` | Reusable request and response object schemas. |
| `src/docs/openapi/responses/` | Standard success and error response definitions. |

### `src/tests/`

| File | Responsibility |
| --- | --- |
| `src/tests/setup.ts` | Global test bootstrapping. |
| `src/tests/test-server.ts` | Test app/server creation. |
| `src/tests/supertest-client.ts` | Shared Supertest client helper. |
| `src/tests/prisma-test-db.ts` | Test database helpers for Prisma integration tests. |
| `src/tests/api/` | Shared API integration tests not owned by a single module. |

### `src/workers/`

| File | Responsibility |
| --- | --- |
| `src/workers/index.ts` | Worker bootstrap entry. Imported by the app during startup. |
| `src/workers/audit.worker.ts` | BullMQ consumer that persists audit log jobs into PostgreSQL. |

### `prisma/`

Database schema ownership lives here.

| Path | Responsibility |
| --- | --- |
| `prisma/schema.prisma` | Root Prisma configuration, generator, and datasource definition. |
| `prisma/*.prisma` | Split Prisma model files grouped by business domain. |
| `prisma/migrations/` | Generated SQL migrations applied to PostgreSQL. |
| `prisma/seeds/` | Seed logic for roles, permissions, hospitals, and default users. |
| `prisma/seed.ts` | Seed entry point used by Prisma config. |
| `prisma.config.ts` | Prisma CLI configuration, migrations path, and seed command. |

---

## 5. Technology Stack

| Category | Technology | Why it is used |
| --- | --- | --- |
| Runtime | Node.js 20+ | Stable LTS runtime for the API server and worker processes. |
| Web framework | Express 5 | Lightweight HTTP framework with predictable middleware composition. |
| Language | TypeScript | Type safety, better refactoring support, and safer module boundaries. |
| ORM | Prisma ORM | Type-safe database client, migrations, and transaction support. |
| Database | PostgreSQL | Relational database suited for multi-tenant SaaS business data. |
| Validation | Zod | Runtime validation plus static inference for request contracts and config parsing. |
| Auth | JWT | Stateless access token mechanism for authenticated APIs. |
| Cache / queue backend | Redis | Supports caching, queue infrastructure, and fast transient storage. |
| Background jobs | BullMQ | Durable job processing for audit and async workflows. |
| API docs | Swagger UI + OpenAPI | Human-readable interactive API documentation for backend and frontend teams. |
| Logging | Pino / pino-http | Structured logs with low overhead and request correlation support. |
| Security | Helmet, CORS, rate limiting, cookie parsing | Standard API hardening and browser/client interoperability. |
| Testing | Vitest + Supertest | Fast unit/integration test execution for services and HTTP endpoints. |
| Formatting | Prettier | Consistent formatting across the team. |
| Linting | ESLint + TypeScript ESLint | Enforces code quality, async correctness, and import order. |
| Containerization | Docker | Intended deployment/runtime packaging for consistent environments. No Dockerfile is currently committed in this repository. |
| File storage | AWS S3 | Intended object storage for file uploads. The package and file schema exist, but S3 integration code is not yet wired into the current runtime. |

---

## 6. Important Packages and Why They Are Used

### Runtime dependencies

| Package | Why it exists in this project |
| --- | --- |
| `express` | Core HTTP framework and middleware pipeline. |
| `@prisma/client` | Generated database client used inside repositories and services. |
| `@prisma/adapter-pg` | Connects Prisma to PostgreSQL using the driver adapter approach. |
| `pg` | PostgreSQL driver required by Prisma's adapter. |
| `zod` | Validates env vars and API requests. |
| `jsonwebtoken` | Signs and verifies JWT access/refresh tokens. |
| `bcrypt` | Password hashing for user credentials. |
| `redis` | Main Redis client used during application startup. |
| `ioredis` | Redis client used by BullMQ queue and worker connection handling. |
| `bullmq` | Background jobs, retries, and worker execution. |
| `@aws-sdk/client-s3` | Planned S3 file storage integration. Useful for uploads and signed URL workflows. |
| `multer` | Multipart/form-data parsing for future file upload endpoints. |
| `pino` | Structured application logging. |
| `pino-http` | Express request logging middleware. |
| `helmet` | Security headers for API hardening. |
| `cors` | Browser cross-origin policy configuration. |
| `cookie-parser` | Reads cookies for refresh token or session-oriented flows. |
| `compression` | Compresses HTTP responses for bandwidth savings. |
| `express-rate-limit` | Protects public endpoints from abuse. |
| `swagger-ui-express` | Serves generated OpenAPI docs at `/docs`. |
| `axios` | Outbound HTTP client for third-party APIs or internal service calls. |
| `@opentelemetry/api` | Telemetry abstraction for tracing and metrics. |
| `@opentelemetry/sdk-node` | Node SDK for telemetry pipeline setup. |
| `@opentelemetry/auto-instrumentations-node` | Planned auto-instrumentation for observability. |

### Development dependencies

| Package | Why it exists in this project |
| --- | --- |
| `typescript` | TypeScript compiler. |
| `ts-node-dev` | Fast TypeScript development server with respawn/reload support. |
| `tsx` | Executes TypeScript scripts directly, used for internal tooling like module scaffolding. |
| `tsconfig-paths` | Resolves `@/` path aliases in runtime tooling. |
| `tsc-alias` | Rewrites TypeScript path aliases after build output generation. |
| `prisma` | Prisma CLI for generate, migrate, format, validate, studio, and seed flows. |
| `vitest` | Test runner. |
| `supertest` | HTTP endpoint testing against the Express app. |
| `eslint` | Static code analysis. |
| `@typescript-eslint/*` | Type-aware TypeScript lint rules. |
| `eslint-plugin-import` | Import ordering and import quality checks. |
| `eslint-config-prettier` | Disables lint rules that conflict with Prettier. |
| `prettier` | Code formatting. |
| `husky` | Git hooks for enforcing checks before commits. |
| `dotenv` | Loads environment variables for scripts and runtime entry points. |

---

## 7. Environment Variables

The source of truth is `src/config/env.config.ts`. New developers should not rely only on `.env.example`, because the example file is currently missing some values required by the Zod schema.

### Required and supported variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `NODE_ENV` | Yes | `development` | Controls runtime mode and logging behavior. |
| `PORT` | Yes | `4000` | HTTP port for the API server. |
| `HOST` | Yes | `0.0.0.0` | Network host binding. |
| `CORS_ENABLED` | Yes in current schema | `true` | Intended feature flag for CORS behavior. Note: current `cors.config.ts` does not branch on it yet. |
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/hospital_management?schema=public` | PostgreSQL connection string for Prisma. |
| `CORS_ORIGINS` | Yes | `*` or `http://localhost:3000,http://localhost:5173` | Allowed client origins. |
| `TRUST_PROXY` | Yes | `false` | Enables proxy-aware request handling in Express when behind a load balancer. |
| `RATE_LIMIT_WINDOW_MS` | Yes | `60000` | Rate limit window size. |
| `RATE_LIMIT_MAX_REQUESTS` | Yes | `120` | Max requests per rate limit window. |
| `JWT_ACCESS_SECRET` | Yes | `dev-access-secret-change-me` | Secret used to sign access tokens. Must be strong in production. |
| `JWT_EXPIRES_IN` | Yes | `15m` | Access token TTL. |
| `REDIS_URL` | Yes | `redis://127.0.0.1:6379` | General Redis URL. |
| `REDIS_HOST` | Yes | `127.0.0.1` | Redis host for queue/client configuration. |
| `REDIS_PORT` | Yes | `6379` | Redis port. |
| `REDIS_PASSWORD` | Optional | `` | Redis password if secured. |

### Recommended local `.env`

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
CORS_ENABLED=true
CORS_ORIGINS=*
TRUST_PROXY=false
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospital_management?schema=public
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
JWT_ACCESS_SECRET=dev-access-secret-change-me
JWT_EXPIRES_IN=15m
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

---

## 8. Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Starts the API in development mode with `ts-node-dev`. |
| `npm run build` | Compiles TypeScript and rewrites path aliases for `dist/`. |
| `npm start` | Runs the compiled build from `dist/server.js`. |
| `npm run typecheck` | Runs TypeScript type-checking without emitting build files. |
| `npm run lint` | Runs ESLint and fails on warnings. |
| `npm run lint:fix` | Runs ESLint with autofix. |
| `npm run format` | Formats the repository with Prettier. |
| `npm run format:check` | Checks formatting without modifying files. |
| `npm run create:module -- <name>` | Generates a new module skeleton under `src/modules/<name>`. |
| `npm run prisma:generate` | Generates the Prisma client. |
| `npm run prisma:reset` | Drops and recreates the database using Prisma migrate reset. |
| `npm run prisma:format` | Formats Prisma schema files. |
| `npm run prisma:validate` | Validates Prisma schema configuration. |
| `npm run prisma:migrate:dev` | Creates and applies development migrations. |
| `npm run prisma:migrate:deploy` | Applies migrations in deployment environments. |
| `npm run prisma:studio` | Opens Prisma Studio. |
| `npm run test` | Runs the test suite once. |
| `npm run test:watch` | Runs tests in watch mode. |
| `npm run test:coverage` | Runs tests with coverage output. |
| `npm run test:auth` | Runs auth-focused tests only. |
| `npm run prepare` | Installs Husky hooks. |

---

## 9. Coding Conventions

This project already enforces several conventions through TypeScript, ESLint, and Prettier. New code should follow the same rules.

### TypeScript conventions

- Use strict typing; `tsconfig.json` enables strict mode and additional safety flags.
- Prefer explicit DTO/input types inferred from Zod schemas for request payloads.
- Keep framework-specific types in `interfaces` and business logic in `application` or `domain`.
- Use the `@/` path alias instead of deep relative imports where practical.

### File naming conventions

- Use feature-oriented folders under `src/modules`.
- Use suffixes that describe responsibility:
  - `*.route.ts`
  - `*.controller.ts`
  - `*.service.ts`
  - `*.repository.ts`
  - `*.validation.ts`
  - `*.schema.ts`
  - `*.constants.ts`
- Keep related files together inside the owning module.

### Linting conventions

Based on `eslint.config.mjs`:

- import order is enforced
- floating promises are not allowed
- unused vars fail the build unless prefixed with `_`
- `require-await` is enforced
- `any` is discouraged
- console usage is allowed only as a warning and should be avoided in committed production code

### Formatting conventions

- Prettier is the formatting source of truth.
- Keep imports grouped and alphabetized according to ESLint.
- Prefer small controllers and thin route files.

### Architectural conventions

- Controllers should not contain database logic.
- Repositories should not format HTTP responses.
- Shared code should remain generic and not leak feature-specific rules.
- Validation should happen before controller logic using middleware where possible.
- Transactions should be orchestrated in the application service layer for multi-step business flows.

---

## 10. API Architecture

The API is designed as a versioned REST service.

### Versioning

- Base prefix: `/api/v1`
- Swagger docs: `/docs`

### Current route composition

`src/routes/index.ts` mounts:

- `healthRouter` on `/health`
- `authRoutes` on `/auth`
- `hospitalRoutes` on `/hospitals`

### API design pattern

Each endpoint should follow this structure:

1. Route file receives HTTP request and applies middleware.
2. Validation middleware checks `body`, `query`, and `params`.
3. Controller extracts typed input and delegates to a use case.
4. Application service runs the business workflow.
5. Repository handles Prisma and persistence details.
6. Response helpers format the output consistently.

### Response pattern

The project uses shared response helpers, typically returning:

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": {}
}
```

Errors are normalized through the global error handler into a consistent error shape.

### Middleware stack

The app currently installs:

- request logging
- security headers via Helmet
- CORS
- rate limiting
- compression
- cookie parsing
- JSON and URL-encoded body parsing
- not-found handling
- global error handling

---

## 11. Module Architecture

The module design follows a light clean-architecture style adapted for Express.

### Recommended dependency direction

```text
interfaces -> application -> infrastructure
           -> domain

shared is reusable by all layers
```

### Responsibility by layer

#### `interfaces`

Owns transport concerns.

- Express routes
- controllers
- presenters
- request/response mapping
- middleware composition

#### `application`

Owns use-case execution.

- business workflow orchestration
- transaction boundaries
- coordination between repositories, queues, cache, and external systems

#### `domain`

Owns business meaning.

- constants
- domain types
- domain schema support
- business language

#### `infrastructure`

Owns implementation details.

- Prisma queries
- Redis interactions
- token generation
- third-party adapters
- storage integrations

#### `validation`

Owns API contracts.

- Zod schemas
- request DTO validation
- typed input inference

### Why this architecture works well for SaaS backends

- keeps feature code together
- avoids a giant shared service layer
- makes onboarding faster because each feature has a predictable shape
- improves testability by separating orchestration from transport and persistence
- supports future tenant-aware business rules without polluting global folders

---

## 12. File Responsibilities by Execution Path

This section helps new developers trace a change from endpoint to database.

### Example: create hospital flow

| Step | File | Responsibility |
| --- | --- | --- |
| 1 | `src/routes/index.ts` | Mounts hospital routes under `/api/v1/hospitals`. |
| 2 | `src/modules/hospital/interfaces/hospital.routes.ts` | Declares `POST /` and applies request validation. |
| 3 | `src/middlewares/validateRequest.ts` | Validates incoming payload using Zod. |
| 4 | `src/modules/hospital/interfaces/hospital.controller.ts` | Converts Express request into typed service call. |
| 5 | `src/modules/hospital/application/service/createHospita.service.ts` | Runs transactional business logic for hospital setup. |
| 6 | `src/modules/hospital/infrastructure/hospital.repository.ts` | Executes Prisma transaction operations. |
| 7 | `src/bootstrap/prisma.ts` | Provides the shared Prisma client. |
| 8 | `src/shared/utils/sendResponse.ts` | Formats the success response. |

### Example: audit processing flow

| Step | File | Responsibility |
| --- | --- | --- |
| 1 | `src/shared/queues/audit.queue.ts` | Creates the BullMQ queue used for audit events. |
| 2 | `src/workers/index.ts` | Ensures workers are registered during app startup. |
| 3 | `src/workers/audit.worker.ts` | Consumes jobs from Redis. |
| 4 | `src/bootstrap/prisma.ts` | Persists audit data into PostgreSQL through Prisma. |

---

## 13. How to Add a New Module

### Option 1: use the scaffold script

```bash
npm run create:module -- billing
```

This creates:

```text
src/modules/billing/
  application/service/
  domain/
  infrastructure/
  interfaces/
  validation/
```

### Recommended steps after scaffolding

1. Create or refine the Zod request schema in `validation/`.
2. Add domain constants, types, and rules in `domain/`.
3. Implement one or more use cases in `application/service/`.
4. Implement repository or adapter code in `infrastructure/`.
5. Add Express route/controller files in `interfaces/`.
6. Mount the router from `src/routes/index.ts`.
7. Add or update OpenAPI files in `src/docs/openapi/`.
8. Add tests in `src/modules/<module>/tests/`.

### Practical guidance

- Keep the module self-contained.
- Do not move feature-specific helpers into `src/shared/` too early.
- If the module touches multiple tables, keep the transaction boundary in the application layer.

---

## 14. How to Add a New API

Use this sequence for a new endpoint inside an existing module.

1. Define the request schema in the module's `validation/` folder.
2. Add or update any domain types/constants if needed.
3. Implement the use case in `application/service/`.
4. Add persistence logic in `infrastructure/`.
5. Expose a controller in `interfaces/`.
6. Register the route in the module's route file.
7. Update OpenAPI docs under `src/docs/openapi/paths` and `src/docs/openapi/schemas`.
8. Add API and service tests.

### Example template

```text
validation/create-x.validation.ts
application/service/createX.service.ts
infrastructure/x.repository.ts
interfaces/x.controller.ts
interfaces/x.route.ts
```

### Controller rule of thumb

Controllers should do only three things:

- read validated input
- call the application service
- return a standardized response

If a controller starts owning branching business rules or Prisma calls, move that logic down a layer.

---

## 15. How to Run the Project Locally

### Prerequisites

- Node.js `>= 20.11.0`
- PostgreSQL running locally or remotely
- Redis running locally or remotely
- npm installed

### Local setup

1. Install dependencies.

```bash
npm install
```

2. Create a local `.env` file using the variables documented above.

3. Generate Prisma client.

```bash
npm run prisma:generate
```

4. Apply migrations.

```bash
npm run prisma:migrate:dev
```

5. Optionally seed the database.

```bash
npx prisma db seed
```

6. Make sure Redis is available.

7. Start the development server.

```bash
npm run dev
```

8. Open:

- API base: `http://localhost:4000/api/v1`
- Swagger docs: `http://localhost:4000/docs`

### Production-style local run

```bash
npm run build
npm start
```

---

## 16. Development Workflow

Recommended day-to-day workflow for backend developers:

1. Pull the latest changes.
2. Install dependencies if `package-lock.json` changed.
3. Sync `.env` values with `src/config/env.config.ts`.
4. Run migrations if Prisma schema changed.
5. Implement feature changes inside the owning module.
6. Update OpenAPI docs when endpoint contracts change.
7. Run `npm run typecheck`.
8. Run `npm run lint`.
9. Run targeted tests, then full tests when needed.
10. Format before commit.

### When changing database models

1. Update Prisma model files under `prisma/`.
2. Run `npm run prisma:format`.
3. Run `npm run prisma:generate`.
4. Run `npm run prisma:migrate:dev`.
5. Update repositories, services, seeds, and tests.

### When changing API contracts

1. Update Zod schema.
2. Update controller/service types.
3. Update OpenAPI schemas and path definitions.
4. Update API tests.

---

## 17. Deployment Notes

### Build and runtime expectations

- The production process runs from `dist/`.
- Environment variables must be provided externally.
- PostgreSQL and Redis must be reachable at startup.
- The server currently attempts Redis connection during boot, so Redis unavailability can block startup.

### Database deployment

- Use `npm run prisma:migrate:deploy` in deployed environments.
- Avoid `prisma:migrate:dev` outside development.
- Run `prisma generate` as part of the build pipeline if needed by the environment.

### Logging

- Pino pretty logs are used in development.
- File transport is used in production logger setup.
- Sensitive fields such as passwords and tokens are redacted.

### Reverse proxy / load balancer

- Set `TRUST_PROXY=true` or `1` when running behind Nginx, a cloud load balancer, or a container ingress proxy.
- Review rate limiting and IP handling when proxying traffic.

### Docker

- Docker is part of the intended deployment stack, but there is no committed `Dockerfile` or Compose file in the current repository.
- If you containerize this service, include API, PostgreSQL, and Redis coordination and pass env vars through the container runtime.

### File storage

- S3 support is planned and the repository already includes `@aws-sdk/client-s3` plus a Prisma file model.
- No active upload/storage service is mounted yet, so deployment should treat S3 as future infrastructure unless that integration is added.

### Workers

- Audit processing uses BullMQ and Redis.
- In a larger deployment, run workers as a separate process instead of importing them into the web app process.

---

## 18. Best Practices

- Keep each feature inside its module unless the code is truly shared.
- Keep controllers thin and deterministic.
- Validate requests with Zod before business logic executes.
- Use transactions for multi-step business workflows that must succeed or fail together.
- Keep Prisma queries inside repositories or infrastructure adapters.
- Use `AppError` or typed error handlers instead of throwing raw strings.
- Update Swagger docs whenever routes, payloads, or responses change.
- Add tests next to the module being changed.
- Prefer explicit naming over clever abstractions.
- Avoid leaking infrastructure concerns into `domain` files.
- Do not access `process.env` outside `src/config/env.config.ts`.
- Redact secrets and tokens from logs.

---

## 19. Suggested Onboarding Path for New Developers

Read these files in order:

1. `README.md`
2. `src/server.ts`
3. `src/bootstrap/startServer.ts`
4. `src/bootstrap/createApp.ts`
5. `src/routes/index.ts`
6. `src/modules/hospital/interfaces/hospital.routes.ts`
7. `src/modules/hospital/interfaces/hospital.controller.ts`
8. `src/modules/hospital/application/service/createHospita.service.ts`
9. `src/modules/hospital/infrastructure/hospital.repository.ts`
10. `src/config/env.config.ts`

This sequence gives the fastest path to understanding how a request enters the system, moves through the module layers, and reaches the database.
