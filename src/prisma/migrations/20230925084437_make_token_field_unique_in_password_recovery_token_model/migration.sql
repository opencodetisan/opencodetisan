/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `PasswordRecoveryToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordRecoveryToken_token_key" ON "PasswordRecoveryToken"("token");
