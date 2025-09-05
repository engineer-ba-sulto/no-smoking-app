PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`smoking_start_date` text NOT NULL,
	`cigs_per_day` integer NOT NULL,
	`price_per_pack` real NOT NULL,
	`cigs_per_pack` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user_profile`("id", "smoking_start_date", "cigs_per_day", "price_per_pack", "cigs_per_pack", "created_at", "updated_at") SELECT "id", "smoking_start_date", "cigs_per_day", "price_per_pack", "cigs_per_pack", "created_at", "updated_at" FROM `user_profile`;--> statement-breakpoint
DROP TABLE `user_profile`;--> statement-breakpoint
ALTER TABLE `__new_user_profile` RENAME TO `user_profile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;