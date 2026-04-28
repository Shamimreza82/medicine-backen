/*
  Warnings:

  - The `category` column on the `lab_tests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "lab_tests" DROP COLUMN "category",
ADD COLUMN     "category" TEXT;

-- DropEnum
DROP TYPE "TestCategory";

-- CreateIndex
CREATE INDEX "lab_tests_category_idx" ON "lab_tests"("category");
