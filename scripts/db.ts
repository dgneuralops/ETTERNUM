import { config } from "dotenv";
import { createDatabase } from "../src/lib/db/connect";
import * as schema from "../src/lib/db/schema";

config({ path: [".env.local", ".env"], quiet: true });

export async function connect() {
  const { isDemoDatabase, migrateDemoDatabase } = await import("../src/lib/db/connect");
  const { db, close } = createDatabase();
  if (isDemoDatabase()) await migrateDemoDatabase(db);
  return { db, schema, close };
}
