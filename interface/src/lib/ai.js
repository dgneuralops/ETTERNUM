// Client for the Etternum AI backend (server/ai.js). In the native app, set VITE_API_BASE
// to the deployed web origin (e.g. https://etternum.app) — relative URLs only work on the web.
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export class AiUnavailable extends Error {}

async function post(path, body, signal) {
  let res;
  try {
    res = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new Error('network');
  }
  // 404: no backend deployed (static hosting); 503: key not configured. Both mean "use demo replies".
  if (res.status === 404 || res.status === 503) throw new AiUnavailable(res.status === 503 ? 'not-configured' : 'no-backend');
  if (!res.ok) throw new Error('ai-error ' + res.status);
  return res;
}

// Streams a reply; calls onDelta(fullTextSoFar) as text arrives and resolves with the full text.
export async function streamReply({ mind, messages, profile, onDelta, signal }) {
  const res = await post('/api/chat', { mind, messages, profile }, signal);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onDelta && onDelta(text);
  }
  return text;
}

export async function synthesize({ area, question, answers, signal }) {
  const res = await post('/api/sintese', { area, question, answers }, signal);
  return res.json();
}

// The Maestro ends a recommendation with a line like [[mente:frankl]].
export function splitRecommendation(text) {
  const m = /\[\[mente:([a-z]+)\]\]\s*$/.exec(text.trim());
  return { text: text.replace(/\[\[mente:[a-z]+\]\]/g, '').trim(), rec: m ? m[1] : null };
}
