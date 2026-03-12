# Project Documentation

## 1. Project Overview

This repository is a TypeScript-based Express backend for a hospital management SaaS platform. It follows a modular architecture with clear separation between HTTP interfaces, application logic, domain definitions, and infrastructure concerns.

The backend is designed for:

- Multi-tenant hospital operations
- Authentication and authorization
- Structured validation and error handling
- PostgreSQL persistence through Prisma
- Redis-backed background processing and caching patterns
- API documentation through OpenAPI and Swagger UI

This project already contains the base backend skeleton, the `hospital`, `auth`, and `health` modules, Prisma migrations, test scaffolding, and BullMQ worker integration. Some platform concerns mentioned in the wider system design, such as AWS S3 storage and Docker deployment, are not yet implemented in the current repository and should be treated as planned or external infrastructure concerns.

## 2. High-Level Architecture

At runtime, the request flow is:

`server.ts` -> `bootstrap/startServer.ts` -> `bootstrap/createApp.ts` -> global middleware -> `/api/v1` router -> module routes -> controllers -> services -> repositories -> Prisma/PostgreSQL

The non-request flow for background jobs is:

application/service -> queue publisher -> BullMQ worker -> Prisma -> database

## 3. Folder Structure

The project is strongly organized around responsibilities. New developers should understand this layout first before changing business logic.

```text
src/
├── bootstrap/
├── config/
├── docs/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── health/
│   └── hospital/
├── routes/
├── shared/
├── tests/
├── workers/
├── app.ts
└── server.ts

prisma/
├── migrations/
├── seeds/
├── schema.prisma
├── *.prisma
└── seed.ts
```

### Folder Responsibilities

| Folder | Purpose | Typical Contents |
|---|---|---|
| `src/bootstrap` | Runtime startup and core infrastructure bootstrapping | Express app creation, Prisma client, Redis connection, logger, server lifecycle |
| `src/config` | Environment parsing and runtime configuration | env validation, CORS config, app config, rate-limit config |
| `src/docs` | OpenAPI and Swagger documentation source files | schemas, path definitions, shared API responses |
| `src/middlewares` | Cross-cutting HTTP middleware | auth, request validation, rate limiting, not found, global error handling |
| `src/modules` | Feature modules using a vertical slice structure | `auth`, `health`, `hospital` |
| `src/routes` | API route composition at application level | `/api/v1` root router |
| `src/shared` | Reusable cross-module code | errors, queues, services, utility functions, reference data, scripts |
| `src/tests` | Cross-module and integration test helpers | test server setup, supertest client, test DB support |
| `src/workers` | Background job processors | BullMQ worker implementations |
| `prisma` | Database schema, migrations, and seed data | schema fragments, migration SQL, seed scripts |

## 4. Detailed Folder and File Responsibilities

This section is the main onboarding reference for understanding what each file is supposed to own.

### `src/bootstrap`

| File | Responsibility |
|---|---|
| `src/bootstrap/createApp.ts` | Creates and configures the Express application, attaches global middleware, mounts Swagger UI, registers API routes, and installs fallback error handlers |
| `src/bootstrap/startServer.ts` | Starts the HTTP server, connects infrastructure such as Redis, and handles graceful shutdown |
| `src/bootstrap/prisma.ts` | Creates and exports the shared Prisma client instance using the PostgreSQL adapter |
| `src/bootstrap/redis.ts` | Creates the Redis client, configures reconnection strategy, and exposes connection bootstrap logic |
| `src/bootstrap/logger.ts` | Central logging setup for application and HTTP logging |

### `src/config`

| File | Responsibility |
|---|---|
| `src/config/env.config.ts` | Validates environment variables with Zod and exposes typed configuration |
| `src/config/app.config.ts` | Derives app-level settings such as host, port, trust proxy, production mode |
| `src/config/cors.config.ts` | Builds allowed-origin behavior for Express CORS middleware |
| `src/config/rate-limit.config.ts` | Centralizes rate limiter settings |

### `src/docs`

