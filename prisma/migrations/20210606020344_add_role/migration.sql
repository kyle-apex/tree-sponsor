-- AlterTable
ALTER TABLE `users` ADD COLUMN     `shirtSize` VARCHAR(191);

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionWithDetails` (
    `id` INTEGER NOT NULL,
    `createdDate` DATETIME(3),
    `expirationDate` DATETIME(3),
    `lastPaymentDate` DATETIME(3),
    `status` VARCHAR(191),
    `stripeId` VARCHAR(191),
    `stripeCustomerId` VARCHAR(191),
    `stripeProductId` VARCHAR(191),
    `userId` INTEGER NOT NULL,
    `userName` VARCHAR(191),
    `email` VARCHAR(191),
    `shirtSize` VARCHAR(191),
    `amount` INTEGER NOT NULL,
UNIQUE INDEX `SubscriptionWithDetails.id_unique`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,
UNIQUE INDEX `_UserToRole_AB_unique`(`A`, `B`),
INDEX `_UserToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserToRole` ADD FOREIGN KEY (`A`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToRole` ADD FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
