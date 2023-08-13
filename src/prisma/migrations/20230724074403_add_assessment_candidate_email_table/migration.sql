-- CreateTable
CREATE TABLE "AssessmentCandidateEmail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "errorMessage" TEXT,
    "assessmentId" TEXT NOT NULL,

    CONSTRAINT "AssessmentCandidateEmail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssessmentCandidateEmail" ADD CONSTRAINT "AssessmentCandidateEmail_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
