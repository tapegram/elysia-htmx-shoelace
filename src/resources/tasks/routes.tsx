import { Html, } from "@elysiajs/html";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import Elysia, { redirect, t } from "elysia";
import { getEnv } from "../../shared";
import { Page } from "../../web/Page";
import { Task, tasksService } from "./service";

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


  app.post("/tasks", async ({ body }) => {
    const newTask = await tasksService.create({
      summary: body.summary,
      description: body.description,
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


  app.get("/tasks", async (context: HtmxContext) => {
    const tasks = await tasksService.getTodaysTasks();

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

const NewTaskDialog = (): JSX.Element => {
  return (
    <sl-dialog
      id="new-task-dialog"
      label="new task"
      _="on keyup halt the event"
    >
      <div class="flex flex-col gap-4 items-center h-full w-full">
        <form
          hx-post="/tasks"
          hx-target="#tasks-list"
          hx-swap="afterbegin"
          _="on htmx:afterRequest
               if (event.detail.successful) 
                then remove @open from #new-task-dialog
                then call me.reset()
              end
              on keyup if the event's key is 'Tab' halt the event end
              on keyup if the event's key is 't' halt the event end
              on keyup if the event's key is 'x' halt the event end
              on keyup if the event's key is 'e' halt the event end
              on htmx:confirm
                call my checkValidity()
                if the result is false
                  call my reportValidity()
                  halt the event
              end
              on keydown[(ctrlKey or metaKey) and key == 'Enter']
                call my checkValidity()
                if the result is true
                  trigger submit
                otherwise
                  call my reportValidity()
          "
          class="flex flex-col gap-4 items-center w-100% h-full w-full"
        >
          <sl-input
            id="new-task-dialog-summary-input"
            autofocus
            required
            size="small"
            label="summary"
            name="summary"
            maxlength={50}
            placeholder="Go to the store"
            class="flex-grow w-full" />
          <sl-textarea
            is="new-task-dialog-description-textarea"
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
    <ol
      id="tasks-list"
    >
      {
        tasks.map((task) =>
          <li class="my-10"><TaskItem task={task} /></li>
        )
      }
    </ol>
  );
}

const TaskDetail = ({ task }: { task: Task }): JSX.Element => {
  return (
    <sl-dialog
      id={`task-detail-dialog-${task.id}`}
      label="Task Detail"
      open
      _="on keyup halt the event"
    >
      <div class="task-detail">
        <h1>{task.summary}</h1>
        <p>{task.description}</p>
        <form
          hx-put={`/tasks/${task.id}`}
          hx-target={`#task-${task.id}`}
          hx-swap="outerHTML"
          class="flex flex-col gap-4 items-center w-full"
        >
          <sl-input
            id="task-detail-summary-input"
            required
            autofocus
            size="small"
            label="summary"
            name="summary"
            maxlength={50}
            value={task.summary}
            class="flex-grow w-full" />
          <sl-textarea
            id="task-detail-description-textarea"
            label="description"
            name="description"
            value={task.description}
            resize="none"
            size="small"
            class="w-full" />
          <sl-button
            id="task-detail-submit-button"
            type="submit"
            variant="primary"
            class="ml-auto w-20">
            Save
          </sl-button>
        </form>
      </div>
    </sl-dialog>
  );
}

const TaskItem = ({ task }: { task: Task }): JSX.Element => {

  return <sl-animation name="pulse" duration="500" iterations="1" easing="easeOutCubic">
    <sl-card
      _={`
            on keyup if the event's key is 'x' call #task-${task.id}-delete.click() end
            on keyup if the event's key is 't' call #task-${task.id}-defer.click() end
            on keyup if the event's key is 'e' call #task-${task.id}-complete.click() end
            `}
      id={`task-${task.id}`}
      class="w-full"
      hx-get={`/tasks/${task.id}`}
      hx-target="this"
      hx-swap="outerHTML"

    >
      <div class="flex justify-between items-center w-full">
        <p>{task.summary}</p>
        <sl-button-group >
          <sl-tooltip content="delete (x)">
            <sl-button
              tabindex={-1}
              id={`task-${task.id}-delete`}
              data-task-delete-button
              hx-delete={`/tasks/${task.id}`}
              hx-target={`#task-${task.id}`}
              hx-swap="outerHTML swap:500ms"
              variant="default"
              _={`on htmx:afterRequest
                  if (event.detail.successful) 
                    -- Animate the element being removed
                    then add @name=fadeOutLeft to closest <sl-animation />
                    then add @play to closest <sl-animation />

                    -- Set focus on next element
                    then set currentItem to me
                    then set nextItem to next <sl-card/> from currentItem with wrapping
                    then wait 300ms
                    then add .task-card--selected to nextItem
                    then go to nextItem -500px smoothly
                    then add @play to nextItem.parentElement
                  end
                `}
            >
              <sl-icon name="trash"></sl-icon>
            </sl-button>
          </sl-tooltip>
          <sl-tooltip content="do tomorrow (t)">
            <sl-button
              tabindex={-1}
              data-task-defer-button
              id={`task-${task.id}-defer`}
              variant="default"
              hx-post={`/tasks/${task.id}/defer`}
              hx-target={`#task-${task.id}`}
              hx-swap="outerHTML swap:500ms"
              _={`on htmx:afterRequest
                  if (event.detail.successful) 
                    -- Animate the element being removed
                    then add @name=fadeOutLeft to closest <sl-animation />
                    then add @play to closest <sl-animation />

                    -- Set focus on next element
                    then set currentItem to me
                    then set nextItem to next <sl-card/> from currentItem with wrapping
                    then wait 300ms
                    then add .task-card--selected to nextItem
                    then go to nextItem -500px smoothly
                    then add @play to nextItem.parentElement
                  end
                `}
            >
              <sl-icon name="clock"></sl-icon>
            </sl-button>
          </sl-tooltip>
          <sl-tooltip content="done! (e)">
            <sl-button
              tabindex={-1}
              data-task-complete-button
              id={`task-${task.id}-complete`}
              hx-post={`/tasks/${task.id}/complete`}
              hx-target={`#task-${task.id}`}
              variant="default"
              hx-swap="outerHTML swap:500ms"
              _={`on htmx:afterRequest
                  if (event.detail.successful) 
                    -- Animate the element being removed
                    then add @name=fadeOutLeft to closest <sl-animation />
                    then add @play to closest <sl-animation />

                    -- Set focus on next element
                    then set currentItem to me
                    then set nextItem to next <sl-card/> from currentItem with wrapping
                    then wait 300ms
                    then add .task-card--selected to nextItem
                    then go to nextItem -500px smoothly
                    then add @play to nextItem.parentElement
                  end
                `}
            >
              <sl-icon name="check2"></sl-icon>
            </sl-button>
          </sl-tooltip>
        </sl-button-group>
      </div>
    </sl-card>
  </sl-animation >
}
