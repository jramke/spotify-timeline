CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`spotify_id` text NOT NULL,
	`username` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_token` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_id_unique` ON `session` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_spotify_id_unique` ON `user` (`spotify_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_token_id_unique` ON `user_token` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_token_access_token_unique` ON `user_token` (`access_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_token_refresh_token_unique` ON `user_token` (`refresh_token`);