import { eq } from "drizzle-orm";
import db from "../db/connection";
import { sessionsTable, usersTable } from "../db/schema";
import { createId } from "@paralleldrive/cuid2";

export interface OAuthUser {
  provider: string;
  providerId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}

export class AuthService {
  async createUserSession(userId: number): Promise<string> {
    const sessionId = createId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day session

    await db.insert(sessionsTable).values({
      id: sessionId,
      userId,
      expiresAt: expiresAt.toISOString(),
    });

    return sessionId;
  }

  async getUserBySession(sessionId: string) {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, sessionId))
      .all();

    if (!session) return null;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.userId))
      .all();

    return user;
  }

  async findOrCreateUser(oauthUser: OAuthUser) {
    // Try to find existing user
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(
        eq(usersTable.providerId, oauthUser.providerId)
      )
      .all();

    if (existingUser) {
      // Update tokens
      await db
        .update(usersTable)
        .set({
          accessToken: oauthUser.accessToken,
          refreshToken: oauthUser.refreshToken,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(usersTable.id, existingUser.id));

      return existingUser;
    }

    // Create new user
    const [newUser] = await db
      .insert(usersTable)
      .values({
        email: oauthUser.email,
        name: oauthUser.name,
        avatarUrl: oauthUser.avatarUrl,
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
        accessToken: oauthUser.accessToken,
        refreshToken: oauthUser.refreshToken,
      })
      .returning()
      .all();

    return newUser;
  }
}

export const authService = new AuthService(); 