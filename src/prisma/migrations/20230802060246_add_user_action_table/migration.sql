/*
  Warnings:

  - Added the required column `userActionId` to the `CandidateActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateActivityLog" ADD COLUMN     "userActionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserAction" (
    "id" SERIAL NOT NULL,
    "userAction" TEXT NOT NULL,

    CONSTRAINT "UserAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAction_userAction_key" ON "UserAction"("userAction");

-- AddForeignKey
ALTER TABLE "CandidateActivityLog" ADD CONSTRAINT "CandidateActivityLog_userActionId_fkey" FOREIGN KEY ("userActionId") REFERENCES "UserAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
