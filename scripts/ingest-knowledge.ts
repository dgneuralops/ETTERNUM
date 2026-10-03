/**
 * Alimenta a base de conhecimento de uma cápsula com o texto de uma obra.
 *
 *   npm run conhecimento:importar -- --mente seneca --arquivo conhecimento/seneca/cartas.txt \
 *     --fonte "Cartas a Lucílio — tradução X (domínio público)" [--substituir]
 *
 * Aceita .txt e .md. Para PDF, converta antes: pdftotext -layout livro.pdf livro.txt
 * Use apenas obras em domínio público, licenciadas ou textos próprios (ver conhecimento/README.md).
 */
import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { and, eq } from "drizzle-orm";
import { getAgent } from "../src/lib/domain/agents";
import { chunkText } from "../src/lib/knowledge/chunk";
import { connect } from "./db";

const { values } = parseArgs({
  options: {
    mente: { type: "string" },
    arquivo: { type: "string" },
    fonte: { type: "string" },
    substituir: { type: "boolean", default: false },
  },
});

async function main() {
  const { mente, arquivo, fonte, substituir } = values;
  if (!mente || !arquivo || !fonte) {
    console.error(
      'Uso: npm run conhecimento:importar -- --mente <slug> --arquivo <caminho.txt> --fonte "<obra, edição e licença>"',
    );
    process.exit(1);
  }
  if (!getAgent(mente)) {
    console.error(`Cápsula "${mente}" não existe. Veja os slugs em src/lib/domain/agents.ts.`);
    process.exit(1);
  }
  const chunks = chunkText(await readFile(arquivo, "utf8"));
  if (chunks.length === 0) {
    console.error("O arquivo está vazio.");
    process.exit(1);
  }

  const { db, pool, schema } = connect();
  try {
    await db.transaction(async (tx) => {
      if (substituir) {
        await tx
          .delete(schema.knowledgeChunks)
          .where(and(eq(schema.knowledgeChunks.agentSlug, mente), eq(schema.knowledgeChunks.source, fonte)));
      }
      for (let i = 0; i < chunks.length; i += 200) {
        await tx
          .insert(schema.knowledgeChunks)
          .values(
            chunks
              .slice(i, i + 200)
              .map((content, j) => ({ agentSlug: mente, source: fonte, position: i + j, content })),
          );
      }
    });
    console.log(`✓ ${chunks.length} trechos de "${fonte}" importados para ${mente}.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
