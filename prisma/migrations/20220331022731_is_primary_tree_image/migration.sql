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
    `Category`
ADD
    COLUMN `roleId` INTEGER NULL,
ADD
    COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE
    `Event`
ADD
    COLUMN `pictureUrl` VARCHAR(191) NULL,
ADD
    COLUMN `roleId` INTEGER NULL,
ADD
    COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE
    `Tree`
MODIFY
    `streetViewHeading` VARCHAR(191) NULL DEFAULT '',
MODIFY
    `streetViewPitch` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE
    `TreeImage`
ADD
    COLUMN `isPrimary` BOOLEAN NULL DEFAULT false;

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
    `Category`
ADD
    CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Category`
ADD
    CONSTRAINT `Category_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Event`
ADD
    CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Event`
ADD
    CONSTRAINT `Event_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE
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
    CONSTRAINT `Sponsorship_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Sponsorship`
ADD
    CONSTRAINT `Sponsorship_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;