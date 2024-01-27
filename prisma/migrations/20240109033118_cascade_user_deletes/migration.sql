/*
  Warnings:

  - You are about to alter the column `pictureUrl` on the `StoreProduct` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(191)`.
  - You are about to alter the column `link` on the `StoreProduct` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(191)`.
  - A unique constraint covering the columns `[userId,treeId]` on the table `SpeciesQuizResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentReaction` DROP FOREIGN KEY `CommentReaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `EventCheckIn` DROP FOREIGN KEY `EventCheckIn_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `SpeciesQuizResponse` DROP FOREIGN KEY `SpeciesQuizResponse_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Sponsorship` DROP FOREIGN KEY `Sponsorship_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TreeCheckIn` DROP FOREIGN KEY `TreeCheckIn_userId_fkey`;


-- AlterTable
ALTER TABLE `StoreProduct` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `pictureUrl` VARCHAR(191) NULL,
    MODIFY `link` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SpeciesQuizResponse_userId_treeId_key` ON `SpeciesQuizResponse`(`userId`, `treeId`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_referralUserId_fkey` FOREIGN KEY (`referralUserId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReaction` ADD CONSTRAINT `CommentReaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reaction` ADD CONSTRAINT `Reaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreeCheckIn` ADD CONSTRAINT `TreeCheckIn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventCheckIn` ADD CONSTRAINT `EventCheckIn_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpeciesQuizResponse` ADD CONSTRAINT `SpeciesQuizResponse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD CONSTRAINT `Sponsorship_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users` ADD COLUMN `email2` VARCHAR(191);