# medicine-backen Project Guide for Gemini CLI

This document provides essential information about the `medicine-backen` project, intended to help the Gemini CLI agent understand its structure, technologies, and operational procedures.

## 1. Project Overview

`medicine-backen` is a Node.js backend service built with TypeScript, designed to manage medical data, specifically related to medicines and lab tests. It provides a robust API for handling various aspects of medical information, potentially serving a doctor prescription or a broader healthcare management system.

## 2. Tech Stack

The project leverages a modern and efficient tech stack:

*   **Backend Framework:** Express.js
*   **Language:** TypeScript
*   **ORM:** Prisma (with PostgreSQL adapter)
*   **Database:** PostgreSQL
*   **Search Engine:** Meilisearch
*   **Caching & Job Queue:** Redis, BullMQ
*   **API Documentation:** OpenAPI/Swagger UI (`swagger-ui-express`)
*   **Logging:** Pino Logger
*   **Environment Management:** `dotenv`
*   **Linting:** ESLint
*   **Code Formatting:** Prettier
*   **Testing Framework:** Vitest
*   **Cloud Services:** AWS S3 (for storage, indicated by `@aws-sdk/client-s3`)

## 3. Key Modules and Features

The application is structured into modular components:

*   **`medicine` module:** Handles all operations related to medicine data (CRUD, validation, routing).
*   **`lab-test` module:** Manages lab test-related data and operations.
*   **Prisma ORM:** Used for database interactions, schema management, and migrations.
*   **API Endpoints:** Defined and documented using OpenAPI, with routes organized under `src/modules/*/route.ts` and aggregated in `src/routes/index.ts`.
*   **Middleware:** Includes authentication (`auth.ts`), authorization (`authorize.ts`), request validation (`validateRequest.ts`), rate limiting (`rateLimiter.ts`), and global error handling (`globalErrorHandler.ts`).
*   **Data Seeding:** Custom scripts for seeding initial data (`prisma/seed.ts`, `prisma/seed-lab-tests.ts`).
*   **Background Jobs/Workers:** Utilizes BullMQ with Redis for handling background processes (`src/workers`).
*   **Logging:** Centralized logging with Pino.

## 4. Development Setup and Common Commands

### 4.1. Prerequisites

*   Node.js (>=20.11.0)
*   npm (or yarn)
*   Docker (recommended for PostgreSQL and Redis setup)

### 4.2. Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd medicine-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Configuration:**
    Create a `.env` file in the project root by copying `.env.example` and filling in the necessary values (especially database connection strings, Redis, and Meilisearch configurations).
    ```bash
    cp .env.example .env
    ```
4.  **Database Setup (using Docker Compose for example):**
    Ensure PostgreSQL, Redis, and Meilisearch are running. You might use a `docker-compose.yml` file if one exists in the project or set them up individually.
    
    *   **Run Prisma Migrations:** This will create the database schema based on `prisma/schema.prisma`.
        ```bash
        npm run prisma:migrate:dev
        ```
    *   **Seed Database (Optional):** Populate the database with initial data.
        ```bash
        npm run seed:lab-tests
        # If there's a general seed script in prisma/seed.ts, it might be run via `npx prisma db seed` or a custom script.
        ```

### 4.3. Running the Application

*   **Development Mode (with live reload):**
    ```bash
    npm run dev
    ```
*   **Build the application:**
    ```bash
    npm run build
    ```
*   **Start the compiled application:**
    ```bash
    npm start
    ```

### 4.4. Code Quality and Testing

*   **Run Linter:**
    ```bash
    npm run lint
    npm run lint:fix # To automatically fix fixable issues
    ```
*   **Format Code:**
    ```bash
    npm run format
    ```
*   **Run Tests:**
    ```bash
    npm test
    npm run test:watch # Run tests in watch mode
    npm run test:coverage # Run tests and generate coverage report
    ```
*   **Type Checking:**
    ```bash
    npm run typecheck
    ```

### 4.5. Prisma Commands

*   **Generate Prisma Client:**
    ```bash
    npm run prisma:generate
    ```
*   **Format Prisma Schema:**
    ```bash
    npm run prisma:format
    ```
*   **Validate Prisma Schema:**
    ```bash
    npm run prisma:validate
    ```

## 5. API Documentation

The API documentation is available via Swagger UI. Once the server is running, you can typically access it at `/api-docs` (e.g., `http://localhost:3000/api-docs`), as suggested by `swagger-ui-express` and the `src/docs` directory.

## 6. Important Notes for Gemini CLI

*   **Convention Adherence:** Please adhere strictly to the existing coding style, architectural patterns, and file naming conventions.
*   **Tooling:** Prefer using `npm` scripts for common operations as defined in `package.json`.
*   **Database:** Any database changes should be handled through Prisma migrations.
*   **Testing:** Always ensure new features or bug fixes are accompanied by appropriate tests using Vitest.

This guide should provide a solid foundation for the Gemini CLI to interact with and manage the `medicine-backen` project.