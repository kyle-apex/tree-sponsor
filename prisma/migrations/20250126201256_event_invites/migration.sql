-- CreateTable
CREATE TABLE `EventRSVP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('Invited', 'Maybe', 'Going', 'Declined') NULL DEFAULT 'Going',
    `email` VARCHAR(191) NULL,
    `emailOptIn` BOOLEAN NULL DEFAULT false,
    `eventDetailsEmailOptIn` BOOLEAN NULL DEFAULT true,
    `discoveredFrom` VARCHAR(191) NULL,
    `isPrivate` BOOLEAN NULL DEFAULT false,
    `userId` INTEGER NULL,
    `invitedByUserId` INTEGER NULL,
    `eventId` INTEGER NULL,

    UNIQUE INDEX `EventRSVP_email_eventId_key`(`email`, `eventId`),
    UNIQUE INDEX `EventRSVP_userId_eventId_key`(`userId`, `eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventRSVP` ADD CONSTRAINT `EventRSVP_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventRSVP` ADD CONSTRAINT `EventRSVP_invitedByUserId_fkey` FOREIGN KEY (`invitedByUserId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventRSVP` ADD CONSTRAINT `EventRSVP_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
