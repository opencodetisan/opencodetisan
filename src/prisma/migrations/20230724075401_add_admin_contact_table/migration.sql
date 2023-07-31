-- CreateTable
CREATE TABLE "AdminContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactNumber" INTEGER NOT NULL,

    CONSTRAINT "AdminContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminContact_userId_key" ON "AdminContact"("userId");

-- AddForeignKey
ALTER TABLE "AdminContact" ADD CONSTRAINT "AdminContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
