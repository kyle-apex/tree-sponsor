/*
  Warnings:

  - You are about to drop the `CheckIn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CheckIn` DROP FOREIGN KEY `CheckIn_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `CheckIn` DROP FOREIGN KEY `CheckIn_treeId_fkey`;

-- DropForeignKey
ALTER TABLE `CheckIn` DROP FOREIGN KEY `CheckIn_userId_fkey`;

-- DropTable
DROP TABLE `CheckIn`;

-- CreateTable
CREATE TABLE `TreeCheckIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NULL,
    `discoveredFrom` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `treeId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventCheckIn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `email` VARCHAR(191) NULL,
    `discoveredFrom` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `eventId` INTEGER NULL,

    UNIQUE INDEX `EventCheckIn_email_eventId_key`(`email`, `eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TreeCheckIn` ADD CONSTRAINT `TreeCheckIn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreeCheckIn` ADD CONSTRAINT `TreeCheckIn_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventCheckIn` ADD CONSTRAINT `EventCheckIn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventCheckIn` ADD CONSTRAINT `EventCheckIn_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreeToEvent` ADD CONSTRAINT `_TreeToEvent_A_fkey` FOREIGN KEY (`A`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreeToEvent` ADD CONSTRAINT `_TreeToEvent_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tree`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `SubscriptionWithDetails` RENAME INDEX `SubscriptionWithDetails.id_unique` TO `SubscriptionWithDetails_id_key`;
