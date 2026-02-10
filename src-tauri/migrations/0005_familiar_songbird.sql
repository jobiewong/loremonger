CREATE TABLE `campaign_vaults` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`vault_path` text NOT NULL,
	`session_dir` text DEFAULT 'Sessions' NOT NULL,
	`character_dir` text DEFAULT 'Characters' NOT NULL,
	`location_dir` text DEFAULT 'Locations' NOT NULL,
	`item_dir` text DEFAULT 'Items' NOT NULL,
	`session_template` text,
	`character_template` text,
	`location_template` text,
	`item_template` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `campaign_vaults_campaign_id_unique` ON `campaign_vaults` (`campaign_id`);--> statement-breakpoint
ALTER TABLE `campaigns` ADD `custom_system_prompt` text;