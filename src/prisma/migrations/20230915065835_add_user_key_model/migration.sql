-- CreateTable
CREATE TABLE "UserKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,

    CONSTRAINT "UserKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserKey_userId_key" ON "UserKey"("userId");

-- AddForeignKey
ALTER TABLE "UserKey" ADD CONSTRAINT "UserKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
