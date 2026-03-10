-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");
