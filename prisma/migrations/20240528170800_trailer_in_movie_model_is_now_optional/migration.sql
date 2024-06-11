/*
  Warnings:

  - You are about to drop the column `Trailer` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "Trailer",
ADD COLUMN     "trailer" TEXT DEFAULT '';
