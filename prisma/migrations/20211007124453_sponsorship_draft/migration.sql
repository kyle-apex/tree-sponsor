-- AlterTable
ALTER TABLE `Sponsorship` MODIFY `reviewStatus` ENUM('New', 'Draft', 'Approved', 'Rejected', 'Modified') DEFAULT 'New';
