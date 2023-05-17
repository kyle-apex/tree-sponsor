-- CreateTable
CREATE TABLE `TreeGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pictureUrl` VARCHAR(191) NULL,
    `path` VARCHAR(256) NULL,
    `createdByUserId` INTEGER NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreeToGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `treeId` INTEGER NULL,
    `groupId` INTEGER NULL,
    `createdByUserId` INTEGER NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE
    `TreeToGroup`
ADD
    COLUMN `sequence` INTEGER default 0;

-- AddForeignKey
ALTER TABLE
    `TreeGroup`
ADD
    CONSTRAINT `TreeGroup_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeToGroup`
ADD
    CONSTRAINT `TreeToGroup_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeToGroup`
ADD
    CONSTRAINT `TreeToGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `TreeGroup`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeToGroup`
ADD
    CONSTRAINT `TreeToGroup_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;