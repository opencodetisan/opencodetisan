/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdminContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AdminContact" DROP CONSTRAINT "AdminContact_userId_fkey";

-- DropForeignKey
ALTER TABLE "PriceFeature" DROP CONSTRAINT "PriceFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "PriceFeature" DROP CONSTRAINT "PriceFeature_priceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "AdminContact";

-- DropTable
DROP TABLE "Feature";

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "PriceFeature";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";
