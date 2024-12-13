import { Html } from "@elysiajs/html"
import { Environment } from "../shared"

export const Page = ({ children, env, partial }: { children: JSX.Element[] | JSX.Element, env: Environment, partial: boolean, }): JSX.Element => {
  return partial ? <>{children}</> : (<html lang='en' >
    <head>
      <title>Hello World</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/themes/light.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/shoelace-autoloader.js"></script>
      <link rel="stylesheet" href="/public/css/style.css" />
      <script type="module" src="/public/js/htmx.min.js" ></script>
      {env === "development" && <script type="text/javascript" src="/public/js/livereload.js">
      </script>}
      <script src="https://unpkg.com/hyperscript.org@0.9.13"></script>
    </head>
    <body class="p-8">
      <nav class="navbar bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
          <a tabindex={-1} href="/" class="navbar-brand text-white text-xl">the board</a>
          <ul class="navbar-nav flex space-x-4">
            <li class="nav-item">
              <a tabindex={-1} href="/" class="nav-link text-white">home</a>
            </li>
            <li class="nav-item">
              <a tabindex={-1} href="/about" class="nav-link text-white">about</a>
            </li>
            <li class="nav-item">
              <a tabindex={-1} href="/contact" class="nav-link text-white">contact</a>
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


