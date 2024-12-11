import { sqliteTable, AnySQLiteColumn, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const usersTable = sqliteTable("users_table", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	age: integer().notNull(),
	email: text().notNull(),
});

