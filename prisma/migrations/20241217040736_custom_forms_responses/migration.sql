-- CreateTable
CREATE TABLE `FormResponse` (
    `responsesJson` JSON NULL,
    `createdDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `formId` INTEGER NOT NULL,

    UNIQUE INDEX `FormResponse_userId_formId_key`(`userId`, `formId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FormResponse` ADD CONSTRAINT `FormResponse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FormResponse` ADD CONSTRAINT `FormResponse_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Form`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;