/*
  Warnings:

  - Made the column `customerEmail` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerName` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerAddress" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "customerEmail" SET NOT NULL,
ALTER COLUMN "customerName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
