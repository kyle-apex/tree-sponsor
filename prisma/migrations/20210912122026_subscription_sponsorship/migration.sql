-- AlterTable
ALTER TABLE `Sponsorship` ADD COLUMN     `subscriptionId` INTEGER;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sponsorship` ADD FOREIGN KEY (`subscriptionId`) REFERENCES `SubscriptionWithDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
