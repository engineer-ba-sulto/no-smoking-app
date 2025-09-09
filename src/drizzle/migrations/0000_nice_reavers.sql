CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` text NOT NULL,
	`smoking_start_date` text NOT NULL,
	`cigs_per_day` integer NOT NULL,
	`price_per_pack` real NOT NULL,
	`cigs_per_pack` integer NOT NULL,
	`motivations` text NOT NULL,
	`has_completed_onboarding` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
