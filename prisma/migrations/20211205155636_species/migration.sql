-- AlterTable
ALTER TABLE
    `Location`
ADD
    COLUMN `address` VARCHAR(191) NULL,
ADD
    COLUMN `placeName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE
    `Tree`
ADD
    COLUMN `diameter` DECIMAL(5, 2) NULL,
ADD
    COLUMN `height` DECIMAL(6, 2) NULL,
ADD
    COLUMN `speciesId` INTEGER NULL;

-- AlterTable
ALTER TABLE
    `TreeImage`
ADD
    COLUMN `treeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Species` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `commonName` VARCHAR(191) NULL,
    `alternateNaming` VARCHAR(191) NULL,
    `genus` VARCHAR(191) NULL,
    `species` VARCHAR(191) NULL,
    `speciesCode` VARCHAR(191) NULL,
    `growthForm` VARCHAR(191) NULL,
    `percentLeafType` VARCHAR(191) NULL,
    `leafType` VARCHAR(191) NULL,
    `growthRate` VARCHAR(191) NULL,
    `longevity` VARCHAR(191) NULL,
    `height` INTEGER NULL,
    `familyName` VARCHAR(191) NULL,
    `orderName` VARCHAR(191) NULL,
    `className` VARCHAR(191) NULL,
    `isNative` BOOLEAN NULL DEFAULT false,
    `isInTexas` BOOLEAN NULL DEFAULT false,
    `searchPriority` INTEGER NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE
    `Tree`
ADD
    CONSTRAINT `Tree_speciesId_fkey` FOREIGN KEY (`speciesId`) REFERENCES `Species`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeImage`
ADD
    CONSTRAINT `TreeImage_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;