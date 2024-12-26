import { Html } from "@elysiajs/html";

export const NewTaskDialog = (): JSX.Element => {
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
