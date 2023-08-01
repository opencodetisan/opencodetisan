-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "AssessmentCandidate" (
    "assessmentId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,

    CONSTRAINT "AssessmentCandidate_pkey" PRIMARY KEY ("assessmentId","candidateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentCandidate_token_key" ON "AssessmentCandidate"("token");

-- AddForeignKey
ALTER TABLE "AssessmentCandidate" ADD CONSTRAINT "AssessmentCandidate_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentCandidate" ADD CONSTRAINT "AssessmentCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
