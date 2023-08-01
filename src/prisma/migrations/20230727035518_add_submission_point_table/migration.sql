-- CreateTable
CREATE TABLE "SubmissionPoint" (
    "id" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "assessmentPointId" INTEGER NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "SubmissionPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmissionPoint" ADD CONSTRAINT "SubmissionPoint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionPoint" ADD CONSTRAINT "SubmissionPoint_assessmentPointId_fkey" FOREIGN KEY ("assessmentPointId") REFERENCES "AssessmentPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionPoint" ADD CONSTRAINT "SubmissionPoint_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
