# Etternum

**Seu amigo pessoal eterno.** Uma plataforma web (e, depois, app iOS/Android) onde cada pessoa passa por uma
triagem e conversa com grandes mentes da humanidade — filósofos, psicólogos, teólogos, historiadores e
empresários — sobre todas as áreas da vida. O Etternum lembra de tudo o que foi conversado e usa o perfil e o
signo da pessoa para orientar cada resposta. Disponível em **português do Brasil, inglês, espanhol e francês**.

- Visão do produto e roadmap: [`docs/VISAO.md`](docs/VISAO.md)
- Arquitetura e decisões técnicas: [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md)
- Como alimentar as cápsulas com livros: [`conhecimento/README.md`](conhecimento/README.md)
- Prompt para desenhar a interface no Claude Design: [`docs/design/PROMPT_CLAUDE_DESIGN.md`](docs/design/PROMPT_CLAUDE_DESIGN.md)

## O que já funciona (MVP)

| Módulo                                                                                                          | Onde                                |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Landing page com carrossel das 25 cápsulas e lista de espera                                                    | `/`                                 |
| Cadastro (nome, e-mail, senha, CPF no Brasil, nascimento → signo automático, consentimento LGPD, 18+) e login   | `/cadastro`, `/entrar`              |
| Triagem em 4 etapas (trabalho, gostos, dificuldades, estresse, desgaste, comida, objetivos, áreas de interesse) | `/triagem`                          |
| **Maestro** — amigo pessoal eterno e orquestrador: conversa, aconselha e encaminha para a mente ideal           | `/maestro`                          |
| 10 áreas da vida e 61 cápsulas (recriações em 1ª pessoa de quem já faleceu; "Inspirado em" para pessoas vivas)  | `/areas`, `/area/[slug]`, `/mentes` |
| Chat com cada mente, com streaming, histórico e "continuar de onde parei"                                       | `/mente/[slug]`                     |
| **Conselho**: várias mentes respondem à mesma situação + síntese do Maestro                                     | `/conselho/[area]`                  |
| **Quadro Eterno** (favoritos), histórico de conversas, perfil, memória e exclusão de conta                      | `/inicio`, `/conversas`, `/perfil`  |
| Planos: teste de 14 dias → gratuito (1 cápsula + 5 mensagens/dia) ou Premium                                    | `/plano`                            |
| Astrologia: signo no perfil, cartão do signo e uso do signo como lente nas respostas                            | `/area/astrologia`                  |
| Segurança emocional: detecção de risco (4 idiomas), linhas de ajuda do idioma (CVV 188, 988, 024, 3114…)        | em todas as conversas               |
| **4 idiomas** (pt-BR, en, es, fr): interface, mentes, áreas, signos e respostas no idioma escolhido             | seletor no topo e no `/perfil`      |
| Base de conhecimento por cápsula (trechos dos livros recuperados por busca em português)                        | `npm run conhecimento:importar`     |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · PostgreSQL (Supabase ou qualquer Postgres) com
Drizzle ORM · Claude (Anthropic) para as cápsulas · Vitest.

## Ver funcionando no seu computador (modo demonstração)

Não precisa de banco de dados nem de chave de API. O modo demonstração usa um banco embutido e respostas
simuladas da IA.

