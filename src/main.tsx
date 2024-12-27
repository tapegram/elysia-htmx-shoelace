import { Html, html } from "@elysiajs/html";
import open from "open";
import staticPlugin from "@elysiajs/static";
import { tailwind } from "@gtramontina.com/elysia-tailwind";
import { Elysia, redirect, } from "elysia";
import { ElysiaWS } from "elysia/dist/ws";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { getEnv } from "./shared";
import { logger } from "@grotto/logysia";
import { oauth2 } from "elysia-oauth2";
import { jwt } from "@elysiajs/jwt";
import { tasksService } from "./resources/tasks/service";

import { t } from "elysia";
import { usersService } from "./resources/users/service";
import { TaskDetail } from "./resources/tasks/components/TaskDetail";
import { TaskItem } from "./resources/tasks/components/TaskItem";
import { Page } from "./web/Page";
import { NewTaskDialog } from "./resources/tasks/components/NewTaskDialog";
import { TaskList } from "./resources/tasks/components/TaskList";
import { ListenCallback } from "elysia/dist/universal/server";

declare global {
  var ws: ElysiaWS<any, any>
  var isOpened: boolean
}

export default function main() {
  const app = new Elysia()
  app
    .use(
      jwt({
        name: "session",
        secret: process.env.JWT_SECRET!,
      })
    )
    .use(html())
    .use(logger())
    .use(staticPlugin())
    .use(htmx())
    .use(tailwind({
      path: "/public/css/style.css",
      source: "./src/style.css",
      config: "./tailwind.config.js",
      options: {
        autoprefixer: false
      },
    }))
    .use(
      oauth2({
        GitHub: [
          process.env.GITHUB_CLIENT_ID!,
          process.env.GITHUB_CLIENT_SECRET!,
          process.env.FRONTEND_URL! + "/auth/github/callback",
        ]
      })
    )
    .use(authController)
    .guard({
      async beforeHandle({ session, cookie: { auth } }) {
        if (!auth) {
          return redirect("/auth/github")
        }
        if (!session) {
          return redirect("/auth/github")
        }
        const userSession = await session.verify(auth.value)
        if (!userSession) {
          return redirect("/auth/github")
        }
      }
    })
    .use(tasksController)
    .get('/', () => {
      return redirect("/tasks")
    })


  if (getEnv() === "development") {
    // This will call app.listen
    enableLiveReload(app)
  } else {
    app.listen(process.env.PORT || 3000)
  }
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

  const port = process.env.PORT || 3000
  app.listen(port, callback)
}

const tasksController =
  new Elysia({ prefix: "/tasks" })
    .post("/:id/complete", async ({ params: { id } }) => {
      await tasksService.complete(parseInt(id))
      // On complete, remove from the list, so return nothing
      return ""
    })

    .get("/:id", async ({ params: { id } }) => {
      const task = await tasksService.getTaskById(parseInt(id));
      return <TaskDetail task={task} />
    })

    .delete("/:id", async ({ params: { id } }) => {
      await tasksService.delete(parseInt(id))
      // On delete, remove from the list, so return nothing
      return ""
    })

    .put("/:id", async ({ params: { id }, body }) => {
      const updatedTask = await tasksService.updateTask(parseInt(id), {
        summary: body.summary,
        description: body.description,
      });
      return <TaskItem task={updatedTask} />
    },
      {
        body: t.Object({
          summary: t.String(),
          description: t.String()
        }),
      }
    )

    .post("/:id/defer", async ({ params: { id } }) => {
      await tasksService.defer(parseInt(id), 1)
      // On defer, remove for now, bring it back on the right date
      return ""
    })

    .post("/", async ({ session, cookie: { auth }, body }) => {
      const userSession = await session.verify(auth.value)
      const newTask = await tasksService.create({
        summary: body.summary,
        description: body.description,
        userId: userSession.id,
      })

      return <li class="my-10" > <TaskItem task={newTask} /></li >
    },
      {
        body: t.Object({
          summary: t.String(),
          description: t.String()
        }),
      }
    )

    .get("/", async ({ session, cookie: { auth }, hx }) => {

      const userSession = await session.verify(auth.value)
      const tasks = await tasksService.getTodaysTasks({ userId: userSession.id });

      return <Page
        env={getEnv()}
        partial={hx.request}
      >
        <span
          class="w-full"
        >
          <NewTaskDialog />
          <TaskList tasks={tasks} />
        </span>
      </Page>
    })

const authController =
  new Elysia({ prefix: "/auth" })
    .get("/github", async ({ oauth2 }) =>
      oauth2.redirect("GitHub", [])
    )
    .get("/github/callback", async ({ oauth2, session, cookie: { auth } }) => {
      const token = await oauth2.authorize("GitHub");

      // Fetch user information from GitHub API
      const response = await fetch("https://api.github.com/user", {
        headers: {
          'Authorization': `Bearer ${token.accessToken()}`,
          'Accept': "application/vnd.github+json",
          'X-GitHub-Api-Version': "2022-11-28",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch user information from GitHub");
        return;
      }

      const { id } = await response.json();
      const user = await usersService.getOrCreateUser({ githubId: id });

      auth.set({
        value: await session.sign({ id: user.id }),
        httpOnly: true,
        maxAge: 7 * 86400,
      })

      return redirect("/")
    })
