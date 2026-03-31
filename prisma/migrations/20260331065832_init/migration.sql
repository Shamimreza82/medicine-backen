/*
  Warnings:

  - Changed the type of `max_patients` on the `plans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "plans" DROP COLUMN "max_patients",
ADD COLUMN     "max_patients" INTEGER NOT NULL;
