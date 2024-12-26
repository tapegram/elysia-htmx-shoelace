import { sqliteTable, integer, text, } from "drizzle-orm/sqlite-core";

export const tasksTable = sqliteTable("tasks", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  summary: text().notNull(),
  completed: integer({ mode: "boolean" }).notNull().default(false),
  description: text(),
  dueDate: text().notNull(),
  userId: integer().notNull().references(() => usersTable.id),
}, () => []);

export const usersTable = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  githubId: integer().notNull(),
}, () => []);

