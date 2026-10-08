// Production server: static build (dist/) with SPA fallback + the AI backend on /api/*.
//   npm run build && OPENROUTER_API_KEY=... npm start
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import aiHandler from './ai.js';

const DIST = fileURLToPath(new URL('../dist', import.meta.url));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon' };

async function file(path) {
  try { const s = await stat(path); return s.isFile() ? readFile(path) : null; } catch { return null; }
}

createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url.startsWith('/api/')) return aiHandler(req, res);
  const safe = normalize(decodeURIComponent(url)).replace(/^(\.\.[/\\])+/, '');
  let path = join(DIST, safe);
  let body = path.startsWith(DIST) ? await file(path) : null;
  if (!body) { path = join(DIST, 'index.html'); body = await file(path); }
  res.writeHead(200, {
    'Content-Type': TYPES[extname(path)] || 'application/octet-stream',
    'Cache-Control': url.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  });
  res.end(body);
}).listen(process.env.PORT || 3000, () => console.log(`Etternum on http://localhost:${process.env.PORT || 3000}`));
