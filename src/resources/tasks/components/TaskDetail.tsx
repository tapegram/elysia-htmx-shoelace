import { Html, } from "@elysiajs/html";
import { Task } from "../service";

export const TaskDetail = ({ task }: { task: Task }): JSX.Element => {
  return (
    <sl-dialog
      id={`task-detail-dialog-${task.id}`}
      label="Task Detail"
      open
      _="
          on htmx:afterRequest
            if (event.detail.successful) 
              then remove me
            end
          end
          on keyup halt the event end
      "
    >
      <div class="task-detail">
        <form
          hx-put={`/tasks/${task.id}`}
          hx-target={`#task-${task.id}`}
          hx-swap="outerHTML"
          class="flex flex-col gap-4 items-center w-full"
          _="
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
