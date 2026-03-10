/*
  Warnings:

  - You are about to drop the column `entity_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `module` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `activity_logs` table. All the data in the column will be lost.
  - Added the required column `action` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_hospital_id_fkey";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "entity_id",
DROP COLUMN "message",
DROP COLUMN "module",
DROP COLUMN "type",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endpoint" TEXT,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "resource" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT,
ALTER COLUMN "hospital_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "idx_activity_tenant_time" ON "activity_logs"("hospital_id", "created_at");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "activity_logs_hospital_id_idx" RENAME TO "idx_activity_hospital";

-- RenameIndex
ALTER INDEX "activity_logs_user_id_idx" RENAME TO "idx_activity_user";
