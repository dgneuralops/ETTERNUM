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

## What is still mocked

Besides the AI backend, everything runs in the browser with demo data:

- **Accounts**: cadastro validates CPF and terms, then goes to the triagem; "Entrar" accepts any e-mail + 8-char password. The user is always "Ana Clara".
- **Conversations** are live (see above) but not saved anywhere: the history lives only while the screen is open, and the user profile sent to the model is the demo profile in `server/ai.js`. Triagem answers are used for the recommendations but not stored.
- **Plan** (trial / free / premium) and favourites live in memory; the theme is remembered in `localStorage`.
- **Clube admin**: the login is a demo (any valid e-mail + 4-char password, kept in `sessionStorage`). Books, edits and uploaded covers are saved to `localStorage`. Real protection needs admin users checked on the server.
- **"Mapa de telas"** (bottom-left) is the prototype's screen navigator, kept on purpose; remove it from `Etternum.jsx` (`showMap`) before launch.
- Testimonials on the landing are fictional placeholders — replace with real ones before publishing.
