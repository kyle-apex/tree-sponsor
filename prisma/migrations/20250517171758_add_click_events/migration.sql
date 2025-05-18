-- CreateTable
CREATE TABLE `PageView` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageUrl` VARCHAR(512) NOT NULL,
    `visitTimestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `visitorId` VARCHAR(128) NOT NULL,
    `email` VARCHAR(256) NULL,
    `queryParams` TEXT NULL,
    `userAgent` TEXT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClickEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageUrl` VARCHAR(512) NOT NULL,
    `actionName` VARCHAR(128) NOT NULL,
    `destinationUrl` VARCHAR(512) NULL,
    `clickTimestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `visitorId` VARCHAR(128) NOT NULL,
    `email` VARCHAR(256) NULL,
    `queryParams` TEXT NULL,
    `userAgent` TEXT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PageView` ADD CONSTRAINT `PageView_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClickEvent` ADD CONSTRAINT `ClickEvent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
