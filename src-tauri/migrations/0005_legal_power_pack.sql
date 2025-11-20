ALTER TABLE `sessions` ADD `number` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `name` text;--> statement-breakpoint
ALTER TABLE `sessions` DROP COLUMN `date`;