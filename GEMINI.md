# medicine-backen Project Guide for Gemini CLI

This document provides essential information about the `medicine-backen` project, intended to help the Gemini CLI agent understand its structure, technologies, and operational procedures.

## 1. Project Overview

`medicine-backen` is a high-performance medical data API built with **Express 5** and **TypeScript**. It serves as the backend for managing medicines, lab tests, and clinical decision support (warnings, disease-wise suggestions).

### Core Capabilities:
- **Hybrid Search**: Standard PostgreSQL text search combined with **semantic vector search** (via `pgvector` and Ollama).
- **Clinical Logic**: Pre-prescription warning checker (interactions, pregnancy, lactation).
- **Data Management**: Advanced Prisma setup with multi-file schemas and custom importers.
- **Observability**: Structured logging with Pino and Vercel-ready architecture.

## 2. Tech Stack

*   **Runtime**: Node.js (>=20.11.0)
*   **Framework**: Express.js 5.x (Beta/Latest)
*   **Language**: TypeScript
*   **ORM**: Prisma (with PostgreSQL adapter)
*   **Database**: PostgreSQL + `pgvector` extension
*   **AI/LLM**: Ollama (Local embeddings via `mxbai-embed-large` or similar)
*   **Observability**: Structured logging with Pino 10.x and OpenTelemetry instrumentation.
*   **Storage**: AWS S3 integration for medical document/image storage.
*   **API Docs**: OpenAPI 3.0 + Swagger UI
*   **Logging**: Pino 10.x (Structured, multi-transport)
*   **Validation**: Zod (Schema-first validation)
*   **Deployment**: Vercel-compatible (see `vercel.json`)

## 3. Key Modules and Features

### 3.1. Domain Modules
*   **`medicine`**:
    *   **Search**: Combined brand/generic search with support for synonyms and therapeutic classes.
    *   **Generics**: Deep clinical data including indications, administration, adult/child dosage, renal adjustments, and mode of action.
    *   **Products**: Detailed brand variations, strengths, pack sizes, and pricing.
    *   **Warnings**: Semantic and rule-based interaction checking (Interactions, Pregnancy, Lactation).
    *   **Diseases**: AI-enhanced mapping of diseases to recommended generics.
*   **`lab-test`**:
    *   Comprehensive lab test directory (specimen, prep, normal ranges).
    *   Category-based filtering and search.
*   **`admin`**:
    *   Dashboard statistics (user activity, data growth).
    *   Audit trails and activity feed for medical data updates.

### 3.2. Infrastructure
*   **AI Service**: `OllamaService` handles local vector generation.
*   **Embedding Sync**: `sync-medicine-embeddings.ts` manages the lifecycle of vector data in PostgreSQL.
*   **Observability**: Integrated OpenTelemetry for tracing and Pino for structured logging.
*   **Global Error Handling**: Centralized `AppError` system with specialized handlers for Prisma, Zod, and JWT.
*   **Standardized Responses**: All endpoints use the `sendResponse` utility for consistent JSON shapes.

## 4. Development Setup and Common Commands

### 4.1. Prerequisites
- PostgreSQL with `pgvector` (`CREATE EXTENSION vector;`)
- Ollama running locally (ensure `OLLAMA_HOST` is set if not default)
- Node.js 20+

### 4.2. Common Commands
| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server with `ts-node-dev` |
| `npm run build` | Compile TypeScript and resolve aliases |
| `npm run prisma:generate` | Generate Prisma client from schemas |
| `npm run prisma:migrate:dev` | Run database migrations |
| `npm run seed:lab-tests` | Seed lab test data from CSV |
| `npm run medicine:embeddings:sync` | Sync generic medicine vectors via Ollama |
| `npm run create:module` | Scaffold a new module (Controller/Service/Repo/Route) |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Run Prettier format |

## 5. Project Structure

```text
src/
├── bootstrap/          # Initialization logic (Express, Prisma, Logger)
│   └── logger/         # Structured logging configuration
├── config/             # Environment, CORS, and Rate-limit configs
├── docs/               # OpenAPI/Swagger schemas and aggregation
├── middlewares/        # Global/Route middlewares (Auth, Validation, Context)
├── modules/            # Domain Modules (Controller -> Service -> Repository)
├── routes/             # API v1 Route Registry
├── shared/             # Cross-cutting utilities and services
│   ├── errors/         # Error classes and global handlers
│   ├── services/       # Ollama and other external integrations
│   ├── utils/          # Pagination, Response, and Validation helpers
│   └── scripts/        # Data maintenance and sync scripts
└── types/              # Global TS definitions and Express overrides

medicine-frontend/         # Frontend Next.js Application
└── src/
    ├── app/            # App Router pages and layouts
    ├── modules/        # Feature-based domain logic
    └── shared/         # Common UI and utilities
```

## 6. Frontend Integration
The project includes a Next.js 15 frontend located in `medicine-frontend/`. 
- **API URL**: Configured via `NEXT_PUBLIC_API_URL`.
- **Shared Schemas**: While projects are separate, ensure Zod schemas and TypeScript types in the backend modules align with the frontend `types.ts` files.
- **Documentation**: Refer to `medicine-frontend/GEMINI.md` for specific frontend architectural guidelines.

## 7. Developer Guidelines for Gemini CLI

### 7.1. Module Architecture
Always adhere to the **Controller-Service-Repository** pattern within modules:
- **Controller**: Request parsing, validation call, and response triggering.
- **Service**: Business logic, orchestration of repositories/services.
- **Repository**: Direct Prisma/Database interactions.

### 7.2. Coding Standards
*   **Import Aliases**: Use `@/` for absolute imports from `src/`.
*   **Validation**: Every POST/PATCH/Query-heavy GET must have a Zod schema in `<module>.validation.ts`.
*   **Logging**: Use `logger.info`, `errorLogger.error`, or `auditLogger` as appropriate. Avoid `console.log`.
*   **Responses**: Always use `sendResponse(res, statusCode, { success, message, data, meta })`.
*   **Error Handling**: Use `catchAsync` for controllers and throw `AppError` for known failure states.

### 7.3. Database & AI
*   Use Prisma for standard CRUD.
*   For vector operations, use Prisma's `$queryRaw` with similarity operators (`<=>`, `<->`).
*   Check Ollama availability before running embedding-heavy tasks.
