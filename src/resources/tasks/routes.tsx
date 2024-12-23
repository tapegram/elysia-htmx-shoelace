import { Html, } from "@elysiajs/html";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import Elysia, { redirect, t } from "elysia";
import { getEnv } from "../../shared";
import { Page } from "../../web/Page";
import { tasksService } from "./service";
import { NewTaskDialog } from "./components/NewTaskDialog";
import { TaskItem } from "./components/TaskItem";
import { TaskDetail } from "./components/TaskDetail";
import { TaskList } from "./components/TaskList";
import { requireAuth } from "../../middleware/requireAuth";

export function addTasksRoutes(app: Elysia) {
  app.group("/tasks", app => app
    .use(requireAuth())
    .get("/", async ({ hx, user }) => {
      const tasks = await tasksService.getTodaysTasks(user.id);
      return <Page
        env={getEnv()}
        partial={hx.request}
      >
        <span class="w-full">
          <NewTaskDialog />
          <TaskList tasks={tasks} />
        </span>
      </Page>
    })
    .post("/:id/complete", async ({ params: { id } }) => {
      await tasksService.complete(parseInt(id))
      return ""
    })
    .get("/:id", async ({ params: { id }, user }) => {
      const task = await tasksService.getTaskById(parseInt(id), user.id);
      return <TaskDetail task={task} />
    })
    .delete("/:id", async ({ params: { id } }) => {
      await tasksService.delete(parseInt(id))
      return ""
    })
    .put("/:id", async ({ params: { id }, body }) => {
      const updatedTask = await tasksService.updateTask(parseInt(id), {
        summary: body.summary,
        description: body.description,
      });
      return <TaskItem task={updatedTask} />
    })
    .post("/:id/defer", async ({ params: { id } }) => {
      await tasksService.defer(parseInt(id), 1)
      return ""
    })
    .post("/", async ({ body, user }) => {
      const newTask = await tasksService.create({
        summary: body.summary,
        description: body.description,
        userId: user.id
      })
      return <li class="my-10"><TaskItem task={newTask} /></li>
    })
  );

  app.get("/", () => {
    return Response.redirect("/tasks")
  });
}




