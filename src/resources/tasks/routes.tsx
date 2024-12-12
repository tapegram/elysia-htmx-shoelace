import { Html, } from "@elysiajs/html";
import { HtmxContext } from "@gtramontina.com/elysia-htmx";
import Elysia from "elysia";
import { getEnv } from "../../shared";
import { Page } from "../../web/Page";

export function addTasksRoutes(app: Elysia) {
  app.get('/', (context: HtmxContext) =>
    <Page env={getEnv()} partial={context.hx.request}>
      <h1>Hello World</h1>
      <sl-button class="m-4" variant="outline" hx-post="/post" hx-swap="outerHTML" > Click me </sl-button>
      <button _="on click toggle .bg-red-500" > Toggle background color with hyperscript </button>
    </Page >
  );

  app.post("/post", (context: HtmxContext) =>
    <Page env={getEnv()} partial={context.hx.request} >
      <p>From the server! </p>
    </Page>);
}
