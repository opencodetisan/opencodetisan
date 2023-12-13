/*
  Warnings:

  - Added the required column `secure` to the `MailSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MailSetting" ADD COLUMN     "secure" BOOLEAN NOT NULL;
