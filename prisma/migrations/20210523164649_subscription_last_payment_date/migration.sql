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
-- CreateIndex
CREATE UNIQUE INDEX `Product.stripeId_unique` ON `Product`(`stripeId`);

-- CreateIndex
CREATE UNIQUE INDEX `Subscription.stripeId_unique` ON `Subscription`(`stripeId`);