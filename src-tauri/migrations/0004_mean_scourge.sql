PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`dm_name` text NOT NULL,
	`description` text,
	`output_directory` text,
	`naming_convention` text DEFAULT '{currentDate}-{currentTime}_notes.md' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_campaigns`("id", "name", "dm_name", "description", "output_directory", "naming_convention", "created_at", "updated_at") SELECT "id", "name", "dm_name", "description", "output_directory", "naming_convention", "created_at", "updated_at" FROM `campaigns`;--> statement-breakpoint
DROP TABLE `campaigns`;--> statement-breakpoint
ALTER TABLE `__new_campaigns` RENAME TO `campaigns`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`number` integer NOT NULL,
	`name` text,
	`duration` real DEFAULT 0 NOT NULL,
	`word_count` integer,
	`note_word_count` integer,
	`file_path` text,
	`date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "campaign_id", "number", "name", "duration", "word_count", "note_word_count", "file_path", "date", "created_at", "updated_at") SELECT "id", "campaign_id", "number", "name", "duration", "word_count", "note_word_count", "file_path", "date", "created_at", "updated_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;