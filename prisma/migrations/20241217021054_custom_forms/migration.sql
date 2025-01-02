-- AlterTable
ALTER TABLE `SubdomainRedirect` MODIFY `redirect` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Form` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NULL,
    `path` VARCHAR(256) NULL,
    `description` TEXT NULL,
    `completedMessage` TEXT NULL,
    `questionsJson` JSON NULL,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdByUserId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `EventCheckIn_userId_eventId_key` ON `EventCheckIn`(`userId`, `eventId`);

-- AddForeignKey
ALTER TABLE `Form` ADD CONSTRAINT `Form_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
