-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `cancellationDetails` VARCHAR(64) NULL,
    ADD COLUMN `cancellationReason` TEXT NULL,
    ADD COLUMN `statusDetails` ENUM('Payment_Failed', 'Cancelled_Manually') NULL;


-- AlterTable
ALTER TABLE `users` MODIFY `hideFromIndexPage` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `hideFromCheckinPage` BOOLEAN NOT NULL DEFAULT false;
