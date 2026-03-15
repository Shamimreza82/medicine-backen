# Setup Guide

## Prerequisites

- Node.js `>=20.11.0`
- PostgreSQL
- Redis

## Install

```bash
npm install
```

## Environment Variables

Start from `.env.example`, then ensure these variables are present for runtime validation:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospital_management?schema=public
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
CORS_ENABLED=true
CORS_ORIGINS=*
TRUST_PROXY=false
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
JWT_ACCESS_SECRET=dev-access-secret-change-me
JWT_REFRESH_SECRET=dev-refresh-secret-change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=365d
REDIS_URL=redis://127.0.0.1:6379
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
LOG_LEVEL=info
HTTP_LOG_LEVEL=info
```

## Database

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

Optional seed:

```bash
npx prisma db seed
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Common Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run test:coverage
```
