-- CreateTable
CREATE TABLE `TreeImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191),
    `createdDate` DATETIME(3),
    `reviewStatus` ENUM('New', 'Draft', 'Approved', 'Rejected', 'Modified') DEFAULT 'New',
    `sponsorshipId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TreeImage` ADD FOREIGN KEY (`sponsorshipId`) REFERENCES `Sponsorship`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
