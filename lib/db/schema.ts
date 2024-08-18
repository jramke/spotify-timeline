import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable('user', {
    id: text('id').notNull().primaryKey().unique(),
    spotifyId: text('spotify_id').notNull().unique(),
    username: text('username').notNull().default(''),
});

export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;

export const user_token = sqliteTable('user_token', {
    id: text('id').notNull().primaryKey().unique(),
    userId: text('user_id').notNull().references(() => user.id),
    accessToken: text('access_token').notNull().unique(),
    refreshToken: text('refresh_token').notNull().unique(),
    expiresAt: integer('expires_at').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').notNull().primaryKey().unique(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at').notNull()
});