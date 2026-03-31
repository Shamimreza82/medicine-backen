# doctor-prescriptio-backend
TypeScript/Express backend for a multi-tenant SaaS platform. The codebase uses feature modules, Prisma for PostgreSQL access, Redis for cache and queue connectivity, BullMQ workers, Zod validation, and Swagger UI for API docs.

## Documentation

Primary project documentation is now under `/docs`:

- `docs/README.md` (index)
- `docs/setup.md`
- `docs/api.md`
- `docs/architecture.md`

## Current Scope

Implemented modules in this repository:

- `auth`
- `role`
- `tenant`

Currently exposed API routes:

- `GET /` - basic root status response
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `GET /api/v1/roles`
- `POST /api/v1/roles`
- `POST /api/v1/roles/:roleId/permissions`
- `POST /api/v1/tenants`
- `GET /docs` - Swagger UI

`/api/v1/roles` and `/api/v1/tenants` are mounted after the global `auth` middleware, so they require a bearer access token. Some route-level permission checks are also enforced:

- `POST /api/v1/roles` requires `ROLE:CREATE`
- `POST /api/v1/tenants` requires `TENANT:CREATE`

## Stack

- Node.js 20+
- TypeScript
- Express 5
- Prisma with PostgreSQL
- Redis
- BullMQ
- Zod
- Pino
- Vitest

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Start from `.env.example` and make sure the runtime includes all variables required by `src/config/env.config.ts`.

Required runtime variables:

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
JWT_REFRESH_SECRET=dev-refresh-secret-change-me
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 3. Prepare the database

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

Optional seed flow:

```bash
npx prisma db seed
```

### 4. Start Redis

The server currently calls `connectRedis()` during startup, so Redis must be reachable before the app can boot successfully.

### 5. Run the app

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Useful Commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
npm run test
npm run test:coverage
npm run test:auth
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:studio
```

## Project Layout

```text
src/
  bootstrap/
  config/
  docs/
  middlewares/
  modules/
  routes/
  shared/
  tests/
  workers/
prisma/
  migrations/
  seeds/
  schema.prisma
  *.prisma
```

Legacy references are still available in `PROJECT_DOCUMENTATION.md` and `DOCS.md`.
