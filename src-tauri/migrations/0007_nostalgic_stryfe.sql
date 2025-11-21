ALTER TABLE `sessions` ADD `duration` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `word_count` integer;--> statement-breakpoint
ALTER TABLE `sessions` ADD `note_word_count` integer;--> statement-breakpoint
ALTER TABLE `sessions` ADD `file_path` text NOT NULL;