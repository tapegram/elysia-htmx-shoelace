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
      { id: 1, title: 'Task 1', completed: false, description: 'This is a description for Task 1' },
      { id: 2, title: 'Task 2', completed: true },
      { id: 3, title: 'Task 3', completed: false },
    ];

    return <Page env={getEnv()} partial={context.hx.request} >
      <TaskList tasks={tasks} />
    </Page>
  })
}

type Task = { id: number, title: string, completed: boolean, description?: string };

const TaskList = ({ tasks }: { tasks: Task[] }): JSX.Element => {
  return (
    <div class="flex flex-col gap-4 items-center">
      {tasks.map((task, index) => (
        <sl-animation name="pulse" duration="500" iterations="1" easing="easeOutCubic">
          <sl-details
            _={`on mousedown
                  halt the event
                end
                on focus 
                  halt the event
                  add @play to the closest <sl-animation />
                  then remove @open from <sl-details /> in the closest <div />
                  then add @open to me
                end
                on keyup if the event's key is 'x' call alert('delete') end
                on keyup if the event's key is 't' call alert('tomorrow') end
                on keyup if the event's key is 'e' call alert('completed')`}
            id={`task-${index}`}
            class="w-4/5"
            summary={task.title}
          >
            <p class="text-gray-700 mb-2">{task.description}</p>
            <div class="flex gap-2 justify-end mt-4">
              <sl-button tabindex={-1} variant="default" onclick="alert('delete')">
                <sl-icon name="trash"></sl-icon>
              </sl-button>
              <sl-button tabindex={-1} variant="default" onclick="alert('tomorrow')">
                <sl-icon name="clock"></sl-icon>
              </sl-button>
              <sl-button tabindex={-1} variant="default" onclick="alert('completed')">
                <sl-icon name="check2"></sl-icon>
              </sl-button>
            </div>
          </sl-details>
        </sl-animation>
      ))
      }
    </div >
  );
}
