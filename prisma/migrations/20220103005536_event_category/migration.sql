-- AlterTable
ALTER TABLE `Tree` ADD COLUMN `streetViewHeading` VARCHAR(191) NULL,
    ADD COLUMN `streetViewLatitude` DECIMAL(8, 5) NULL,
    ADD COLUMN `streetViewLongitude` DECIMAL(9, 6) NULL,
    ADD COLUMN `streetViewPitch` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pictureUrl` VARCHAR(191) NULL,
    `path` VARCHAR(256) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `activeStartDate` DATETIME(3) NULL,
    `activeEndDate` DATETIME(3) NULL,
    `identifier` VARCHAR(191) NULL,
    `path` VARCHAR(256) NULL,
    `locationId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TreeToEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `treeId` INTEGER NULL,
    `eventId` INTEGER NULL,
    `sequence` INTEGER NULL,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TreeToCategory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TreeToCategory_AB_unique`(`A`, `B`),
    INDEX `_TreeToCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryToEvent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryToEvent_AB_unique`(`A`, `B`),
    INDEX `_CategoryToEvent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreeToCategory` ADD FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TreeToCategory` ADD FOREIGN KEY (`B`) REFERENCES `Tree`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToEvent` ADD FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryToEvent` ADD FOREIGN KEY (`B`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;