| File or Folder | Responsibility |
|---|---|
| `src/docs/openapi.ts` | Public export for the generated OpenAPI document |
| `src/docs/openapi/openapi.document.ts` | Root OpenAPI object: metadata, servers, tags, paths, and components |
| `src/docs/openapi/openapi.register.ts` | Aggregates schema and shared response definitions |
| `src/docs/openapi/openapi.registry.ts` | Aggregates path definitions from all modules |
| `src/docs/openapi/schemas` | Request and response body schemas used in the docs |
| `src/docs/openapi/paths` | Endpoint documentation for each module |
| `src/docs/openapi/responses` | Shared success and error response shapes |

### `src/middlewares`

| File | Responsibility |
|---|---|
| `src/middlewares/validateRequest.ts` | Runs Zod request validation against `body`, `params`, and `query` |
| `src/middlewares/globalErrorHandler.ts` | Converts thrown errors into consistent API responses |
| `src/middlewares/notFound.ts` | Handles unmatched routes |
| `src/middlewares/rateLimiter.ts` | Applies request throttling to the app |
| `src/middlewares/auth.ts` | Authentication middleware for protected endpoints |
| `src/middlewares/authorize.ts` | Authorization middleware for role/permission checks |

### `src/modules`

Each module should contain only the logic for one bounded business area. The preferred structure is:

```text
module/
├── application/
├── domain/
├── infrastructure/
├── interfaces/
├── validation/   # optional if separate from domain schemas
└── tests/        # optional
```

#### `src/modules/auth`

| File or Folder | Responsibility |
|---|---|
| `application/service/*` | Authentication use cases such as register, login, logout, token refresh |
| `domain/auth.constants.ts` | Auth-specific messages and domain constants |
| `domain/auth.schema.ts` | Zod validation and domain input contracts for auth |
| `domain/auth.types.ts` | Shared auth-related TypeScript types |
| `infrastructure/auth.repository.ts` | Database persistence for auth workflows |
| `infrastructure/auth.token.ts` | JWT token creation and verification concerns |
| `infrastructure/auth.cache.ts` | Cache or token/session persistence concerns |
| `interfaces/auth.route.ts` | Express route definitions for the auth module |
| `interfaces/auth.controller.ts` | HTTP controllers that map requests to application services |
| `interfaces/auth.presenter.ts` | Shapes auth responses before returning them to clients |
| `tests/*` | Auth-focused tests |

#### `src/modules/health`

| File or Folder | Responsibility |
|---|---|
| `interfaces/health.route.ts` | Health check routes |
| `interfaces/health.controller.ts` | Health check response logic |

#### `src/modules/hospital`

| File or Folder | Responsibility |
|---|---|
| `application/service/createHospital.service.ts` | Creates the hospital use case orchestration |
| `domain/hospital.constants.ts` | Hospital-specific messages and constants |
| `domain/hospital.schema.ts` | Domain shape definitions related to hospital entities |
| `infrastructure/hospital.repository.ts` | Prisma persistence logic for hospitals and related transactional work |
| `interfaces/hospital.routes.ts` | HTTP routes for hospital endpoints |
| `interfaces/hospital.controller.ts` | Request-to-service mapping and response shaping |
| `validation/hospital.validation.ts` | Request schema validation for hospital APIs |
| `tests/api/*` | API-level tests for hospital routes |
| `tests/services/*` | Unit or service-level tests for hospital business logic |

### `src/routes`

| File | Responsibility |
|---|---|
| `src/routes/index.ts` | Registers feature routers under `/api/v1` and defines top-level route grouping |

### `src/shared`

`shared` is for code reused by multiple modules. It should not become a dumping ground for feature logic.

| Folder | Responsibility |
|---|---|
| `src/shared/errors` | Shared application error classes |
| `src/shared/lib/data` | Seed-like static reference data such as permissions, roles, and hospital features |
| `src/shared/middleware` | Shared middleware that is not module-specific |
| `src/shared/queues` | Queue connection and queue publishers |
| `src/shared/scripts` | Developer automation scripts such as module scaffolding |
| `src/shared/services` | Cross-cutting services like activity tracking, audit logging, Redis wrappers |
| `src/shared/utils` | Small pure helpers such as `catchAsync`, `sendResponse`, `generateSlug` |

Important shared files:

