import "server-only";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { etternumDb?: NodePgDatabase<typeof schema> };

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não configurada.");
  const pool = new Pool({ connectionString, max: 5 });
  return drizzle(pool, { schema });
}

/** Conexão única por processo (evita abrir pools novos a cada recarga em dev). */
export const db: NodePgDatabase<typeof schema> = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    globalForDb.etternumDb ??= createDb();
    const real = globalForDb.etternumDb;
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
