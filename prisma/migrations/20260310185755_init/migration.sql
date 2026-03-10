-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "actor_role" TEXT,
ADD COLUMN     "endpoint" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "request_id" TEXT,
ADD COLUMN     "severity" TEXT DEFAULT 'INFO',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SUCCESS';

-- CreateIndex
CREATE INDEX "audit_logs_hospital_id_created_at_idx" ON "audit_logs"("hospital_id", "created_at");
