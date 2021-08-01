-- AlterTable
ALTER TABLE `Role` ADD COLUMN     `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN     `hasAuthManagement` BOOLEAN NOT NULL DEFAULT false;
