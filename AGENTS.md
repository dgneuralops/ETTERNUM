<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Etternum — notas para agentes de código

Plataforma em português do Brasil: o usuário faz uma triagem e conversa com "cápsulas" (grandes mentes) e com o
Maestro (amigo pessoal eterno e orquestrador). Leia `docs/ARQUITETURA.md` e `docs/VISAO.md` antes de mudanças
grandes.

- Toda a interface e todos os textos para o usuário são em português do Brasil.
- Regras de negócio puras ficam em `src/lib/domain` (sem acesso a banco) e têm testes em `tests/`.
- Cápsulas: `src/lib/domain/agents.ts`. Pessoas vivas e figuras religiosas devem ser `kind: "inspired"`
  (especialista que fala sobre a pessoa, nunca como ela) — há um teste que garante isso.
- Prompts: `src/lib/ai/prompts.ts`. Mantenha o protocolo de segurança (CVV 188) e não envie CPF/e-mail ao modelo.
- Acesso ao modelo só por `src/lib/ai/claude.ts`. `ETTERNUM_AI_MOCK=1` simula respostas.
- Banco: altere `src/lib/db/schema.ts` e rode `npm run db:generate` para criar a migração.
- Antes de concluir: `npm run lint && npm run typecheck && npm test && npm run build`.
