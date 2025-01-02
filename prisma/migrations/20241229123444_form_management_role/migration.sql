-- AlterTable
ALTER TABLE `Role` ADD COLUMN `hasFormManagement` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE
  `Profile`
ADD
  COLUMN `title` VARCHAR(75);