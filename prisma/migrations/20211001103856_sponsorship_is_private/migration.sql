/*
  Warnings:

  - Added the required column `reviewStatus` to the `Sponsorship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `SubscriptionWithDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sponsorship` ADD COLUMN     `isPrivate` BOOLEAN,
    ADD COLUMN     `reviewStatus` ENUM('New', 'Approved', 'Rejected', 'Modified') NOT NULL;

-- AlterTable
ALTER TABLE `SubscriptionWithDetails` ADD COLUMN     `productId` INTEGER NOT NULL,
    ADD COLUMN     `productName` VARCHAR(191);
