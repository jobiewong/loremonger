PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text,
	`number` integer NOT NULL,
	`name` text,
	`duration` real DEFAULT 0 NOT NULL,
	`word_count` integer,
	`note_word_count` integer,
	`file_path` text DEFAULT '' NOT NULL,
	`date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "campaign_id", "number", "name", "duration", "word_count", "note_word_count", "file_path", "date", "created_at", "updated_at") SELECT "id", "campaign_id", "number", "name", "duration", "word_count", "note_word_count", "file_path", "date", "created_at", "updated_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;