| File | Responsibility |
|---|---|
| `src/shared/errors/AppError.ts` | Standard custom error type for controlled failures |
| `src/shared/utils/catchAsync.ts` | Async controller wrapper to forward errors |
| `src/shared/utils/sendResponse.ts` | Standard success response helper |
| `src/shared/utils/sendError.ts` | Standard error response helper |
| `src/shared/utils/generateSlug.ts` | Slug generation helper |
| `src/shared/queues/connection.ts` | Shared BullMQ Redis connection |
| `src/shared/queues/audit.queue.ts` | Audit queue producer |
| `src/shared/services/audit.service.ts` | High-level audit logging service |
| `src/shared/services/activity.service.ts` | Activity tracking logic |
| `src/shared/services/redis.service.ts` | Redis-related shared service layer |
| `src/shared/scripts/create-module.ts` | Developer script for bootstrapping a new module |

### `src/tests`

| File | Responsibility |
|---|---|
| `src/tests/setup.ts` | Global test setup |
| `src/tests/test-server.ts` | Test app/server bootstrap |
| `src/tests/supertest-client.ts` | Shared Supertest client creation |
| `src/tests/prisma-test-db.ts` | Test database support for Prisma-backed tests |
| `src/tests/api/*.test.ts` | Cross-cutting API tests |

### `src/workers`

| File | Responsibility |
|---|---|
| `src/workers/index.ts` | Worker bootstrap entry point |
| `src/workers/audit.worker.ts` | BullMQ worker for async audit log persistence |

### `prisma`

The Prisma directory is split into multiple schema fragments, which is a good approach for a growing SaaS codebase.

| File or Folder | Responsibility |
|---|---|
| `prisma/schema.prisma` | Prisma root configuration such as generator and datasource |
| `prisma/*.prisma` | Domain-specific model files split by concern such as hospital, user, file, billing, subscription, webhook, audit log |
| `prisma/migrations` | Versioned SQL migrations |
| `prisma/seed.ts` | Main seed runner |
| `prisma/seeds/*.ts` | Seed units for roles, permissions, hospitals, users |
| `prisma.config.ts` | Prisma CLI config, schema path, migration path, seed command, datasource env mapping |

## 5. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js | JavaScript runtime for the backend |
| Server | Express.js | HTTP server, middleware composition, routing |
| Language | TypeScript | Static typing and better maintainability |
| ORM | Prisma ORM | Database access, transactions, migrations, type-safe queries |
| Database | PostgreSQL | Primary relational datastore |
| Validation | Zod | Runtime validation for env config and request data |
| Auth | JWT | Stateless access token strategy |
| Cache / Queue Transport | Redis | Shared infrastructure for caching, workers, queue transport |
| Background Jobs | BullMQ | Queue-based async job processing |
| API Docs | Swagger UI + OpenAPI | Human-readable API documentation |
| Testing | Vitest + Supertest | Unit, service, and API testing |
| Linting | ESLint | Static analysis and consistency checks |
| Formatting | Prettier | Code formatting |

### Planned or External Technologies

| Technology | Status in Current Repository | Notes |
|---|---|---|
| AWS S3 | Not implemented yet | Suitable for document, image, or asset storage; add as an infrastructure service and storage adapter when file upload flows are introduced |
| Docker | Not implemented yet | No `Dockerfile` or `docker-compose.yml` is currently present; deployment teams should add container definitions if containerized delivery is required |

## 6. Important Packages and Why They Are Used

This section is intentionally explicit, because package purpose is a major onboarding shortcut.

