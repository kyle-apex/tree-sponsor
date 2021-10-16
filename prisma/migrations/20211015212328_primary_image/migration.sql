-- AlterTable
ALTER TABLE `Sponsorship` ADD COLUMN     `primaryImageUuid` VARCHAR(191),
    ADD COLUMN     `primaryImageHeight` INTEGER,
    ADD COLUMN     `primaryImageWidth` INTEGER;

-- AlterTable
ALTER TABLE `TreeImage` ADD COLUMN     `width` INTEGER,
    ADD COLUMN     `height` INTEGER;
