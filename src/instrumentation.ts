/** Roda uma vez quando o servidor sobe, antes de atender requisições. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { isDemoDatabase, migrateDemoDatabase } = await import("@/lib/db/connect");
  // Modo demonstração: o banco embutido ganha as tabelas automaticamente.
  if (isDemoDatabase()) await migrateDemoDatabase();
}
