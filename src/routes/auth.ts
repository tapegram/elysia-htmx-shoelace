import { Elysia } from "elysia";
import { authService } from "../services/auth";
import { getGithubUser } from "../services/github";
import { cookie } from "@elysiajs/cookie";

export function addAuthRoutes(app: Elysia) {
  app.use(cookie());

  app.get("/auth/github", () => {
    const githubUrl = new URL("https://github.com/login/oauth/authorize");
    githubUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
    githubUrl.searchParams.set("scope", "user:email");
    return Response.redirect(githubUrl.toString());
  });

  app.get("/auth/github/callback", async ({ query, setCookie }) => {
    const { code } = query;
    
    if (!code) {
      return Response.redirect("/?error=oauth_failed");
    }

    try {
      const githubUser = await getGithubUser(code);
      const user = await authService.findOrCreateUser(githubUser);
      const sessionId = await authService.createUserSession(user.id);

      setCookie("session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      return Response.redirect("/");
    } catch (error) {
      console.error("OAuth error:", error);
      return Response.redirect("/?error=oauth_failed");
    }
  });

  app.get("/auth/logout", ({ removeCookie }) => {
    removeCookie("session");
    return Response.redirect("/");
  });
} 