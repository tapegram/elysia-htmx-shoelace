import { html, Html } from "@elysiajs/html";
import Elysia from "elysia";
import { turso } from "./db/connection";

export default function addRoutes(app: Elysia) {
  app.get('/', () =>
    <Page>
      <h1> Hello World </h1>
      <sl-button class="m-2" onclick="alert('hello')"> Click me </sl-button>
    </Page>
  );
  app.get("/items", async () => {
    const { rows } = await turso.execute("SELECT * FROM items");
    return rows;
  });
}


const Page = ({ children }: { children: JSX.Element[] }) =>
  <html lang='en' >
    <head>
      <title>Hello World </title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/themes/light.css" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.19.0/cdn/shoelace-autoloader.js"></script>
      <link rel="stylesheet" href="/public/css/style.css" />
      <script type="module" src="/public/js/htmx.min.js" ></script>
      <script type="text/javascript" src="/public/js/livereload.js">
      </script>
    </head>
    <body>
      {children}
    </body>
  </html>
