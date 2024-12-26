import { Html } from "@elysiajs/html";
import { Task } from "../service";

export const TaskItem = ({ task }: { task: Task }): JSX.Element => {
  return <sl-animation
    id={`task-${task.id}`}
    name="pulse"
    duration="500"
    iterations="1"
    easing="easeOutCubic"
    _={`
            on keyup if the event's key is 'x' call #task-${task.id}-delete.click() end
            on keyup if the event's key is 't' call #task-${task.id}-defer.click() end
            on keyup if the event's key is 'e' call #task-${task.id}-complete.click() end
            `}
    hx-on="click"
    hx-get={`/tasks/${task.id}`}
    hx-target="#modal-target"
    hx-swap="innerHTML"
  >
    <sl-card
      class="w-full"
      _="on click halt the event"
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
