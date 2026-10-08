<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Etternum — notas para agentes de código

Plataforma em português do Brasil: o usuário faz uma triagem e conversa com "cápsulas" (grandes mentes) e com o
Maestro (amigo pessoal eterno e orquestrador). Leia `docs/ARQUITETURA.md` e `docs/VISAO.md` antes de mudanças
grandes.

- A interface existe em português do Brasil (fonte), inglês, espanhol e francês. Nenhum texto para o usuário fica
  escrito direto em componente: adicione a chave em `src/lib/i18n/messages/pt-BR.ts` e traduza em `en.ts`, `es.ts`
  e `fr.ts` (o TypeScript e `tests/i18n.test.ts` acusam o que faltar). Servidor: `getI18n()`; cliente: `useI18n()`.
- Mentes, áreas, signos e linhas de ajuda traduzidos ficam em `src/lib/i18n/content/`. Mente nova = tradução nova.
- Regras de negócio puras ficam em `src/lib/domain` (sem acesso a banco) e têm testes em `tests/`.
- Cápsulas: `src/lib/domain/agents.ts`. Pessoas vivas e figuras religiosas devem ser `kind: "inspired"`
  (especialista que fala sobre a pessoa, nunca como ela) — há um teste que garante isso.
- Prompts: `src/lib/ai/prompts.ts`. Instruções em português; o idioma da resposta vem de `baseRules(locale)`.
  Mantenha o protocolo de segurança (CVV 188 no Brasil, linhas do idioma nos demais) e não envie CPF/e-mail ao modelo.
- Acesso ao modelo só por `src/lib/ai/model.ts` (provedores em `src/lib/ai/providers/`: OpenRouter e Anthropic,
  escolhidos por `src/lib/ai/provider.ts`). `ETTERNUM_AI_MOCK=1` simula respostas.
- Banco: altere `src/lib/db/schema.ts` e rode `npm run db:generate` para criar a migração. Sem `DATABASE_URL`
  em desenvolvimento (ou com `npm run demo`), o app usa PGlite embutido e aplica as migrações ao subir.
- Antes de concluir: `npm run lint && npm run typecheck && npm test && npm run build`.
