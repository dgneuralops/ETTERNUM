import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { Pool } from "pg";
import * as schema from "./schema";

export type Database = NodePgDatabase<typeof schema>;

/** Pasta do banco embutido usado no modo demonstração (relativa à raiz do projeto). */
export const DEMO_DATA_DIR = process.env.ETTERNUM_DEMO_DIR ?? "./.etternum-demo";

/**
 * Modo demonstração: Postgres embutido (PGlite), sem instalar nada.
 * Ativo com ETTERNUM_DEMO=1, ou em desenvolvimento quando não há DATABASE_URL.
 */
export function isDemoDatabase(): boolean {
  return process.env.ETTERNUM_DEMO === "1" || (!process.env.DATABASE_URL && process.env.NODE_ENV !== "production");
}

const globalForDb = globalThis as unknown as { etternumDb?: Database };

/** Conexão única por processo (compartilhada entre a instrumentação e as rotas). */
export function getDatabase(): Database {
  globalForDb.etternumDb ??= createDatabase().db;
  return globalForDb.etternumDb;
}

/** No modo demonstração, cria/atualiza as tabelas do banco embutido. */
export async function migrateDemoDatabase(db: Database = getDatabase()): Promise<void> {
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  await migrate(db as never, { migrationsFolder: "./drizzle" });
}

export function createDatabase(): { db: Database; close: () => Promise<void> } {
  if (isDemoDatabase()) {
    const client = new PGlite(DEMO_DATA_DIR);
    // O driver PGlite tem a mesma API de consultas; o tipo é unificado para o resto do app.
    const db = drizzlePglite(client, { schema }) as unknown as Database;
    return { db, close: () => client.close() };
  }
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não configurada.");
  const pool = new Pool({ connectionString, max: 5 });
  return { db: drizzlePg(pool, { schema }), close: () => pool.end() };
}
