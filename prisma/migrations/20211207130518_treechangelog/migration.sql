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