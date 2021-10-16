/*
  Warnings:

  - The primary key for the `TreeImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TreeImage` table. All the data in the column will be lost.
  - Made the column `uuid` on table `TreeImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `TreeImage` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `uuid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);
