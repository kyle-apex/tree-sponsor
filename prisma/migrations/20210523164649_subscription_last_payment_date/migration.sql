/*
 Warnings:
 
 - A unique constraint covering the columns `[stripeId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[stripeId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
 
 */
-- AlterTable
ALTER TABLE
  `Subscription`
ADD
  COLUMN `lastPaymentDate` DATETIME(3);

-- CreateTable
CREATE TABLE `SubscriptionWithDetails` (
  `id` INTEGER NOT NULL,
  `createdDate` DATETIME(3),
  `expirationDate` DATETIME(3),
  `status` VARCHAR(191),
  `stripeId` VARCHAR(191),
  `stripeCustomerId` VARCHAR(191),
  `stripeProductId` VARCHAR(191),
  `userName` VARCHAR(191),
  `email` VARCHAR(191),
  `amount` INTEGER NOT NULL UNIQUE INDEX `SubscriptionWithDetails.id_unique`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

_ -- CreateIndex
CREATE UNIQUE INDEX `Product.stripeId_unique` ON `Product`(`stripeId`);

-- CreateIndex
CREATE UNIQUE INDEX `Subscription.stripeId_unique` ON `Subscription`(`stripeId`);