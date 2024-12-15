import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});

export type TursoDB = typeof db;

export default db;
