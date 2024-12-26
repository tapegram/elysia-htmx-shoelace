import jwt from "@elysiajs/jwt";
import Elysia, { redirect } from "elysia";
import { oauth2 } from "elysia-oauth2";
import { usersService } from "./service";


export function addAuthRoutes(app: Elysia) {
  app.use(
    jwt({
      name: 'session',
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
    .get("/auth/github/callback", async ({ oauth2, session, cookie: { auth } }) => {
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

}
