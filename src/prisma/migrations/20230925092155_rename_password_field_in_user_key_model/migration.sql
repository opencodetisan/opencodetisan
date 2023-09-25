/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `UserKey` table. All the data in the column will be lost.
  - Added the required column `password` to the `UserKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserKey" DROP COLUMN "hashedPassword",
ADD COLUMN     "password" TEXT NOT NULL;
