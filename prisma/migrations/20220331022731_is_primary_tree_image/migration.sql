-- AlterTable
ALTER TABLE
    `Category`
ADD
    COLUMN `roleId` INTEGER NULL,
ADD
    COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE
    `Event`
ADD
    COLUMN `pictureUrl` VARCHAR(191) NULL,
ADD
    COLUMN `roleId` INTEGER NULL,
ADD
    COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE
    `Tree`
MODIFY
    `streetViewHeading` VARCHAR(191) NULL DEFAULT '',
MODIFY
    `streetViewPitch` VARCHAR(191) NULL DEFAULT '';

-- AlterTable
ALTER TABLE
    `TreeImage`
ADD
    COLUMN `isPrimary` BOOLEAN NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE
    `Category`
ADD
    CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Category`
ADD
    CONSTRAINT `Category_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Event`
ADD
    CONSTRAINT `Event_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    `Event`
ADD
    CONSTRAINT `Event_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE
SET
    NULL ON UPDATE CASCADE;