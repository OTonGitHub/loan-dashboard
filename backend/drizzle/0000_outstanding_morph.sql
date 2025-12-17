CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`loanNumber` text NOT NULL,
	`amount` real NOT NULL,
	`startDate` text NOT NULL,
	`endDate` text NOT NULL,
	`emi` real NOT NULL,
	`outstandingAmount` real NOT NULL,
	`overdueAmount` real NOT NULL,
	`isActive` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `loans_loanNumber_unique` ON `loans` (`loanNumber`);