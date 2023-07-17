-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED_PROTECT', 'PUBLISHED_PUBLIC', 'REJECTED', 'DELETED');

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeLanguageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "instruction" TEXT NOT NULL DEFAULT '',
    "answer" TEXT NOT NULL DEFAULT '',
    "submissionCachedCount" INTEGER NOT NULL DEFAULT 0,
    "defaultCode" TEXT NOT NULL DEFAULT '',
    "difficultyLevelId" INTEGER NOT NULL DEFAULT 0,
    "locale" TEXT NOT NULL DEFAULT '',
    "status" "QuizStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DifficultyLevel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DifficultyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeLanguage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prettyName" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CodeLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DifficultyLevel_name_key" ON "DifficultyLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CodeLanguage_name_key" ON "CodeLanguage"("name");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_codeLanguageId_fkey" FOREIGN KEY ("codeLanguageId") REFERENCES "CodeLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "DifficultyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
