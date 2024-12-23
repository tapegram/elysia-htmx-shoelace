import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export type User = typeof usersTable.$inferSelect;

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  // OAuth specific fields
  provider: text("provider").notNull(), // 'github', 'google', etc.
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const tasksTable = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  summary: text("summary").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  description: text("description"),
  dueDate: text("due_date").notNull(),
}, () => []);

