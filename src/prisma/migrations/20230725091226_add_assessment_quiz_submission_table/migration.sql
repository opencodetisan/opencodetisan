-- CreateTable
CREATE TABLE "AssessmentQuizSubmission" (
    "id" TEXT NOT NULL,
    "assessmentResultId" TEXT NOT NULL,
    "submissionId" TEXT,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "AssessmentQuizSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuizSubmission_submissionId_key" ON "AssessmentQuizSubmission"("submissionId");

-- AddForeignKey
ALTER TABLE "AssessmentQuizSubmission" ADD CONSTRAINT "AssessmentQuizSubmission_assessmentResultId_fkey" FOREIGN KEY ("assessmentResultId") REFERENCES "AssessmentResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuizSubmission" ADD CONSTRAINT "AssessmentQuizSubmission_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
