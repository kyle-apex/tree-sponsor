-- AlterTable
ALTER TABLE `Donation` 
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `status` VARCHAR(191) NULL,
    ADD COLUMN `stripeCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `stripeSessionId` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- Step 1: Insert data from StripeDonation into Donation
INSERT INTO Donation (
  eventId,
  amount,
  date,
  createdDate,
  stripeSessionId,
  stripeCustomerId,
  status,
  userId,
  metadata,
  label
)
SELECT 
  sd.eventId,
  sd.amount,
  sd.createdDate,
  sd.createdDate,
  sd.stripeSessionId,
  sd.stripeCustomerId,
  sd.status,
  sd.userId,
  sd.metadata,
  CONCAT('Pre-event: ', sd.eventName) as label
FROM StripeDonation sd
WHERE NOT EXISTS (
  -- Avoid duplicates if stripeSessionId already exists in Donation
  SELECT 1 FROM Donation d WHERE d.stripeSessionId = sd.stripeSessionId
);

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
