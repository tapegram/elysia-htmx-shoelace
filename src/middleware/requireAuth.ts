import { Elysia } from "elysia";
import { authMiddleware, AuthContext } from "./auth";

export function requireAuth() {
  return new Elysia()
    .use(authMiddleware())
    .derive((auth: AuthContext) => {
      console.log("isAuthenticated", auth.isAuthenticated)
      if (!auth.isAuthenticated) {
        return Response.redirect("/auth/github");
      }
    });
} 