| Package | Why It Exists |
|---|---|
| `express` | Core HTTP framework for routing, middleware, and request/response handling |
| `typescript` | Compile-time safety, editor support, better refactoring confidence |
| `ts-node-dev` | Fast local development with automatic reload for TypeScript files |
| `tsx` | Simple TypeScript execution for scripts and seeds |
| `@prisma/client` | Generated Prisma client used by repositories and services |
| `prisma` | Migration, introspection, formatting, and seed tooling |
| `@prisma/adapter-pg` | PostgreSQL adapter for Prisma runtime |
| `pg` | PostgreSQL driver used under Prisma’s adapter |
| `zod` | Runtime validation for requests and environment variables |
| `jsonwebtoken` | JWT issuing and verification for auth flows |
| `bcrypt` | Password hashing for secure credential storage |
| `redis` | Redis client for cache/session/infra connectivity |
| `ioredis` | Often used for BullMQ-compatible Redis connections and advanced Redis flows |
| `bullmq` | Reliable background jobs and async processing |
| `swagger-ui-express` | Serves interactive API documentation |
| `cors` | Browser cross-origin control |
| `helmet` | Basic security headers for Express |
| `compression` | Gzip compression for HTTP responses |
| `cookie-parser` | Cookie parsing, useful for refresh-token strategies |
| `express-rate-limit` | Request throttling to reduce abuse and protect APIs |
| `pino` | Structured logging |
| `pino-http` | HTTP request logging integration for Express |
| `vitest` | Test runner for unit and integration tests |
| `supertest` | HTTP assertions for Express endpoints |
| `eslint` | Code quality and rule enforcement |
| `@typescript-eslint/*` | TypeScript-aware linting rules |
| `eslint-plugin-import` | Import order and import hygiene |
| `prettier` | Consistent formatting across contributors |
| `dotenv` | Loads environment variables in local execution |
| `husky` | Git hook automation before commits or pushes |
| `tsconfig-paths` | Makes TypeScript path aliases work during runtime in dev tools |
| `tsc-alias` | Rewrites TypeScript path aliases after build output |

## 7. Environment Variables

Environment variables are parsed and validated in `src/config/env.config.ts` with Zod. This is the single source of truth for config shape.

### Current Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NODE_ENV` | No | `development` | Runtime environment |
| `PORT` | No | `4000` | HTTP server port |
| `HOST` | No | `0.0.0.0` | Bind host |
| `DATABASE_URL` | Yes | none | PostgreSQL connection string |
| `CORS_ENABLED` | Yes in current validation | none | Enables or disables CORS behavior |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins |
| `TRUST_PROXY` | No | `false` | Enables proxy awareness for load balancers / reverse proxies |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate limiter time window |
| `RATE_LIMIT_MAX_REQUESTS` | No | `120` | Maximum requests allowed per window |
| `JWT_ACCESS_SECRET` | No | `dev-access-secret-change-me` | Secret for access token signing |
| `JWT_EXPIRES_IN` | No | `15m` | Access token TTL |
| `REDIS_URL` | No | `redis://127.0.0.1:6379` | Full Redis URL |
| `REDIS_HOST` | No | `127.0.0.1` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | none | Redis password |

### Important Note

The current `.env.example` does not include `CORS_ENABLED`, while `src/config/env.config.ts` expects it. A new developer should add this variable locally or the application will fail env validation.

Recommended local addition:

```env
CORS_ENABLED=true
```

### Suggested Future Variables

If AWS S3 and Dockerized deployment are introduced, these are common additions:

