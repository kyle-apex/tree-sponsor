-- CreateTable
CREATE TABLE `StripeDonation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stripeSessionId` VARCHAR(191) NULL,
    `stripeCustomerId` VARCHAR(191) NULL,
    `amount` DECIMAL(6, 2) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'pending',
    `eventId` INTEGER NULL,
    `eventName` VARCHAR(191) NULL,
    `userId` INTEGER NULL,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` JSON NULL,

    UNIQUE INDEX `StripeDonation_stripeSessionId_key`(`stripeSessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
