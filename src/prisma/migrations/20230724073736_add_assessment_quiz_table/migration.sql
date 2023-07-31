-- CreateTable
CREATE TABLE "AssessmentQuiz" (
    "assessmentId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "submissionId" TEXT,

    CONSTRAINT "AssessmentQuiz_pkey" PRIMARY KEY ("assessmentId","quizId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuiz_submissionId_key" ON "AssessmentQuiz"("submissionId");

-- AddForeignKey
ALTER TABLE "AssessmentQuiz" ADD CONSTRAINT "AssessmentQuiz_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuiz" ADD CONSTRAINT "AssessmentQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuiz" ADD CONSTRAINT "AssessmentQuiz_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