| Variable | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION` | S3 bucket region |
| `AWS_S3_BUCKET` | Upload bucket |
| `JWT_REFRESH_SECRET` | Refresh token signing |
| `APP_BASE_URL` | Absolute backend/public URL |

## 8. Available Scripts

Scripts are defined in `package.json`.

| Script | What It Does |
|---|---|
| `npm run dev` | Starts the backend in development using `ts-node-dev` |
| `npm run build` | Compiles TypeScript to `dist` and rewrites path aliases |
| `npm start` | Runs the built app from `dist/server.js` |
| `npm run typecheck` | Runs TypeScript type-checking without emitting files |
| `npm run lint` | Runs ESLint with zero warnings allowed |
| `npm run lint:fix` | Runs ESLint and applies safe fixes |
| `npm run format` | Formats the project with Prettier |
| `npm run format:check` | Checks formatting without writing changes |
| `npm run create:module` | Runs the internal module scaffolding script |
| `npm run prisma:generate` | Generates Prisma client |
| `npm run prisma:reset` | Resets database and reruns migrations |
| `npm run prisma:format` | Formats Prisma schema files |
| `npm run prisma:validate` | Validates Prisma schema setup |
| `npm run prisma:migrate:dev` | Creates and applies development migrations |
| `npm run prisma:migrate:deploy` | Applies migrations in deployment environments |
| `npm run prisma:studio` | Opens Prisma Studio |
| `npm test` | Runs the full test suite once |
| `npm run test:watch` | Runs tests in watch mode |
| `npm run test:coverage` | Runs tests with coverage |
| `npm run test:auth` | Runs only auth tests |

## 9. Coding Conventions

The codebase already communicates several conventions through ESLint, TypeScript config, and current structure.

### General Conventions

- Use strict TypeScript mode and avoid `any` unless there is a real integration constraint.
- Use the `@/` alias for imports from `src`.
- Keep controllers thin.
- Put business logic in application services.
- Put database logic in repositories.
- Keep module boundaries clear.
- Prefer explicit named exports unless a single use case file benefits from a default export.
- Use shared response helpers instead of hand-building JSON in every controller.
- Throw controlled `AppError` instances for business-rule failures.

### Import Style

ESLint enforces ordered imports with grouped sections:

1. Built-in modules
2. External packages
3. Internal modules via `@/`
4. Parent/sibling/index imports
5. Type imports

### Validation Convention

- Validate environment variables in `src/config/env.config.ts`
- Validate request payloads through middleware using Zod
- Use `validateRequest(schema)` in routes before calling controllers

### Error Handling Convention

- Wrap async controllers with `catchAsync`
- Let the global error handler translate thrown errors
- Avoid repetitive `try/catch` blocks in controllers unless there is a real transformation need

### Testing Convention

- Place module-local tests under `src/modules/<module>/tests`
- Place shared integration helpers under `src/tests`
- Prefer API tests for request/response contracts
- Prefer service tests for business logic

## 10. API Architecture

The API is versioned under `/api/v1`.

### Route Composition

- `src/bootstrap/createApp.ts` mounts `/api/v1` using `apiRouter`
- `src/routes/index.ts` composes module routers:
  - `/health`
  - `/auth`
  - `/hospitals`

### Request Lifecycle

1. Request enters Express app
2. Global middleware runs: logging, security headers, CORS, rate limit, parsing
3. Request reaches versioned router
4. Module route applies validation and auth middleware as needed
5. Controller receives validated input
6. Controller calls an application service
7. Service orchestrates business rules
8. Repository persists or fetches data using Prisma
9. Controller returns standardized response

### API Documentation

Swagger UI is served at:

```text
/docs
```

The OpenAPI source is maintained manually under `src/docs/openapi`.

## 11. Module Architecture

The backend follows a lightweight layered module pattern.

### Recommended Layer Definitions

| Layer | Responsibility |
|---|---|
| `interfaces` | HTTP layer: routes, controllers, presenters |
| `application` | Use cases and business orchestration |
| `domain` | Core business contracts, constants, schemas, and rules |
| `infrastructure` | External system access such as Prisma, Redis, JWT, S3 |
| `validation` | Request contracts for incoming HTTP data when kept separate from domain |

### Practical Example

For `hospital` creation:

1. `hospital.routes.ts` defines the `POST /hospitals` endpoint
2. `validateRequest(createHospitalSchema)` validates the request
3. `hospital.controller.ts` calls `createHospitalService`
4. `createHospital.service.ts` computes the slug and orchestrates the use case
5. `hospital.repository.ts` performs transactional database writes through Prisma

This is the model new modules should follow.

## 12. How to Add a New Module

Use the module structure consistently. The existing `src/shared/scripts/create-module.ts` can be used as a starting point if it matches the desired layout.

### Recommended Steps

1. Create a new folder under `src/modules/<module-name>`
2. Add `interfaces`, `application`, `domain`, and `infrastructure`
3. Add `validation` and `tests` if needed
4. Define the route file in `interfaces`
5. Add controller functions in `interfaces`
6. Add use cases in `application/service`
7. Add repositories or external adapters in `infrastructure`
8. Add constants, types, and schemas in `domain`
9. Register the module router in `src/routes/index.ts`
10. Add OpenAPI docs in `src/docs/openapi/paths` and `src/docs/openapi/schemas`
11. Add tests for both use cases and API behavior

### Module Checklist

- Route registered under `/api/v1`
- Validation schema exists
- Controller remains thin
- Service contains business rules
- Repository owns persistence
- Errors use `AppError`
- Response uses `sendResponse`
- OpenAPI entry added
- Tests added

## 13. How to Add a New API

### Standard Process

1. Define the request schema with Zod
2. Add the route in the module router
3. Add a controller method
4. Add or reuse an application service
5. Add or reuse repository methods if persistence is needed
6. Return a standardized response
7. Document the endpoint in OpenAPI
8. Add tests

### Example Pattern

```ts
router.post(
  '/',
  validateRequest(createEntitySchema),
  entityController.createEntity,
);
```

### Controller Pattern

```ts
const createEntity = catchAsync(async (req, res) => {
  const result = await createEntityService(req.body);

  sendResponse(res, 201, {
    success: true,
    message: 'Entity created successfully',
    data: result,
  });
});
```

## 14. Development Workflow

### Local Setup

1. Install dependencies
2. Create `.env` from `.env.example`
3. Add any missing required env values such as `CORS_ENABLED=true`
4. Start PostgreSQL and Redis locally
5. Run migrations
6. Seed the database if required
7. Start the development server

### Typical Commands

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

### Daily Workflow

1. Pull latest code
2. Run migrations if schema changed
3. Implement module or API changes
4. Update OpenAPI docs
5. Run `npm run lint`
6. Run `npm run typecheck`
7. Run relevant tests
8. Commit only when checks pass

## 15. How to Run the Project Locally

### Prerequisites

- Node.js `>=20.11.0`
- PostgreSQL
- Redis
- npm

### Local Run Steps

```bash
npm install
cp .env.example .env
```

Then update `.env` with at least:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospital_management?schema=public
PORT=4000
HOST=0.0.0.0
CORS_ENABLED=true
CORS_ORIGINS=*
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
JWT_ACCESS_SECRET=dev-access-secret-change-me
JWT_EXPIRES_IN=15m
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

Then run:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run dev
```

