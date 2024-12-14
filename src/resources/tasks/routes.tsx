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

    return <Page
      env={getEnv()}
      partial={context.hx.request}
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

type Task = { id: number, title: string, completed: boolean, description?: string };

const NewTaskDialog = (): JSX.Element => {
  return (
    <sl-dialog
      id="new-task-dialog"
      label="new task"
    >
      <div class="flex flex-col gap-4 items-center h-full w-full">
        <form hx-post="/tasks" class="flex flex-col gap-4 items-center w-100% h-full w-full">
          <sl-input
            autofocus
            required
            size="small"
            label="summary"
            name="summary"
            placeholder="Go to the store"
            class="flex-grow w-full" />
          <sl-textarea
            required
            label="description"
            name="description"
            placeholder="Buy some milk, eggs, and bread."
            resize="none"
            size="small"
            class="w-full" />

          <sl-button
            id="new-task-dialog-submit-button"
            type="submit"
            slot="footer"
            variant="primary"
            class="ml-auto w-20">
            add
          </sl-button>
        </form>
      </div>
    </sl-dialog>
  )
}


const TaskList = ({ tasks }: { tasks: Task[] }): JSX.Element => {
  return (
    <div class="flex flex-col gap-4 items-center">
      {tasks.map((task, index) => (
        <sl-animation name="pulse" duration="500" iterations="1" easing="easeOutCubic">
          <sl-details
            _={`
                on focus 
                  remove @open from <sl-details /> in closest <div />
                  then wait 5ms
                  add @play to the closest <sl-animation />
                  then wait 150ms
                  then add @open to me
                end
                on keyup if the event's key is 'x' call #task-${index}-delete.click() end
                on keyup if the event's key is 't' call #task-${index}-defer.click() end
                on keyup if the event's key is 'e' call #task-${index}-complete.click() end
            `}
            id={`task-${index}`}
            class="w-4/5"
            summary={task.title}
          >
            <sl-textarea _="on keyup halt the event" class="text-gray-700 mb-2" resize="auto" value={task.description} />
            <div class="flex gap-2 justify-end mt-4">
              <sl-button tabindex={-1} id={`task-${index}-delete`} variant="default" onclick="alert('delete')">
                <sl-icon name="trash"></sl-icon>
              </sl-button>
              <sl-button tabindex={-1} id={`task-${index}-defer`} variant="default" onclick="alert('tomorrow')">
                <sl-icon name="clock"></sl-icon>
              </sl-button>
              <sl-button tabindex={-1} id={`task-${index}-complete`} variant="default" onclick="alert('completed')">
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
