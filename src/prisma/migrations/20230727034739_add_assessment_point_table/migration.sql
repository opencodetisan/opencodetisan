-- CreateTable
CREATE TABLE "AssessmentPoint" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "point" INTEGER NOT NULL,

    CONSTRAINT "AssessmentPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentPoint_name_key" ON "AssessmentPoint"("name");
