/*
 Warnings:
 
 - Added the required column `locationId` to the `Tree` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE
    `Comment`
MODIFY
    `isDeleted` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE
    `Notification`
MODIFY
    `isRead` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE
    `Profile`
MODIFY
    `bio` TEXT NULL;

-- AlterTable
ALTER TABLE
    `Sponsorship`
MODIFY
    `isPrivate` BOOLEAN NULL DEFAULT false,
MODIFY
    `isPrivateLocation` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE
    `Tree`
ADD
    COLUMN `locationId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `latitude` DECIMAL(8, 5) NULL,
    `longitude` DECIMAL(9, 6) NULL,
    `mapboxId` VARCHAR(191) NULL,
    `mapboxCategories` VARCHAR(191) NULL,
    `mapboxPlaceType` VARCHAR(191) NULL,
    `mapboxPlaceId` VARCHAR(191) NULL,
    `mapboxNeighborhoodId` VARCHAR(191) NULL,
    `foursquareId` VARCHAR(191) NULL,
    `minLat` DECIMAL(8, 5) NULL,
    `maxLat` DECIMAL(8, 5) NULL,
    `minLong` DECIMAL(9, 6) NULL,
    `maxLong` DECIMAL(9, 6) NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Neighborhood` (
    `mapboxId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `latitude` DECIMAL(8, 5) NULL,
    `longitude` DECIMAL(9, 6) NULL,
    `minLat` DECIMAL(8, 5) NULL,
    `maxLat` DECIMAL(8, 5) NULL,
    `minLong` DECIMAL(9, 6) NULL,
    `maxLong` DECIMAL(9, 6) NULL,
    PRIMARY KEY (`mapboxId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Place` (
    `mapboxId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `latitude` DECIMAL(8, 5) NULL,
    `longitude` DECIMAL(9, 6) NULL,
    `minLat` DECIMAL(8, 5) NULL,
    `maxLat` DECIMAL(8, 5) NULL,
    `minLong` DECIMAL(9, 6) NULL,
    `maxLong` DECIMAL(9, 6) NULL,
    PRIMARY KEY (`mapboxId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE
    `Notification`
ADD
    CONSTRAINT `Notification_sourceUserId_fkey` FOREIGN KEY (`sourceUserId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Tree`
ADD
    CONSTRAINT `Tree_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Location`
ADD
    CONSTRAINT `Location_mapboxNeighborhoodId_fkey` FOREIGN KEY (`mapboxNeighborhoodId`) REFERENCES `Neighborhood`(`mapboxId`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Location`
ADD
    CONSTRAINT `Location_mapboxPlaceId_fkey` FOREIGN KEY (`mapboxPlaceId`) REFERENCES `Place`(`mapboxId`) ON DELETE
SET
    NULL ON UPDATE CASCADE;