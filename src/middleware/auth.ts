import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { authService } from "../services/auth";
import { User } from "../db/schema";

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
}

export function authMiddleware() {
  return new Elysia()
    .use(cookie())
    .derive(async ({ cookie }): Promise<AuthContext> => {
      const sessionId = cookie.session;
      const user = sessionId ? await authService.getUserBySession(sessionId) : null;
      
      return {
        user,
        isAuthenticated: !!user,
      };
    });
} 