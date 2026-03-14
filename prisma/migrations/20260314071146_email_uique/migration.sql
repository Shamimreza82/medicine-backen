/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `tenants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tenants" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");
