CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`summary` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`description` text
);
--> statement-breakpoint
DROP TABLE `users_table`;