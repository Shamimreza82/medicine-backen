CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "medicine_embeddings" (
    "id" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicine_embeddings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "medicine_embeddings_source_type_source_id_key"
ON "medicine_embeddings"("source_type", "source_id");

CREATE INDEX "medicine_embeddings_source_type_idx"
ON "medicine_embeddings"("source_type");

CREATE INDEX "medicine_embeddings_source_id_idx"
ON "medicine_embeddings"("source_id");
