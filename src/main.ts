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
import { oauth2 } from "elysia-oauth2";
import jwt from "@elysiajs/jwt";

declare global {
  var ws: ElysiaWS<any, any, any>
  var isOpened: boolean
}

export default function main() {
  const app = new Elysia()

  app.use(
    jwt({
      name: 'boardsession',
      secret: process.env.JWT_SECRET!,
    })
  )

  app.use(
    oauth2({
      GitHub: [
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_CLIENT_SECRET!,
        process.env.FRONTEND_URL! + "/auth/github/callback",
      ]
    })
  )
    .get("/auth/github", async ({ oauth2 }) =>
      oauth2.redirect("GitHub", [])
    )
    .get("/auth/github/callback", async ({ oauth2, boardsession, cookie: { auth } }) => {
      const token = await oauth2.authorize("GitHub");
      console.log(token);

      console.log("before repsonse");
      console.log(token.accessToken())
      // Fetch user information from GitHub API
      const response = await fetch("https://api.github.com/user", {
        headers: {
          'Authorization': `Bearer ${token.accessToken()}`,
          'Accept': "application/vnd.github+json",
          'X-GitHub-Api-Version': "2022-11-28",
        },
      });
      console.log("response", response);

      if (!response.ok) {
        console.error("Failed to fetch user information from GitHub");
        return;
      }

      const user = await response.json();
      console.log("GitHub User ID:", user.id);
    })



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
  app.use(tailwind({
    path: "/public/css/style.css",
    source: "./src/style.css",
    config: "./tailwind.config.js",
    options: {
      autoprefixer: false
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

