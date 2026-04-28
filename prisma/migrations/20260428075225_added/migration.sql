-- DropIndex
DROP INDEX "brands_generic_id_idx";

-- DropIndex
DROP INDEX "brands_is_active_idx";

-- AlterTable
ALTER TABLE "medicine_embeddings" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "brands_generic_id_is_active_idx" ON "brands"("generic_id", "is_active");

-- CreateIndex
CREATE INDEX "brands_manufacturer_id_is_active_idx" ON "brands"("manufacturer_id", "is_active");

-- CreateIndex
CREATE INDEX "brands_is_active_name_idx" ON "brands"("is_active", "name");
