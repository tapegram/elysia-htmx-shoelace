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

export function addTasksRoutes(app: Elysia) {
  app.get('/', () => {
    return redirect("/tasks")
  })

  app.post("/tasks/:id/complete", async ({ params: { id } }) => {
    await tasksService.complete(parseInt(id))
    // On complete, remove from the list, so return nothing
    return ""
  });

  app.get("/tasks/:id", async ({ params: { id } }) => {
    const task = await tasksService.getTaskById(parseInt(id));
    return <TaskDetail task={task} />
  });

  app.delete("/tasks/:id", async ({ params: { id } }) => {
    await tasksService.delete(parseInt(id))
    // On delete, remove from the list, so return nothing
    return ""
  });

  app.put("/tasks/:id", async ({ params: { id }, body }) => {
    const updatedTask = await tasksService.updateTask(parseInt(id), {
      summary: body.summary,
      description: body.description,
    });
    return <TaskItem task={updatedTask} />
  },
    {
      body: t.Object({
        summary: t.String(),
        description: t.String()
      }),
    }
  );

  app.post("/tasks/:id/defer", async ({ params: { id } }) => {
    await tasksService.defer(parseInt(id), 1)
    // On defer, remove for now, bring it back on the right date
    return ""
  });


  app.post("/tasks", async ({ session, cookie: { auth }, body }) => {
    const userSession = await session.verify(auth.value)
    console.log("userId", userSession)
    const newTask = await tasksService.create({
      summary: body.summary,
      description: body.description,
      userId: userSession.id,
    })

    return <li class="my-10"><TaskItem task={newTask} /></li>
  },
    {
      body: t.Object({
        summary: t.String(),
        description: t.String()
      }),
    }
  );


  app.get("/tasks", async ({ session, cookie: { auth }, hx }) => {

    const userSession = await session.verify(auth.value)
    console.log("userId", userSession)
    const tasks = await tasksService.getTodaysTasks({ userId: userSession.id });

    return <Page
      env={getEnv()}
      partial={hx.request}
    >
      <span
        class="w-full"
      >
        <NewTaskDialog />
        <TaskList tasks={tasks} />
      </span>
    </Page>
  })
}




