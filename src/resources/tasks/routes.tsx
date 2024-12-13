import { Html, } from "@elysiajs/html";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import Elysia, { redirect } from "elysia";
import { getEnv } from "../../shared";
import { Page } from "../../web/Page";

export function addTasksRoutes(app: Elysia) {
  app.get('/', () => {
    return redirect("/tasks")
  })

  app.get("/tasks", (context: HtmxContext) => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
      { id: 3, title: 'Task 3', completed: false },
    ];

    return <Page env={getEnv()} partial={context.hx.request} >
      <TaskList tasks={tasks} />
    </Page>
  })
}

type Task = { id: number, title: string, completed: boolean };

const TaskList = ({ tasks }: { tasks: Task[] }): JSX.Element => {
  return (
    <div class="flex flex-col gap-4 items-center">
      {tasks.map((task, index) => (
        <sl-animation name="bounce" duration="500" iterations="1" easing="easeOutCubic">
          <sl-details
            _="on focus add @play to the closest <sl-animation /> "
            id={`task-${index}`}
            class="w-2/3 max-w-md"
            summary={task.title}
          >
            <p>ID: {task.id}</p>
            <p>Completed: {task.completed ? 'Yes' : 'No'}</p>
          </sl-details>
        </sl-animation>
      ))}
    </div>
  );
}
