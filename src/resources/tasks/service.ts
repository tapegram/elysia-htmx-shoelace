import { tasksTable } from "../../db/schema";
import { eq, lte, and, } from 'drizzle-orm/expressions';

import db, { TursoDB } from "../../db/connection";
export type Task = typeof tasksTable.$inferSelect
export type TaskId = Task["id"]

interface TasksService {
  getTodaysTasks(userId: number): Promise<Task[]>;
  create({ summary, description, userId }: { summary: string, description: string, userId: number }): Promise<Task>;
  complete(taskId: TaskId): Promise<Task>;
  uncomplete(taskId: TaskId): Promise<Task>;
  delete(taskId: TaskId): Promise<void>;
  defer(taskId: TaskId, days: number): Promise<Task>;
  getTaskById(taskId: TaskId, userId: number): Promise<Task>;
  updateTask(taskId: TaskId, { summary, description }: { summary: string, description: string }): Promise<Task>;
}


class TasksServiceImpl implements TasksService {
  private db;

  constructor({ db }: { db: TursoDB }) {
    this.db = db;
  }

  async getTodaysTasks(userId: number): Promise<Task[]> {
    const today = dateToday()
    return this.db.select()
      .from(tasksTable)
      .where(
        and(
          lte(tasksTable.dueDate, today),
          eq(tasksTable.completed, false),
          eq(tasksTable.userId, userId)
        )
      )
      .all();
  }

  async getTaskById(taskId: TaskId, userId: number): Promise<Task> {
    const [task] = await this.db.select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.id, taskId),
          eq(tasksTable.userId, userId)
        )
      )
      .all();
    return task;
  }

  async updateTask(taskId: TaskId, { summary, description }: { summary: string, description: string }): Promise<Task> {
    const [updatedTask] = await this.db.update(tasksTable).set({ summary, description }).where(eq(tasksTable.id, taskId)).returning().all();
    return updatedTask;
  }

  async create({ summary, description, userId }: { summary: string, description: string, userId: number }): Promise<Task> {
    const task = {
      summary,
      description,
      completed: false,
      dueDate: dateToday(),
      userId
    }
    const [createdTask] = await this.db.insert(tasksTable).values(task).returning().all();
    return createdTask;
  }

  async complete(taskId: TaskId): Promise<Task> {
    const [completedTask] = await this.db.update(tasksTable).set({ completed: true }).where(eq(tasksTable.id, taskId)).returning().all();
    return completedTask;
  }

  async uncomplete(taskId: TaskId): Promise<Task> {
    const [uncompletedTask] = await this.db.update(tasksTable).set({ completed: false }).where(eq(tasksTable.id, taskId)).returning().all();
    return uncompletedTask;
  }

  async delete(taskId: TaskId): Promise<void> {
    await this.db.delete(tasksTable).where(eq(tasksTable.id, taskId)).run();
  }

  async defer(taskId: TaskId, days: number): Promise<Task> {
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + days);
    const [deferredTask] = await this.db.update(tasksTable).set({ dueDate: newDueDate.toISOString().split('T')[0] }).where(eq(tasksTable.id, taskId)).returning().all();
    return deferredTask;
  }
}

export const tasksService: TasksService = new TasksServiceImpl({ db });


const dateToday = () => new Date().toISOString().split('T')[0]
