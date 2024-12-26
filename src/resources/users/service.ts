import db from "../../db/connection";
import { eq, } from 'drizzle-orm/expressions';
import { usersTable } from "../../db/schema";

export type UserId = User["id"]
export type User = typeof usersTable.$inferSelect;

interface UsersService {
  getOrCreateUser({ githubId }: { githubId: number }): Promise<User>;
}

class UsersServiceImpl implements UsersService {
  async getOrCreateUser({ githubId }: { githubId: number }): Promise<User> {
    const user = await this.findUserByGithubId(githubId);
    if (user) {
      return user;
    }
    return this.createUser({ githubId });
  }

  private async findUserByGithubId(githubId: number): Promise<User | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.githubId, githubId));
    return user || null;
  }

  private async createUser({ githubId }: { githubId: number }): Promise<User> {
    const [newUser] = await db.insert(usersTable).values({ githubId }).returning();
    return newUser;
  }
}

export const usersService: UsersService = new UsersServiceImpl();
