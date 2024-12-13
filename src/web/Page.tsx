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
      {children}
    </body>
  </html>)
}


