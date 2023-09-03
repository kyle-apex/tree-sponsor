/*
 Warnings:
 
 - You are about to drop the `_TreeToEvent` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropForeignKey
ALTER TABLE
  `_TreeToEvent` DROP FOREIGN KEY `_TreeToEvent_A_fkey`;

-- DropForeignKey
ALTER TABLE
  `_TreeToEvent` DROP FOREIGN KEY `_TreeToEvent_B_fkey`;

-- DropTable
DROP TABLE `_TreeToEvent`;

-- CreateTable
CREATE TABLE `TreeToEvent` (
  `treeId` INTEGER NOT NULL,
  `eventId` INTEGER NOT NULL,
  `sequence` INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (`treeId`, `eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE
  `Tree`
ADD
  CONSTRAINT `Tree_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE
SET
  NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  `TreeToEvent`
ADD
  CONSTRAINT `TreeToEvent_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  `TreeToEvent`
ADD
  CONSTRAINT `TreeToEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  `SpeciesQuizResponse`
ADD
  CONSTRAINT `SpeciesQuizResponse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
  NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  `SpeciesQuizResponse`
ADD
  CONSTRAINT `SpeciesQuizResponse_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE
SET
  NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  `SpeciesQuizResponse`
ADD
  CONSTRAINT `SpeciesQuizResponse_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE
SET
  NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE
  `Event`
ADD
  COLUMN `hasSpecificTrees` BOOLEAN NULL DEFAULT false;

ALTER TABLE `SpeciesQuizResponse`
ADD CONSTRAINT UniqueTreeIdUserId UNIQUE (TreeId,UserId);

-- AlterTable
ALTER TABLE
    `users`
ADD
    COLUMN `referralUserId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE
    `users`
ADD
    CONSTRAINT `referralUserId` FOREIGN KEY (`referralUserId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE
    `Tree`
ADD
    COLUMN `funFact` Varchar(512) NULL;