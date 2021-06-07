/*
  Warnings:

  - You are about to drop the column `shirtSize` on the `SubscriptionWithDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SubscriptionWithDetails` DROP COLUMN `shirtSize`,
    ADD COLUMN     `hasShirt` BOOLEAN;
