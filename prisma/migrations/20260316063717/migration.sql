/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tenants_publicId_key" ON "tenants"("publicId");
