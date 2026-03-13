# Hospital Management Backend

TypeScript/Express backend for a hospital management platform. The codebase uses feature modules, Prisma for PostgreSQL access, Redis for cache/queue connectivity, BullMQ workers, Zod validation, and Swagger UI for API docs.

## Current Scope

Implemented modules in this repository:

- `health`
- `auth`
- `hospital`

Currently exposed API routes:

- `GET /` - basic root status response
- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/hospitals`
- `GET /docs` - Swagger UI

Some auth service files for login, logout, and refresh-token already exist, but those routes are not mounted yet in the current router.

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
JWT_EXPIRES_IN=15m
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

See `PROJECT_DOCUMENTATION.md` for the detailed architecture and folder breakdown, and `DOCS.md` for OpenAPI maintenance notes.
