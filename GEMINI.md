# medicine-backen Project Guide for Gemini CLI

This document provides essential information about the `medicine-backen` project, intended to help the Gemini CLI agent understand its structure, technologies, and operational procedures.

## 1. Project Overview

`medicine-backen` is a Node.js backend service built with TypeScript and Express 5, designed to manage medical data related to medicines and lab tests. It features AI-powered semantic search capabilities using Ollama and PostgreSQL with `pgvector`.

## 2. Tech Stack

The project leverages the following tech stack:

*   **Backend Framework:** Express.js 5
*   **Language:** TypeScript
*   **ORM:** Prisma (with PostgreSQL adapter)
*   **Database:** PostgreSQL (with `pgvector` for semantic search)
*   **AI Integration:** Ollama (for embeddings and text generation)
*   **API Documentation:** OpenAPI/Swagger UI (`swagger-ui-express`)
*   **Logging:** Pino Logger
*   **Environment Management:** `dotenv` / Zod-based validation
*   **Linting/Formatting:** ESLint, Prettier

## 3. Key Modules and Features

### 3.1. Domain Modules
*   **`medicine` module:** Handles searching for medicine brands, generics, and indications. Supports both standard case-insensitive matching and vector-based semantic search.
*   **`lab-test` module:** Manages lab test-related data (specimen, preparation, normal ranges).

### 3.2. Core Features & Infrastructure
*   **AI & Vector Sync:** `OllamaService` handles interaction with local Ollama models. The `sync-medicine-embeddings.ts` script generates embeddings for medicine generics and stores them in a `medicine_embeddings` table using the `vector` type.
*   **Prisma ORM:** Advanced multi-file schema setup (`medicine.prisma`, `labTest.prisma`) merged into a single client.
*   **Global Error Handling:** Centralized system with specialized handlers for Prisma, Zod, and JWT errors.
*   **Middleware:** Includes request context management, rate limiting, and request validation.

## 4. Development Setup and Common Commands

### 4.1. Prerequisites

*   Node.js (>=20.11.0)
*   npm
*   PostgreSQL (with `pgvector` extension)
*   Ollama (running locally for AI features)

### 4.2. Common Commands

*   **Development:** `npm run dev`
*   **Build/Start:** `npm run build` / `npm start`
*   **Type Checking:** `npm run typecheck`
*   **Linter/Format:** `npm run lint` / `npm run format`
*   **Prisma:** `npm run prisma:migrate:dev`, `npm run prisma:studio`
*   **Lab Test Seeding:** `npm run seed:lab-tests`
*   **Medicine AI Sync:** `npm run medicine:embeddings:sync`

## 5. Project Structure

```text
src/
├── bootstrap/          # Server initialization, logger, prisma client
├── config/             # Environment, CORS, and rate-limit configurations
├── docs/               # OpenAPI/Swagger specifications and schemas
├── middlewares/        # Express middlewares (auth, validation, errors)
├── modules/            # Domain-specific modules (medicine, lab-test)
├── routes/             # API route aggregation (/api/v1)
├── shared/             # Cross-cutting concerns
│   ├── errors/         # Custom AppError and error handlers
│   ├── services/       # Ollama service and AI logic
│   ├── utils/          # Pagination, response, and validation helpers
│   └── scripts/        # Data sync and maintenance scripts
└── types/              # Global TypeScript and Express type definitions
```

## 6. Important Notes for Gemini CLI

*   **Convention Adherence:** Follow the established modular structure. Each module must contain its own controller, service, repository, and validation logic.
*   **Database:** Use Prisma for all relational data. Raw SQL should only be used for specialized vector operations (e.g., `pgvector` similarity searches).
*   **AI Service:** Always check if Ollama is running before attempting to use `OllamaService` or the embedding sync script.
*   **Surgical Updates:** When modifying files, preserve the existing import style (e.g., `@/` aliases) and ensure Zod schemas are updated if the data structure changes.
