/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `ProductsOnOrders` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductsOnOrders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductsOnOrders" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
