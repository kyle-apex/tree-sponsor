-- AlterTable
ALTER TABLE `Sponsorship` MODIFY `reviewStatus` ENUM('New', 'Approved', 'Rejected', 'Modified') DEFAULT 'New';
