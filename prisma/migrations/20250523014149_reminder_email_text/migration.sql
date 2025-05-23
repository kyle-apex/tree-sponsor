-- AlterTable
ALTER TABLE `Event` ADD COLUMN `reminderText` TEXT NULL;

-- AlterTable
ALTER TABLE `EventRSVP` ADD COLUMN `reminderSentAt` DATETIME(3) NULL;

