import { Html } from "@elysiajs/html"
import { Environment } from "../shared"

export const Page = ({ children, env, partial }: { children: JSX.Element[] | JSX.Element, env: Environment, partial: boolean, }): JSX.Element => {
  return partial ? <>{children}</> : (<html lang='en' >
    <head>
      <title>Hello World</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/themes/light.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/shoelace-autoloader.js"></script>
      <link rel="stylesheet" href="/public/css/style.css" />
      <script type="module" src="https://unpkg.com/htmx.org@2.0.4"></script>
      {env === "development" && <script type="text/javascript" src="/public/js/livereload.js">
      </script>}
      <script src="https://unpkg.com/hyperscript.org@0.9.13"></script>
    </head>
    <body
      _="
      
          -- Open the task composer
      
          on keyup if the event's key is 'c' 
            then call #new-task-dialog.show() 
          end
      
          -- Don't scroll the window when using the arrow keys
      
          on keydown from the window if the event's key is 'ArrowDown'
            then halt the event
          end
          on keydown from the window if the event's key is 'ArrowUp'
            then halt the event
          end
      
          -- Handle task actions
      
          on keyup if the event's key is 'x' 
            then set current to the first <sl-card.task-card--selected/>
            then if current is not null
              then set button to the first <sl-button[data-task-delete-button]/> in current
              then call button.click()
            end
          end
      
          on keyup if the event's key is 't' 
            then set current to the first <sl-card.task-card--selected/>
            then if current is not null
              then set button to the first <sl-button[data-task-defer-button]/> in current
              then call button.click()
            end
          end
      
          on keyup if the event's key is 'e' 
            then set current to the first <sl-card.task-card--selected/>
            then if current is not null
              then set button to the first <sl-button[data-task-complete-button]/> in current
              then call button.click()
            end
          end
      
          -- Use arrow keys to navigate tasks
      
          on keyup if the event's key is 'ArrowDown'
            then set currentItem to the first <sl-card.task-card--selected/>
            then if currentItem is null 
              then set nextItem to the first <sl-card/>
              else set nextItem to next <sl-card/> from currentItem with wrapping
            end
            then remove .task-card--selected from <sl-card/>
            then add .task-card--selected to nextItem
            then go to nextItem -500px smoothly
            then add @play to nextItem.parentElement
            then halt the event
          end
      
          on keyup if the event's key is 'ArrowUp'
            then set currentItem to the first <sl-card.task-card--selected/>
            then if currentItem is null 
              then set nextItem to the last <sl-card/>
              else set nextItem to previous <sl-card/> from currentItem with wrapping
            end
            then remove .task-card--selected from <sl-card/>
            then add .task-card--selected to nextItem
            then go to nextItem -500px smoothly
            then add @play to nextItem.parentElement
          end
      
          -- Open task detail modal on Enter key press
          on keyup if the event's key is 'Enter'
            then set currentItem to the first <sl-card.task-card--selected/>
            then if currentItem is not null
              then call currentItem.click()
            end
          end

      "
      class="p-8">
      <nav class="navbar bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
          <a tabindex={-1} href="/" class="navbar-brand text-white text-xl">the board</a>
          <ul class="navbar-nav flex space-x-4">
            <li class="nav-item">
              <sl-tooltip content="Create new task">
                <sl-icon-button tabindex={-1} name="pencil" label="Create new task" class="nav-link text-white" _="on click call #new-task-dialog.show()"></sl-icon-button>
              </sl-tooltip>
            </li>
          </ul>
        </div>
      </nav>
      <main class="m-8">
        {children}
      </main>
    </body>
  </html>)
}


