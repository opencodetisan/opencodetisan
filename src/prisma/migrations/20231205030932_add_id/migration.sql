-- AlterTable
ALTER TABLE "MailSetting" ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "MailSetting_pkey" PRIMARY KEY ("id");
