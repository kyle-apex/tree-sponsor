-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `parameter` VARCHAR(191) NULL,
    `count` INTEGER NULL,
    `createdDate` DATETIME(3) NULL,
    `isRead` BOOLEAN NULL,
    `userId` INTEGER NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE
    `Notification`
ADD
    CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;