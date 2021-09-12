/*
  Warnings:

  - You are about to drop the column `locationId` on the `Tree` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tree` DROP FOREIGN KEY `Tree_ibfk_1`;

-- AlterTable
ALTER TABLE `Tree` DROP COLUMN `locationId`,
    ADD COLUMN     `latitude` DECIMAL(8, 5),
    ADD COLUMN     `longitude` DECIMAL(9, 6);

-- DropTable
DROP TABLE `Location`;
