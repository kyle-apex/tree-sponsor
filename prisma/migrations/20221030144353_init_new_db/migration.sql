/*
 Warnings:
 
 - You are about to drop the `TreeToEvent` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropForeignKey
ALTER TABLE
    `Profile` DROP FOREIGN KEY `profile_ibfk_1`;

-- DropForeignKey
ALTER TABLE
    `Sponsorship` DROP FOREIGN KEY `sponsorship_ibfk_1`;

-- DropForeignKey
ALTER TABLE
    `Sponsorship` DROP FOREIGN KEY `sponsorship_ibfk_2`;

-- DropForeignKey
ALTER TABLE
    `Sponsorship` DROP FOREIGN KEY `sponsorship_ibfk_3`;

-- DropForeignKey
ALTER TABLE
    `Subscription` DROP FOREIGN KEY `subscription_ibfk_2`;

-- DropForeignKey
ALTER TABLE
    `Subscription` DROP FOREIGN KEY `subscription_ibfk_3`;

-- DropForeignKey
ALTER TABLE
    `SubscriptionWithDetails` DROP FOREIGN KEY `subscriptionwithdetails_ibfk_1`;

-- DropForeignKey
ALTER TABLE
    `TreeImage` DROP FOREIGN KEY `treeimage_ibfk_1`;

-- AlterTable
ALTER TABLE
    `Category`
ADD
    COLUMN `description` TEXT NULL,
ADD
    COLUMN `isPublic` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE
    `Event`
ADD
    COLUMN `checkInDetails` TEXT NULL;

-- DropTable
DROP TABLE `TreeToEvent`;

-- CreateTable
CREATE TABLE `CheckIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `treeId` INTEGER NULL,
    `eventId` INTEGER NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreeToEvent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
    UNIQUE INDEX `_TreeToEvent_AB_unique`(`A`, `B`),
    INDEX `_TreeToEvent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
-- AddForeignKey
-- AddForeignKey
ALTER TABLE
    `SubscriptionWithDetails`
ADD
    CONSTRAINT `SubscriptionWithDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `CheckIn`
ADD
    CONSTRAINT `CheckIn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `CheckIn`
ADD
    CONSTRAINT `CheckIn_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `CheckIn`
ADD
    CONSTRAINT `CheckIn_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
-- AddForeignKey