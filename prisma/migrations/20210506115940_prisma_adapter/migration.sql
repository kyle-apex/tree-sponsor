/*
  Warnings:

  - You are about to alter the column `compound_id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `provider_type` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `provider_id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `provider_account_id` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `session_token` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `access_token` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `identifier` on the `verification_requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `token` on the `verification_requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `tutorials_tbl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Subscription` DROP FOREIGN KEY `Subscription_ibfk_1`;

-- AlterTable
ALTER TABLE `accounts` MODIFY `compound_id` VARCHAR(191) NOT NULL,
    MODIFY `provider_type` VARCHAR(191) NOT NULL,
    MODIFY `provider_id` VARCHAR(191) NOT NULL,
    MODIFY `provider_account_id` VARCHAR(191) NOT NULL,
    MODIFY `refresh_token` VARCHAR(191),
    MODIFY `access_token` VARCHAR(191),
    MODIFY `access_token_expires` DATETIME(3),
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Product` ADD COLUMN     `stripeId` VARCHAR(191);

-- AlterTable
ALTER TABLE `sessions` MODIFY `expires` DATETIME(3) NOT NULL,
    MODIFY `session_token` VARCHAR(191) NOT NULL,
    MODIFY `access_token` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` MODIFY `name` VARCHAR(191),
    MODIFY `email` VARCHAR(191),
    MODIFY `email_verified` DATETIME(3),
    MODIFY `image` VARCHAR(191),
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `verification_requests` MODIFY `identifier` VARCHAR(191) NOT NULL,
    MODIFY `token` VARCHAR(191) NOT NULL,
    MODIFY `expires` DATETIME(3) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `tutorials_tbl`;

-- DropTable
DROP TABLE `User`;

-- AddForeignKey
ALTER TABLE `Profile` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterIndex
ALTER TABLE `accounts` RENAME INDEX `provider_account_id` TO `providerAccountId`;

-- AlterIndex
ALTER TABLE `accounts` RENAME INDEX `provider_id` TO `providerId`;

-- AlterIndex
ALTER TABLE `accounts` RENAME INDEX `user_id` TO `userId`;
