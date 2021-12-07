-- DropForeignKey
ALTER TABLE
    `Profile` DROP FOREIGN KEY `Profile_ibfk_1`;

-- DropForeignKey
ALTER TABLE
    `Sponsorship` DROP FOREIGN KEY `Sponsorship_ibfk_3`;

-- DropForeignKey
ALTER TABLE
    `Sponsorship` DROP FOREIGN KEY `Sponsorship_ibfk_2`;

-- DropForeignKey
ALTER TABLE
    `Sponsorship` DROP FOREIGN KEY `Sponsorship_ibfk_1`;

-- DropForeignKey
ALTER TABLE
    `Subscription` DROP FOREIGN KEY `Subscription_ibfk_2`;

-- DropForeignKey
ALTER TABLE
    `Subscription` DROP FOREIGN KEY `Subscription_ibfk_3`;

-- DropForeignKey
ALTER TABLE
    `TreeImage` DROP FOREIGN KEY `TreeImage_ibfk_1`;

-- AlterTable
ALTER TABLE
    `Comment`
MODIFY
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE
    `CommentReaction`
MODIFY
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE
    `Notification`
MODIFY
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE
    `Reaction`
MODIFY
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE
    `Species`
MODIFY
    `alternateNaming` VARCHAR(512) NULL;

-- AlterTable
ALTER TABLE
    `Tree`
ADD
    COLUMN `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
ADD
    COLUMN `identificationConfidence` INTEGER NULL,
ADD
    COLUMN `lastChangedByUserId` INTEGER NULL;

-- AlterTable
ALTER TABLE
    `TreeImage`
MODIFY
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `TreeChangeLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('Create', 'Update') NULL DEFAULT 'Create',
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `attribute` VARCHAR(191) NULL,
    `oldValue` VARCHAR(191) NULL,
    `newValue` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `treeId` INTEGER NULL,
    `transactionUuid` VARCHAR(191) NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE
    `Subscription`
ADD
    CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Subscription`
ADD
    CONSTRAINT `Subscription_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Tree`
ADD
    CONSTRAINT `Tree_lastChangedByUserId_fkey` FOREIGN KEY (`lastChangedByUserId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeChangeLog`
ADD
    CONSTRAINT `TreeChangeLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeChangeLog`
ADD
    CONSTRAINT `TreeChangeLog_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeImage`
ADD
    CONSTRAINT `TreeImage_sponsorshipId_fkey` FOREIGN KEY (`sponsorshipId`) REFERENCES `Sponsorship`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Sponsorship`
ADD
    CONSTRAINT `Sponsorship_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Sponsorship`
ADD
    CONSTRAINT `Sponsorship_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Sponsorship`
ADD
    CONSTRAINT `Sponsorship_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;