/*
  Warnings:

  - You are about to drop the column `shirtSize` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `shirtSize`,
    ADD COLUMN     `hasShirt` BOOLEAN DEFAULT false;
