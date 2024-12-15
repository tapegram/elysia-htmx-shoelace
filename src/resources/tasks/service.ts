import { tasksTable } from "../../db/schema";
import { eq, lte } from 'drizzle-orm/expressions';

import db, { TursoDB } from "../../db/connection";
export type Task = typeof tasksTable.$inferSelect

interface TasksService {
  getTodaysTasks(): Promise<Task[]>;
  create({ summary, description }: { summary: string, description: string }): Promise<Task>;
  update(task: Task): Promise<Task>;
  complete(task: Task): Promise<Task>;
  uncomplete(task: Task): Promise<Task>;
  delete(task: Task): Promise<void>;
  defer(task: Task, days: number): Promise<Task>;
}

class TasksServiceImpl implements TasksService {
  private db;

  constructor({ db }: { db: TursoDB }) {
    this.db = db;
  }

  async getTodaysTasks(): Promise<Task[]> {
    const today = dateToday()
    return this.db.select().from(tasksTable).where(lte(tasksTable.dueDate, today)).all();
  }

  async create({ summary, description }: { summary: string, description: string }): Promise<Task> {
    const task = {
      summary,
      description,
      completed: false,
      dueDate: dateToday()
    }
    const [createdTask] = await this.db.insert(tasksTable).values(task).returning().all();
    return createdTask;
  }

  async update(task: Task): Promise<Task> {
    const [updatedTask] = await this.db.update(tasksTable).set(task).where(eq(tasksTable.id, task.id)).returning().all();
    return updatedTask;
  }

  async complete(task: Task): Promise<Task> {
    const [completedTask] = await this.db.update(tasksTable).set({ completed: true }).where(eq(tasksTable.id, task.id)).returning().all();
    return completedTask;
  }

  async uncomplete(task: Task): Promise<Task> {
    const [uncompletedTask] = await this.db.update(tasksTable).set({ completed: false }).where(eq(tasksTable.id, task.id)).returning().all();
    return uncompletedTask;
  }

  async delete(task: Task): Promise<void> {
    await this.db.delete(tasksTable).where(eq(tasksTable.id, task.id)).run();
  }

  async defer(task: Task, days: number): Promise<Task> {
    const newDueDate = new Date(task.dueDate);
    newDueDate.setDate(newDueDate.getDate() + days);
    const [deferredTask] = await this.db.update(tasksTable).set({ dueDate: newDueDate.toISOString().split('T')[0] }).where(eq(tasksTable.id, task.id)).returning().all();
    return deferredTask;
  }
}

export const tasksService: TasksService = new TasksServiceImpl({ db });


const dateToday = () => new Date().toISOString().split('T')[0]
