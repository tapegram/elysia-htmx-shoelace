import { html, } from "@elysiajs/html";
import open from "open";
import staticPlugin from "@elysiajs/static";
import { tailwind } from "@gtramontina.com/elysia-tailwind";
import { Elysia, ListenCallback } from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import addRoutes from "./routes";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { getEnv } from "./shared";
import { logger } from "@grotto/logysia";

declare global {
  var ws: ElysiaWS<any, any, any>
  var isOpened: boolean
}

export default function main() {
  const app = new Elysia()

  applyPlugins(app)
  addRoutes(app)

  if (getEnv() === "development") {
    // This will call app.listen
    enableLiveReload(app)
  } else {
    app.listen(3000)
  }

}

function applyPlugins(app: Elysia) {
  app.use(html())
  app.use(logger())
  app.use(staticPlugin())
  app.use(htmx())
  app.use(tailwind({                           // 2. Use
    path: "/public/css/style.css",       // 2.1 Where to serve the compiled stylesheet;
    source: "./src/style.css",        // 2.2 Specify source file path (where your @tailwind directives are);
    config: "./tailwind.config.js",       // 2.3 Specify config file path or Config object;
    options: {                            // 2.4 Optionally Specify options:
      autoprefixer: false               // 2.4.3 Whether to use autoprefixer;
    },
  }))

}

function enableLiveReload(app: Elysia) {
  app.ws(`/live-reload`, {
    open: (ws) => {
      globalThis.ws = ws
    }
  })

  // open browser if first execution, otherwise reload active browser tab
  const callback: ListenCallback = async ({ hostname, port, }) => {
    if (!globalThis.isOpened) {
      globalThis.isOpened = true
      open(`http://${hostname}:${port}`)
    }

    if (globalThis.ws) {
      console.log("Reloading...")
      globalThis.ws.send('live-reload')
    }

  }

  app.listen(3000, callback)
}

