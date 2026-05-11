# doctor-prescriptio-backend
TypeScript/Express backend for a multi-tenant SaaS platform. The codebase uses feature modules, Prisma for PostgreSQL access, Zod validation, and Swagger UI for API docs.

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
- `POST /api/v1/medicine-ai/ask`
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
- Zod
- Pino

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
LOG_LEVEL=info
HTTP_LOG_LEVEL=info
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_CHAT_MODEL=gemma3:4b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
MEDICINE_RAG_MATCH_COUNT=5
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

To build vector search context for medicine Q&A after seeding:

```bash
npm run medicine:embeddings:sync
```

### 4. Run the app

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
  workers/
prisma/
  migrations/
  seeds/
  schema.prisma
  *.prisma
```

Legacy references are still available in `PROJECT_DOCUMENTATION.md` and `DOCS.md`.
