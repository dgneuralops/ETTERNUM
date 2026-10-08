# Etternum — web app

React 19 + Vite implementation of the Claude Design handoff in `../claude-design/project` (direction **1a "Noite dourada"**: dark + gold, with a light theme toggle).

```bash
npm install
cp .env.example .env.local   # put your OpenRouter key in OPENROUTER_API_KEY
npm run dev                  # http://localhost:5173 (app + /api)
npm run build && npm start   # production: dist/ + /api on http://localhost:3000
```

## AI (OpenRouter)

The Maestro, every mind and the Conselho talk to `typesafe/jev-1.13` through OpenRouter.
`server/ai.js` holds the prompts and calls OpenRouter **on the server**, so the key never ships in
the app bundle. It runs inside `vite dev`/`vite preview`, in `server/index.js` (`npm start`) and as a
Vercel function (`api/[...path].js`).

- Env: `OPENROUTER_API_KEY` (required), `OPENROUTER_MODEL` (default `typesafe/jev-1.13`), `APP_URL`.
- Personas: Aurelius/Maestro (can recommend one mind with a trailing `[[mente:slug]]` tag, shown as the
  "Continuar com…" card), real minds speak in first person, "Inspirado em" minds speak *about* the
  person, never as them. Every prompt carries the CVV 188 / SAMU 192 crisis rules.
- Conselho: each selected mind answers in parallel, then `/api/sintese` returns
  "onde concordam / onde divergem / próximos passos" as JSON.
- No key or no backend (e.g. static hosting): the app falls back to the scripted demo replies.

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
src/
  main.jsx              entry
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
- **Conversations** are live (see above) but not saved anywhere: the history lives only while the screen is open, and the user profile sent to the model is the demo profile in `server/ai.js`.
- **Plan** (trial / free / premium) and favourites live in memory; the theme is remembered in `localStorage`.
- **Clube admin**: the login is a demo (any valid e-mail + 4-char password, kept in `sessionStorage`). Books, edits and uploaded covers are saved to `localStorage`. Real protection needs admin users checked on the server.
- **"Mapa de telas"** (bottom-left) is the prototype's screen navigator, kept on purpose; remove it from `Etternum.jsx` (`showMap`) before launch.
- Testimonials on the landing are fictional placeholders — replace with real ones before publishing.
