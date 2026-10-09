// Client for the Etternum AI backend (server/ai.js). In the native app, set VITE_API_BASE
// to the deployed web origin (e.g. https://etternum.app) — relative URLs only work on the web.
import { supabase } from './supabase.js';

const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export class AiUnavailable extends Error {}

async function post(path, body, signal) {
  let res;
  try {
    // The API only answers signed-in people (protects the OpenRouter credits).
    const token = supabase ? (await supabase.auth.getSession()).data.session?.access_token : null;
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    res = await fetch(BASE + path, { method: 'POST', headers, body: JSON.stringify(body), signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('network');
  }
  // 404: no backend deployed (static hosting); 503: key not configured. Both mean "use demo replies".
  if (res.status === 404 || res.status === 503) throw new AiUnavailable(res.status === 503 ? 'not-configured' : 'no-backend');
  if (res.status === 401) throw new Error('sessao');
  if (!res.ok) throw new Error('ai-error ' + res.status);
  return res;
}

// Streams a reply; calls onDelta(fullTextSoFar) as text arrives. Resolves with
// { text, crisis, recommend } — the last two are Jev's decisions for this turn.
export async function streamReply({ mind, messages, profile, onDelta, onMeta, signal }) {
  const res = await post('/api/chat', { mind, messages, profile }, signal);
  const meta = { crisis: res.headers.get('X-Etternum-Risco') === '1', recommend: res.headers.get('X-Etternum-Mente') || null };
  onMeta && onMeta(meta);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onDelta && onDelta(text);
  }
  return { text, ...meta };
}

// Triagem answers -> the three minds Jev ranks highest for this person.
export async function rankMinds(respostas, signal) {
  const res = await post('/api/triagem', { respostas }, signal);
  return (await res.json()).recs || [];
}

export async function synthesize({ area, question, answers, signal }) {
  const res = await post('/api/sintese', { area, question, answers }, signal);
  return res.json();
}
