-- AlterTable
ALTER TABLE `Role` ADD COLUMN `hasFormManagement` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE
  `Profile`
ADD
  COLUMN `title` VARCHAR(75);

ALTER TABLE `users` ADD COLUMN  `hideFromIndexPage` BOOLEAN DEFAULT false;

ALTER TABLE `users` ADD COLUMN  `hideFromCheckinPage` BOOLEAN DEFAULT false;
