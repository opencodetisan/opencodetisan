-- CreateTable
CREATE TABLE "MailSetting" (
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MailSetting_username_key" ON "MailSetting"("username");
