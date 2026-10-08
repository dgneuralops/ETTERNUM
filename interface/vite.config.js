import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import aiHandler from './server/ai.js';

// Serves the AI backend (server/ai.js) on /api/* during `vite dev` and `vite preview`.
const api = () => {
  const mount = server => { server.middlewares.use((req, res, next) => (req.url.startsWith('/api/') ? aiHandler(req, res) : next())); };
  return { name: 'etternum-api', configureServer: mount, configurePreviewServer: mount };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const k of ['OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'APP_URL', 'CORS_ORIGIN']) if (env[k] && !process.env[k]) process.env[k] = env[k];
  return { plugins: [react(), api()] };
});