1. Instale o **Node.js** (versão LTS) em [nodejs.org](https://nodejs.org).
2. Baixe o projeto: no GitHub, botão verde **Code → Download ZIP** (e descompacte), ou
   `git clone https://github.com/dgneuralops/ETTERNUM.git`.
3. Abra o **Terminal** dentro da pasta do projeto (no Mac: clique com o botão direito na pasta →
   _Novo Terminal na Pasta_; no Windows: abra a pasta, digite `cmd` na barra de endereço e tecle Enter).
4. Rode, uma vez: `npm install`
5. Rode: `npm run demo`
6. Abra **http://localhost:3000** no navegador e crie sua conta.

Para conversar com a IA de verdade, coloque `ANTHROPIC_API_KEY=sua-chave` no arquivo `.env.local` (criado no
primeiro `npm run demo`) e rode `npm run demo` de novo. Os dados da demonstração ficam na pasta
`.etternum-demo`; apague-a para começar do zero. Para parar, pressione `Ctrl+C` no Terminal.

## Rodando com Postgres (desenvolvimento e produção)

Pré-requisitos: Node.js 20.9+ e um Postgres (local, Docker ou um projeto gratuito no Supabase).

```bash
npm install
cp .env.example .env.local   # preencha DATABASE_URL, SESSION_SECRET e ANTHROPIC_API_KEY
npm run db:migrate           # cria as tabelas
npm run dev                  # http://localhost:3000
```

Sem `DATABASE_URL`, o `npm run dev` usa o banco embutido da demonstração. Sem chave da Anthropic, coloque
`ETTERNUM_AI_MOCK=1` no `.env.local` para navegar com respostas simuladas.

Postgres rápido com Docker:

```bash
docker run -d --name etternum-db -e POSTGRES_USER=etternum -e POSTGRES_PASSWORD=etternum \
  -e POSTGRES_DB=etternum -p 5432:5432 postgres:16
```

## Scripts

| Comando                                                                            | O que faz                                                            |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `npm run demo`                                                                     | Modo demonstração: banco embutido e IA simulada, sem configurar nada |
| `npm run dev` / `build` / `start`                                                  | Desenvolvimento, build e produção                                    |
| `npm test`                                                                         | Testes (CPF, signos, planos, risco, catálogo, prompts, idiomas)      |
| `npm run lint` / `npm run typecheck`                                               | ESLint e TypeScript                                                  |
| `npm run db:generate`                                                              | Gera uma migração depois de alterar `src/lib/db/schema.ts`           |
| `npm run db:migrate`                                                               | Aplica as migrações no banco do `DATABASE_URL`                       |
| `npm run conhecimento:importar -- --mente <slug> --arquivo <txt> --fonte "<obra>"` | Alimenta uma cápsula com um livro                                    |
| `npm run usuario:plano -- <email> premium`                                         | Libera o Premium manualmente (até o checkout estar conectado)        |

## Idiomas

O Etternum funciona em **português do Brasil** (padrão), **inglês**, **espanhol** e **francês**.

- **Como o idioma é escolhido:** na primeira visita, pelo idioma do navegador; depois, pelo seletor (ícone de globo no
  topo de todas as páginas e na seção _Idioma_ do perfil). A escolha fica num cookie e, com login, na conta — ao
  entrar em outro aparelho, a preferência da conta vale.
- **O que muda:** todos os textos da interface, nomes e descrições das mentes (Sêneca → Seneca → Séneca → Sénèque),
  áreas, signos, datas, mensagens de erro e as **respostas das mentes**, que são escritas no idioma escolhido (ou no
  idioma em que a pessoa escrever).
- **Segurança:** a detecção de risco reconhece os quatro idiomas e o aviso mostra as linhas de ajuda do idioma
  (Brasil: CVV 188; inglês: 988 e Samaritans; espanhol: 024 e Línea de la Vida; francês: 3114, Bélgica e Suíça).
- **CPF:** pedido apenas no cadastro em português (Brasil). Nos outros idiomas o campo não aparece.
- **Fuso horário:** capturado do navegador no cadastro; define o "dia" do limite do plano gratuito e a saudação.
- **Onde ficam os textos:** `src/lib/i18n/messages/*.ts` (o português é a fonte; os outros são tipados com ele, então
  nenhuma chave pode faltar) e `src/lib/i18n/content/` (mentes, áreas, signos, linhas de ajuda). Para adicionar um
  idioma, inclua-o em `src/lib/i18n/config.ts` e crie os arquivos correspondentes — os testes apontam o que faltar.

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
    i18n/            idiomas: dicionários (messages/), conteúdo traduzido (content/), servidor e cliente
    ai/              prompts e cliente do Claude
    chat/            serviço de conversas, memória, busca nos livros
    db/              schema Drizzle e conexão
    auth/            sessão (cookie assinado)
drizzle/             migrações SQL
scripts/             importação de livros e ajuste de plano
conhecimento/        textos das cápsulas (fora do git)
tests/               testes
```
