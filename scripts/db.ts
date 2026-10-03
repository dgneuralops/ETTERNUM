import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/lib/db/schema";

config({ path: [".env.local", ".env"], quiet: true });

export function connect() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada (.env.local).");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return { db: drizzle(pool, { schema }), pool, schema };
}
