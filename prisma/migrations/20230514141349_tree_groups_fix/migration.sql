-- DropForeignKey
ALTER TABLE
    `TreeToGroup` DROP FOREIGN KEY `TreeToGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE
    `TreeToGroup` DROP FOREIGN KEY `TreeToGroup_treeId_fkey`;

-- AlterTable
ALTER TABLE
    `TreeToGroup` DROP PRIMARY KEY,
    DROP COLUMN `id`,
MODIFY
    `treeId` INTEGER NOT NULL,
MODIFY
    `groupId` INTEGER NOT NULL,
ADD
    PRIMARY KEY (`treeId`, `groupId`);

-- AddForeignKey
ALTER TABLE
    `TreeToGroup`
ADD
    CONSTRAINT `TreeToGroup_treeId_fkey` FOREIGN KEY (`treeId`) REFERENCES `Tree`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `TreeToGroup`
ADD
    CONSTRAINT `TreeToGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `TreeGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE
    `Event`
ADD
    COLUMN `isPrivate` BOOLEAN NULL DEFAULT false;