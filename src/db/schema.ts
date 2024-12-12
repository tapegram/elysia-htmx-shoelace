import { sqliteTable, integer, text, } from "drizzle-orm/sqlite-core";

// export const usersTable = sqliteTable("users", {
// 	id: integer().primaryKey({ autoIncrement: true }).notNull(),
// 	username: text().notNull().unique(),
// 	password: text().notNull(),
// }, () => []);
//
// export const todosTable = sqliteTable("todos", {
// 	id: integer().primaryKey({ autoIncrement: true }).notNull(),
// 	text: text().notNull(),
// 	completed: integer({ mode: "boolean" }).notNull().default(false),
// 	userId: integer().notNull().references(() => usersTable.id),
// }, () => []);
