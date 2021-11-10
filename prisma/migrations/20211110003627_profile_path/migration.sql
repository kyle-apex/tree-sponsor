-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Sponsorship` DROP FOREIGN KEY `Sponsorship_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Sponsorship` DROP FOREIGN KEY `Sponsorship_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Sponsorship` DROP FOREIGN KEY `Sponsorship_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_ibfk_3`;

-- DropForeignKey
ALTER TABLE `SubscriptionWithDetails` DROP FOREIGN KEY `SubscriptionWithDetails_ibfk_1`;

-- DropForeignKey
ALTER TABLE `TreeImage` DROP FOREIGN KEY `TreeImage_ibfk_1`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `profilePath` VARCHAR(256) NULL;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionWithDetails` ADD CONSTRAINT `SubscriptionWithDetails_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TreeImage` ADD CONSTRAINT `TreeImage_sponsorshipId_fkey` FOREIGN KEY (`sponsorshipId`) REFERENCES `Sponsorship`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD CONSTRAINT `Sponsorship_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD CONSTRAINT `Sponsorship_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD CONSTRAINT `Sponsorship_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Product` RENAME INDEX `Product.stripeId_unique` TO `Product_stripeId_key`;

-- RenameIndex
ALTER TABLE `Profile` RENAME INDEX `Profile.userId_unique` TO `Profile_userId_key`;

-- RenameIndex
ALTER TABLE `Subscription` RENAME INDEX `Subscription.stripeId_unique` TO `Subscription_stripeId_key`;

-- RenameIndex
ALTER TABLE `SubscriptionWithDetails` RENAME INDEX `SubscriptionWithDetails.id_unique` TO `SubscriptionWithDetails_id_key`;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `accounts.compound_id_unique` TO `accounts_compound_id_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions.access_token_unique` TO `sessions_access_token_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions.session_token_unique` TO `sessions_session_token_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `users.email_unique` TO `users_email_key`;

-- RenameIndex
ALTER TABLE `verification_requests` RENAME INDEX `verification_requests.token_unique` TO `verification_requests_token_key`;
