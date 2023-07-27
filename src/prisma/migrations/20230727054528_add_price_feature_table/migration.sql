-- CreateTable
CREATE TABLE "PriceFeature" (
    "priceId" TEXT NOT NULL,
    "featureId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PriceFeature_pkey" PRIMARY KEY ("priceId","featureId")
);

-- AddForeignKey
ALTER TABLE "PriceFeature" ADD CONSTRAINT "PriceFeature_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceFeature" ADD CONSTRAINT "PriceFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
