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
  for (const k of ['OPENROUTER_API_KEY', 'OPENROUTER_CHAT_MODEL', 'JEV_MODEL', 'OPENROUTER_ORIGIN', 'APP_URL', 'CORS_ORIGIN', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'DIAGNOSTICO_CHAVE', 'AI_OPEN']) if (env[k] && !process.env[k]) process.env[k] = env[k];
  return { plugins: [react(), api()] };
});
