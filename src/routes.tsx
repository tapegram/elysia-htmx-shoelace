import { html, Html } from "@elysiajs/html";
import Elysia from "elysia";
import db from "./db/connection";
import { usersTable } from "./db/schema";

export default function addRoutes(app: Elysia) {
  app.get('/', () =>
    <Page>
      <h1> Hello World </h1>
      <sl-button class="m-4" variant="danger" onclick="alert('hello')"> Click me </sl-button>
      <sl-input></sl-input>
    </Page>
  );
  app.get("/items", async () => {
    const data = await db.select().from(usersTable);
    return data;
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
