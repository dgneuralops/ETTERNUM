/**
 * Modo demonstração: roda o Etternum no seu computador sem instalar banco de dados
 * nem configurar chaves. Uso: npm run demo  →  http://localhost:3000
 *
 * - Banco: Postgres embutido (PGlite) na pasta .etternum-demo
 * - IA: respostas simuladas, a menos que ANTHROPIC_API_KEY esteja no .env.local
 */
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { config } from "dotenv";

const ENV_FILE = ".env.local";

if (!existsSync(ENV_FILE)) {
  writeFileSync(
    ENV_FILE,
    [
      "# Criado pelo modo demonstração (npm run demo).",
      `SESSION_SECRET=${randomBytes(32).toString("hex")}`,
      "",
      "# Para conversar com a IA de verdade, coloque sua chave da Anthropic aqui:",
      "# ANTHROPIC_API_KEY=",
      "",
    ].join("\n"),
  );
  console.log(`✓ ${ENV_FILE} criado.`);
}
config({ path: [ENV_FILE, ".env"], quiet: true });

process.env.ETTERNUM_DEMO = "1";
const useRealAi = Boolean(process.env.ANTHROPIC_API_KEY) && process.env.ETTERNUM_AI_MOCK !== "1";
if (!useRealAi) process.env.ETTERNUM_AI_MOCK = "1";

async function main() {
  // Importado depois de definir ETTERNUM_DEMO para abrir o banco embutido.
  const { createDatabase, migrateDemoDatabase, DEMO_DATA_DIR } = await import("../src/lib/db/connect");
  const { db, close } = createDatabase();
  await migrateDemoDatabase(db);
  await close();
  console.log(`✓ Banco de demonstração pronto em ${path.resolve(DEMO_DATA_DIR)}`);
  console.log(
    useRealAi
      ? "✓ IA: Claude (ANTHROPIC_API_KEY encontrada)"
      : "• IA: respostas simuladas. Para usar o Claude, coloque ANTHROPIC_API_KEY no .env.local.",
  );
  const args = process.argv.slice(2);
  const portFlag = args.findIndex((a) => a === "--port" || a === "-p");
  const port = portFlag >= 0 ? args[portFlag + 1] : (process.env.PORT ?? "3000");
  console.log(`\n→ Abra http://localhost:${port} no navegador. Para parar, pressione Ctrl+C.\n`);

  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next");
  const child = spawn(process.execPath, [nextBin, "dev", ...args], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
