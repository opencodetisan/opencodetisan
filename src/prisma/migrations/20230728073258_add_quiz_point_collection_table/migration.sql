-- CreateTable
CREATE TABLE "QuizPointCollection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "point" INTEGER NOT NULL,

    CONSTRAINT "QuizPointCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizPointCollection_userId_quizId_key" ON "QuizPointCollection"("userId", "quizId");

-- AddForeignKey
ALTER TABLE "QuizPointCollection" ADD CONSTRAINT "QuizPointCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizPointCollection" ADD CONSTRAINT "QuizPointCollection_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
