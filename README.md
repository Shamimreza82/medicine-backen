# Medicine Backend

A robust Node.js backend built with TypeScript and Express 5, designed for managing and searching medical data, including medicines and lab tests. This project features AI-powered semantic search capabilities using Ollama and pgvector.

## Features

- **Medicine Management:** Searchable database of medicine brands, generics, and indications.
- **Lab Test Registry:** Detailed information on lab tests, specimens, and normal ranges.
- **AI Integration:** Semantic search and embeddings via Ollama.
- **Modern Stack:** Built with Express 5, Prisma ORM, and PostgreSQL.
- **API Documentation:** Interactive Swagger UI documentation.
- **Robust Validation:** Request validation using Zod.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (supports `pgvector`)
- **AI:** Ollama
- **Logging:** Pino
- **Documentation:** Swagger UI / OpenAPI 3

## Getting Started

### 1. Prerequisites

- Node.js (>=20.11.0)
- npm
- PostgreSQL
- Ollama (running locally for AI features)

### 2. Installation

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
CORS_ENABLED=true
CORS_ORIGINS=*
DATABASE_URL=postgresql://user:password@localhost:5432/medicine_db?schema=public
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
JWT_ACCESS_SECRET=your-secret-key
LOG_LEVEL=info
HTTP_LOG_LEVEL=info
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_CHAT_MODEL=gemma3:4b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
MEDICINE_RAG_MATCH_COUNT=5
```

### 4. Database Initialization

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate:dev

# Seed lab tests
npm run seed:lab-tests
```

### 5. AI Embedding Sync (Optional)

To enable semantic search features, sync medicine embeddings with Ollama:

```bash
npm run medicine:embeddings:sync
```

### 6. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## API Documentation

Once the server is running, you can access the interactive Swagger UI at:
`http://localhost:4000/docs`

## Project Structure

```text
src/
├── bootstrap/    # App initialization and core clients
├── config/       # Environment and middleware configs
├── docs/         # OpenAPI specifications
├── middlewares/  # Express middlewares
├── modules/      # Feature modules (medicine, lab-test)
├── routes/       # API route definitions (/api/v1)
├── shared/       # Shared utilities, services, and errors
└── types/        # Global TypeScript types
```

## Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run typecheck`: Run TypeScript compiler check.
- `npm run lint`: Lint the codebase.
- `npm run format`: Format code with Prettier.
- `npm run prisma:studio`: Open Prisma Studio.
- `npm run medicine:embeddings:sync`: Sync AI embeddings.
