DROP VIEW `SUBSCRIPTIONWITHDETAILS`;

CREATE TABLE `SUBSCRIPTIONWITHDETAILS` (
    `ID` INT(11) NOT NULL,
    `CREATEDDATE` DATETIME(3) DEFAULT NULL,
    `EXPIRATIONDATE` DATETIME(3) DEFAULT NULL,
    `LASTPAYMENTDATE` DATETIME(3) DEFAULT NULL,
    `STATUS` VARCHAR(191) COLLATE UTF8MB4_UNICODE_CI DEFAULT NULL,
    `STRIPEID` VARCHAR(191) COLLATE UTF8MB4_UNICODE_CI DEFAULT NULL,
    `STRIPECUSTOMERID` VARCHAR(191) COLLATE UTF8MB4_UNICODE_CI DEFAULT NULL,
    `STRIPEPRODUCTID` VARCHAR(191) COLLATE UTF8MB4_UNICODE_CI DEFAULT NULL,
    `USERID` INT(11) NOT NULL,
    `USERNAME` VARCHAR(191) COLLATE UTF8MB4_UNICODE_CI DEFAULT NULL,
    `EMAIL` VARCHAR(191) COLLATE UTF8MB4_UNICODE_CI DEFAULT NULL,
    `AMOUNT` INT(11) NOT NULL,
    `HASSHIRT` TINYINT(1) DEFAULT NULL,
    UNIQUE KEY `SUBSCRIPTIONWITHDETAILS.ID_UNIQUE` (`ID`)
) ENGINE = INNODB DEFAULT CHARSET = UTF8MB4 COLLATE = UTF8MB4_UNICODE_CI;