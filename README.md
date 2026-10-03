# Etternum

**Seu amigo pessoal eterno.** Uma plataforma web (e, depois, app iOS/Android) onde cada pessoa passa por uma
triagem e conversa com grandes mentes da humanidade — filósofos, psicólogos, teólogos, historiadores e
empresários — sobre todas as áreas da vida. O Etternum lembra de tudo o que foi conversado e usa o perfil e o
signo da pessoa para orientar cada resposta.

- Visão do produto e roadmap: [`docs/VISAO.md`](docs/VISAO.md)
- Arquitetura e decisões técnicas: [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)
- Como alimentar as cápsulas com livros: [`conhecimento/README.md`](conhecimento/README.md)

## O que já funciona (MVP)

| Módulo                                                                                                          | Onde                                |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Landing page com carrossel das 25 cápsulas e lista de espera                                                    | `/`                                 |
| Cadastro (nome, e-mail, senha, CPF validado, nascimento → signo automático, consentimento LGPD, 18+) e login    | `/cadastro`, `/entrar`              |
| Triagem em 4 etapas (trabalho, gostos, dificuldades, estresse, desgaste, comida, objetivos, áreas de interesse) | `/triagem`                          |
| **Maestro** — amigo pessoal eterno e orquestrador: conversa, aconselha e encaminha para a mente ideal           | `/maestro`                          |
| 10 áreas da vida e 61 cápsulas (recriações em 1ª pessoa de quem já faleceu; "Inspirado em" para pessoas vivas)  | `/areas`, `/area/[slug]`, `/mentes` |
| Chat com cada mente, com streaming, histórico e "continuar de onde parei"                                       | `/mente/[slug]`                     |
| **Conselho**: várias mentes respondem à mesma situação + síntese do Maestro                                     | `/conselho/[area]`                  |
| **Quadro Eterno** (favoritos), histórico de conversas, perfil, memória e exclusão de conta                      | `/inicio`, `/conversas`, `/perfil`  |
| Planos: teste de 14 dias → gratuito (1 cápsula + 5 mensagens/dia) ou Premium                                    | `/plano`                            |
| Astrologia: signo no perfil, cartão do signo e uso do signo como lente nas respostas                            | `/area/astrologia`                  |
| Segurança emocional: detecção de risco, aviso com CVV 188 e protocolo nos prompts                               | em todas as conversas               |
| Base de conhecimento por cápsula (trechos dos livros recuperados por busca em português)                        | `npm run conhecimento:importar`     |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · PostgreSQL (Supabase ou qualquer Postgres) com
Drizzle ORM · Claude (Anthropic) para as cápsulas · Vitest.

## Rodando localmente

Pré-requisitos: Node.js 20.9+ e um Postgres (local, Docker ou um projeto gratuito no Supabase).

```bash
npm install
cp .env.example .env.local   # preencha DATABASE_URL, SESSION_SECRET e ANTHROPIC_API_KEY
npm run db:migrate           # cria as tabelas
npm run dev                  # http://localhost:3000
```

Sem chave da Anthropic? Coloque `ETTERNUM_AI_MOCK=1` no `.env.local` para navegar com respostas simuladas.

Postgres rápido com Docker:

```bash
docker run -d --name etternum-db -e POSTGRES_USER=etternum -e POSTGRES_PASSWORD=etternum \
  -e POSTGRES_DB=etternum -p 5432:5432 postgres:16
```

## Scripts

| Comando                                                                            | O que faz                                                         |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `npm run dev` / `build` / `start`                                                  | Desenvolvimento, build e produção                                 |
| `npm test`                                                                         | Testes de domínio (CPF, signos, planos, risco, catálogo, prompts) |
| `npm run lint` / `npm run typecheck`                                               | ESLint e TypeScript                                               |
| `npm run db:generate`                                                              | Gera uma migração depois de alterar `src/lib/db/schema.ts`        |
| `npm run db:migrate`                                                               | Aplica as migrações no banco do `DATABASE_URL`                    |
| `npm run conhecimento:importar -- --mente <slug> --arquivo <txt> --fonte "<obra>"` | Alimenta uma cápsula com um livro                                 |
| `npm run usuario:plano -- <email> premium`                                         | Libera o Premium manualmente (até o checkout estar conectado)     |

## Deploy (Vercel + Supabase)

1. Crie um projeto no [Supabase](https://supabase.com) e copie a connection string do **Session pooler**.
2. Rode `DATABASE_URL="..." npm run db:migrate` para criar as tabelas.
3. Importe este repositório na [Vercel](https://vercel.com) e configure `DATABASE_URL`, `SESSION_SECRET`
   e `ANTHROPIC_API_KEY` (e, quando houver, `NEXT_PUBLIC_CHECKOUT_URL`).
4. As rotas de conversa usam streaming e podem levar até alguns minutos; o `maxDuration` já está em 300 s.

## Estrutura

```
src/
  app/
    (site)/          landing, cadastro, entrar, termos, privacidade
    (app)/           área logada: início, maestro, áreas, mentes, conselho, conversas, perfil, plano
    triagem/         onboarding
    api/             chat, conselho e encaminhamento do Maestro (streaming NDJSON)
    actions/         server actions (auth, triagem, favoritos, conta, lista de espera)
  components/        interface (ChatView, CouncilView, MindCard, carrossel, menus…)
  lib/
    domain/          regras puras: áreas, cápsulas, signos, CPF, planos, risco, formulários
    ai/              prompts e cliente do Claude
    chat/            serviço de conversas, memória, busca nos livros
    db/              schema Drizzle e conexão
    auth/            sessão (cookie assinado)
drizzle/             migrações SQL
scripts/             importação de livros e ajuste de plano
conhecimento/        textos das cápsulas (fora do git)
tests/               testes
```
