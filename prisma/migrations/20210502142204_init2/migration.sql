/*
  Warnings:

  - You are about to drop the column `customerId` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `customerId`,
    ADD COLUMN     `stripeCustomerId` VARCHAR(32),
    ADD COLUMN     `stripeId` VARCHAR(32),
    ADD COLUMN     `productId` INTEGER,
    MODIFY `createdDate` DATETIME(3),
    MODIFY `expirationDate` DATETIME(3),
    MODIFY `status` VARCHAR(32),
    MODIFY `userId` INTEGER;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191),
    `amount` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subscription` ADD FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
