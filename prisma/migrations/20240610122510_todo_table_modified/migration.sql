/*
  Warnings:

  - Made the column `updatedAt` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "updatedAt" SET NOT NULL;
