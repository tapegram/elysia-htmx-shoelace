import { Html } from "@elysiajs/html"
import { Environment } from "../shared"

export const Page = ({ children, env, partial }: { children: JSX.Element[] | JSX.Element, env: Environment, partial: boolean, }): JSX.Element => {
  return partial ? <>{children}</> : (<html lang='en' >
    <head>
      <title>Hello World</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/themes/light.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/shoelace-autoloader.js"></script>
      <link rel="stylesheet" href="/public/css/style.css" />
      <script src="https://unpkg.com/htmx.org@2.0.4"></script>
      {env === "development" && <script type="text/javascript" src="/public/js/livereload.js">
      </script>}
      <script src="https://unpkg.com/hyperscript.org@0.9.13"></script>
    </head>
    <body
      _="
          on keyup if the event's key is 'c' 
          then call #new-task-dialog.show() 
      "
      class="p-8">
      <nav class="navbar bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
          <a tabindex={-1} href="/" class="navbar-brand text-white text-xl">the board</a>
          <ul class="navbar-nav flex space-x-4">
            <li class="nav-item">
              <sl-icon-button tabindex={-1} name="pencil" label="Create new task" class="nav-link text-white" _="on click call #new-task-dialog.show()"></sl-icon-button>
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


