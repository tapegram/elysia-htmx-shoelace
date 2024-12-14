import { Html, } from "@elysiajs/html";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import Elysia, { redirect, t } from "elysia";
import { getEnv } from "../../shared";
import { Page } from "../../web/Page";

export function addTasksRoutes(app: Elysia) {
  app.get('/', () => {
    return redirect("/tasks")
  })

  app.post("/tasks", ({ body }) => {
    const newTask = {
      id: 4,
      title: body.summary,
      completed: false,
      description: body.description,
    }

    return <TaskItem task={newTask} />
  },
    {
      body: t.Object({
        summary: t.String(),
        description: t.String()
      }),
    }
  );

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
      {tasks.map((task) => (
        TaskItem({ task })
      ))
      }
    </div >
  );
}

const TaskItem = ({ task }: { task: Task }): JSX.Element => {

  return <sl-animation name="pulse" duration="500" iterations="1" easing="easeOutCubic">
    <sl-details
      _={`
                on focus 
                  add @play to the closest <sl-animation />
                end
                on keyup if the event's key is 'x' call #task-${task.id}-delete.click() end
                on keyup if the event's key is 't' call #task-${task.id}-defer.click() end
                on keyup if the event's key is 'e' call #task-${task.id}-complete.click() end
            `}
      id={`task-${task.id}`}
      class="w-4/5"
      summary={task.title}
    >
      <sl-textarea _="on keyup halt the event" class="text-gray-700 mb-2" resize="auto" value={task.description} />
      <div class="flex gap-2 justify-end mt-4">
        <sl-button tabindex={-1} id={`task-${task.id}-delete`} variant="default" onclick="alert('delete')">
          <sl-icon name="trash"></sl-icon>
        </sl-button>
        <sl-button tabindex={-1} id={`task-${task.id}-defer`} variant="default" onclick="alert('tomorrow')">
          <sl-icon name="clock"></sl-icon>
        </sl-button>
        <sl-button tabindex={-1} id={`task-${task.id}-complete`} variant="default" onclick="alert('completed')">
          <sl-icon name="check2"></sl-icon>
        </sl-button>
      </div>
    </sl-details>
  </sl-animation>
}
