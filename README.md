# Etternum

Converse com grandes mentes. Web app (React 19 + Vite) feito a partir do design do Claude Design em
`design/project` (direção **1a "Noite dourada"**: escuro + ouro, com tema claro), pronto para virar app iOS/Android.

```bash
npm install
cp .env.example .env.local   # put your OpenRouter key in OPENROUTER_API_KEY
npm run dev                  # http://localhost:5173 (app + /api)
npm run build && npm start   # production: dist/ + /api on http://localhost:3000
```

## AI (OpenRouter, one key)

Two models, each doing what it is built for. Both are called **on the server** (`server/`), so the key
never ships in the app bundle. The backend runs inside `vite dev`/`vite preview`, in `server/index.js`
(`npm start`) and as a Vercel function (`api/[...path].js`).

**Jev (`typesafe/jev-1.13`) makes the decisions** — `server/jev.js`. Jev is a TypeSafe *decision*
model: it never writes text; it answers typed questions (noul / choice / score) with probabilities,
through OpenRouter's `POST /api/alpha/decisions` (it is rejected by `/chat/completions` on purpose).
In Etternum it decides, before every reply (~150 ms, one batched request):

- **Risco** (noul): signs of suicidal ideation, self-harm or danger → the app shows the CVV 188 panel
  immediately and the reply follows the safety protocol. A keyword net covers Jev being unavailable.
- **Recomendar + qual mente** (noul + choice over the 31 minds + "nenhuma"), Maestro only → the
  "Continuar com…" card. Thresholds live in code (`RISK_THRESHOLD`, `RECOMMEND_THRESHOLD`, `MIND_CONFIDENCE`).
- **Triagem**: one noul per mind against the person's answers; the top three become "Separamos três
  mentes para começar".

**A chat model writes the words** — `server/ai.js`, `OPENROUTER_CHAT_MODEL` (default
`anthropic/claude-sonnet-4.5`). Aurelius/Maestro, real minds in first person, "Inspirado em" minds
always *about* the person. The Conselho's synthesis ("onde concordam / divergem / próximos passos")
also comes from this model.

| Env | |
|---|---|
| `OPENROUTER_API_KEY` | required |
| `JEV_MODEL` | default `typesafe/jev-1.13` |
| `OPENROUTER_CHAT_MODEL` | default `anthropic/claude-sonnet-4.5` (any OpenRouter chat model id) |

Check a deployment with **`/api/diagnostico`** — it calls both models once and reports what each
returned. With no key (or no backend) the app falls back to the scripted demo replies.

## App version

- **PWA**: `manifest.webmanifest`, icons and `sw.js` (offline shell, cached images). Installable from
  the browser ("Adicionar à tela de início").
- **iOS / Android** with Capacitor (`capacitor.config.json`, appId `app.etternum`):
  ```bash
  echo "VITE_API_BASE=https://<your-deployed-domain>" >> .env.local   # the native app calls the deployed /api
  npx cap add ios && npx cap add android    # once
  npm run ios       # build + sync + open Xcode
  npm run android   # build + sync + open Android Studio
  ```
- Layout respects notches and the home indicator (`viewport-fit=cover` + `env(safe-area-inset-*)`).

## Structure

```
design/                 Claude Design export (prototypes, chats, portraits) — the visual source of truth
server/
  ai.js                 /api routes, prompts, chat model
  jev.js                Jev decisions (risk, recommendation, triagem ranking)
  index.js              production server (dist/ + /api)
src/
  main.jsx              entry
  lib/ai.js             client for /api
  data.js               themes (dark/light tokens), 10 areas, 31 minds, portrait lookup
  screens/
    Etternum.jsx        app shell: URL routing, sidebar / bottom nav, header, theme, plan, favourites, toasts, "Mapa de telas"
    Publico.jsx         landing, cadastro, entrar, termos/privacidade, 404
    Triagem.jsx         Simply-Piano-style quiz (one question per screen, interstitial quotes, "Montando seu Etternum…")
    Inicio.jsx          home
    Explorar.jsx        áreas, área (incl. astrologia), todas as mentes
    Chat.jsx            Maestro and mind conversations (streaming, crisis/CVV, recommendation card)
    Conselho.jsx        council of up to 4 minds + Maestro synthesis
    Conta.jsx           conversas, perfil, plano, memória viva, estados globais
    Clube.jsx           Clube do Livro reader + admin (login, livros, editor, materiais)
  components/
    Icon.jsx            Lucide icons by kebab-case name (only registered names are bundled)
    ImageSlot.jsx       portrait frame / image upload slot
    Overlay.jsx         portal for fixed modals & toasts
  styles/
    global.css          base styles + keyframes
    pseudo.css          :hover / :focus / :active rules referenced by class name
public/
  portraits/            mind portraits (WebP, resized) + Aurelius
  covers/               book covers
```

The screens were ported one-to-one from the `.dc.html` prototypes: each screen keeps the prototype's
logic (`renderVals()` builds the view model) and its markup as JSX with the original inline styles, so
spacing, type and colour match the design exactly. Hover/focus/active styles live in `styles/pseudo.css`.

## Routes

`/` · `/cadastro` · `/entrar` · `/triagem` · `/inicio` · `/maestro` · `/areas` · `/area/:slug` · `/mentes` ·
`/mente/:slug` · `/conselho/:area` · `/clube` · `/admin` · `/conversas` · `/perfil` · `/plano` · `/termos` ·
`/privacidade` · `/memoria-viva` · `/estados` · anything else → 404.

The host must serve `index.html` for every path (SPA fallback).

## Supabase (contas e dados)

Projeto `zjjipazdxkdxecqcjngo` (URL e chave *anon* em `src/lib/supabase-config.js` — são públicas por
natureza; a proteção vem do Row Level Security). **Uma vez:** abra o SQL Editor do Supabase, cole
`supabase/schema.sql` e rode. Ele cria:

| Tabela | O quê |
|---|---|
| `profiles` | nome, nascimento (→ signo), CPF, plano/teste de 14 dias, cápsula, favoritos, triagem, mentes recomendadas |
| `conversas`, `mensagens` | Maestro, mentes e Conselho — "continuar de onde parei", histórico, apagar |
| `livros`, `admins`, bucket `clube` | Clube do Livro: leitura pública dos publicados, escrita só de admin, capas no Storage |
| `excluir_conta()` | a própria pessoa apaga a conta e tudo o que é dela |

- Cadastro e login com e-mail e senha; "Esqueci minha senha" envia o link do Supabase.
- Em **Authentication → URL Configuration**, coloque a URL do site (ex.: `https://etternum.vercel.app`) em *Site URL* e em *Redirect URLs*.
- Para testar sem confirmar e-mail: **Authentication → Providers → Email → desligue "Confirm email"**.
- Admin do Clube: crie sua conta no app e rode `insert into public.admins (user_id) select id from auth.users where email = 'seu@email.com';`
- A API (`/api/*`) só responde a quem está logado (o servidor confere o token no Supabase), então ninguém de fora gasta seus créditos da OpenRouter.
- Modo demonstração sem banco: `VITE_DEMO=1 npm run dev`.

## Ainda falta

- **Pagamento do Premium**: o plano vem do banco e só o servidor pode mudá-lo; falta ligar um meio de pagamento.
- **Materiais do Clube** (imagens soltas no admin) ainda ficam só no navegador; as capas já vão para o Supabase.
- **"Mapa de telas"** (canto inferior esquerdo) é o navegador de telas do protótipo; remova em `Etternum.jsx` (`showMap`) antes do lançamento.
- Os depoimentos da landing são fictícios — troque por reais antes de publicar.
