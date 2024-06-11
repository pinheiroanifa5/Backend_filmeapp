/*
  Warnings:

  - Made the column `trailer` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "trailer" SET NOT NULL;