Useful URLs:

- API base: `http://localhost:4000/api/v1`
- Swagger docs: `http://localhost:4000/docs`

## 16. Best Practices

### Architecture Best Practices

- Keep feature logic inside its module
- Do not let controllers talk directly to Prisma unless there is an exceptional reason
- Avoid placing business rules in route files
- Keep `shared` generic; move feature-specific code back into the module
- Prefer transaction boundaries in repositories for multi-write operations

### Reliability Best Practices

- Validate all inbound data
- Centralize error handling
- Use structured logging
- Protect sensitive endpoints with authentication and authorization middleware
- Add rate limits for abuse-sensitive routes
- Write API tests for all public endpoints

### Maintainability Best Practices

- Keep OpenAPI docs updated with every endpoint change
- Favor descriptive file names such as `createHospital.service.ts`
- Keep service functions focused on one use case
- Use constants for messages and reusable domain labels
- Avoid hidden side effects in utility functions

### Security Best Practices

- Never hardcode secrets outside local defaults
- Hash passwords with `bcrypt`
- Rotate JWT secrets in production
- Restrict CORS to known origins outside development
- Review logging to avoid leaking tokens or PII

## 17. Deployment Notes

### Current State

The repository supports production builds through:

```bash
npm run build
npm start
```

Production deployment requires:

- Valid production `DATABASE_URL`
- Valid production Redis instance
- Strong JWT secrets
- Correct CORS origin configuration
- Reverse proxy or load balancer configuration if `TRUST_PROXY=true`

### Database Deployment

Use:

```bash
npm run prisma:migrate:deploy
```

Do not use `prisma:migrate:dev` in production.

### Redis and Workers

If background jobs are needed in production, deploy worker processes alongside the API process. The current project auto-imports workers from the application bootstrap, but larger deployments usually separate API and worker runtimes into different services.

### Docker Notes

Docker is part of the intended platform but is not yet defined in this repo. When containerizing:

- Add a `Dockerfile` for the API service
- Add a separate worker container if BullMQ processing is isolated
- Inject env vars through secrets or container orchestration
- Run Prisma migrations as part of deployment or release startup

### AWS S3 Notes

When S3-backed file storage is introduced:

- Put storage logic in an infrastructure adapter, not in controllers
- Hide S3 SDK details behind a service interface
- Store file metadata in PostgreSQL, not only in S3
- Keep bucket names and credentials in env config

## 18. Summary for New Developers

If you are new to the project, understand these five points first:

1. All features should live inside `src/modules`
2. Controllers should be thin and delegate to services
3. Repositories own Prisma and database access
4. Shared concerns belong in `src/shared`, but only if they are truly cross-module
5. Every new API should include validation, documentation, and tests

This project is already structured in a way that can scale well for a SaaS backend if those boundaries remain disciplined.
