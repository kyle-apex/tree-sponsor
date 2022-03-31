-- AlterTable
ALTER TABLE `Role` ADD COLUMN `isReviewer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isTreeReviewer` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Tree` ADD COLUMN `reviewStatus` ENUM('New', 'Draft', 'Approved', 'Rejected', 'Modified') NULL DEFAULT 'New';

-- AlterTable
ALTER TABLE `TreeImage` ADD COLUMN `url` VARCHAR(191) NULL;