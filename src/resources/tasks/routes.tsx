import { Html, } from "@elysiajs/html";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import Elysia from "elysia";
import { getEnv } from "../../shared";
import { Page } from "../../web/Page";

export function addTasksRoutes(app: Elysia) {
  app.get('/', (context: HtmxContext) => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
      { id: 3, title: 'Task 3', completed: false },
    ];

    return (
      <Page env={getEnv()} partial={context.hx.request}>
        <h1>Task List</h1>
        <TaskList tasks={tasks} />
        <sl-button class="m-4" variant="outline" hx-post="/post" hx-swap="outerHTML">Click me</sl-button>
        <button _="on click toggle .bg-red-500">Toggle background color with hyperscript</button>
      </Page>
    );
  });

  app.post("/post", (context: HtmxContext) =>
    <Page env={getEnv()} partial={context.hx.request} >
      <p>From the server! </p>
    </Page>);

  app.get("/tasks", (context: HtmxContext) =>
    <Page env={getEnv()} partial={context.hx.request} >
      // Insert a list of tasks
    </Page>);
}

type Task = { id: number, title: string, completed: boolean };

const TaskList = ({ tasks }: { tasks: Task[] }): JSX.Element => {
  return (
    <div class="flex flex-col gap-4 items-center">
      {tasks.map((task, index) => (
        <sl-details
          id={`task-${index}`}
          class="w-2/3 max-w-md"
          summary={task.title}
        >
          <p>ID: {task.id}</p>
          <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
        </sl-details>
      ))}
    </div>
  );
}
