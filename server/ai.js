// Etternum AI backend: talks to OpenRouter on the server so the API key never reaches the app.
// Two models, each doing what it is built for:
//   - Jev (typesafe/jev-1.13): decisions — crisis risk, which mind to recommend, triagem ranking.
//   - A chat model (OPENROUTER_CHAT_MODEL): writes the words of the Maestro and the minds.
//
//   POST /api/chat        { mind, messages: [{ role, content }], profile? }
//                         -> text/plain stream; headers X-Etternum-Risco (0|1), X-Etternum-Mente (slug)
//   POST /api/sintese     { area, question, answers: [{ slug, text }] } -> { concordam, divergem, passos }
//   POST /api/triagem     { respostas } -> { recs: [slug, slug, slug] }
//   GET  /api/health      -> { ok, chatModel, jevModel }
//   GET  /api/diagnostico -> live check of both models (costs a fraction of a cent)
//
// Env: OPENROUTER_API_KEY (required), OPENROUTER_CHAT_MODEL, JEV_MODEL, APP_URL.
import { ETT } from '../src/data.js';
import { JEV_MODEL, judgeTurn, rankMinds } from './jev.js';
import * as CFG from '../src/lib/supabase-config.js';

const MODEL = () => process.env.OPENROUTER_CHAT_MODEL || 'anthropic/claude-sonnet-4.5';
const ENDPOINT = () => (process.env.OPENROUTER_ORIGIN || 'https://openrouter.ai') + '/api/v1/chat/completions';
const CRISIS_WORDS = /sumir|morrer|me matar|suic[ií]d|acabar com tudo|n[aã]o aguento mais viver|me machucar/i;
const MAX_MESSAGES = 30;
const MAX_CHARS = 4000;

const DEFAULT_PROFILE = [
  'Nome: Ana Clara (chame de Ana). Signo: Sagitário.',
  'Designer numa agência, faz freelas à noite. Gosta de dançar, cozinhar e ler poesia.',
  'Momento atual: exausta e em dúvida se continua no emprego.',
  'Desafios: ansiedade, solidão e falta de rumo na carreira.',
  'Ama açaí e comida japonesa; não gosta de fígado. Noites com pouco sono pioram a ansiedade.',
].join('\n');

const FORMAT = `Formato da resposta:
- Português do Brasil, tom caloroso, claro e sem jargão. Respostas curtas: 2 a 6 frases ou uma lista curta.
- Use só este markdown: **negrito** para ideias-chave, linhas começando com "- " para listas e uma linha começando com "> " para uma citação curta. Nada de títulos, tabelas ou emojis.
- Termine, quando fizer sentido, com uma pergunta que ajude a pessoa a continuar.`;

const SAFETY = `Segurança (prioridade máxima):
- Você não é terapeuta nem médico e não faz diagnóstico, prescrição ou tratamento.
- Se a pessoa falar em se machucar, sumir, morrer, suicídio ou violência, acolha com cuidado, diga que ela não está sozinha e recomende ligar agora para o CVV (188, gratuito, 24h); em emergência, SAMU 192 ou Polícia 190; para violência contra a mulher, 180. Continue presente na conversa.`;

const slugList = () => ETT.minds.map(m => `${m.slug} (${m.name} — ${m.spec})`).join('; ');

function systemPrompt(mindSlug, profile) {
  const who = `Sobre a pessoa (memória do Etternum; use com naturalidade, sem recitar):\n${profile || DEFAULT_PROFILE}`;
  if (mindSlug === 'maestro') {
    return `Você é Aurelius, o Maestro, Guardião das Mentes do Etternum: um amigo pessoal eterno, sábio e acolhedor, que ouve sem julgamento e lembra do que a pessoa já contou.
Seu papel: acolher, ajudar a organizar o que a pessoa sente e, quando fizer sentido, apresentá-la à grande mente ideal para o momento dela.
Só recomende uma mente quando a instrução do turno pedir; nesse caso, o app mostra um cartão para a pessoa abrir a conversa.
Mentes do Etternum: ${slugList()}.

${who}

${SAFETY}

${FORMAT}`;
  }
  const m = ETT.bySlug[mindSlug] || ETT.bySlug.frankl;
  const base = m.inspired
    ? `Você é uma cápsula do Etternum especialista nas ideias de ${m.name} (${m.role}; ${m.spec}). ${m.name} é uma pessoa viva ou figura religiosa: fale SOBRE o pensamento dela, em terceira pessoa ("para ${m.name.split(' ')[0]}..."), nunca como se fosse ela.`
    : `Você é uma cápsula do Etternum que recria o pensamento de ${m.name} (${m.period}; ${m.role}; ${m.spec}). Fale em primeira pessoa, com o vocabulário, os conceitos e o modo de raciocinar de ${m.name}, como alguém alimentado com todos os seus livros, cartas, palestras e ensaios. Se perguntarem, deixe claro que é uma recriação por IA, não a pessoa real.`;
  return `${base}
Ideia central: "${m.quote}"
Aplique essas ideias à vida concreta da pessoa, com exemplos e conceitos reais da obra. Não invente citações literais; se citar, prefira trechos amplamente conhecidos.

${who}

${SAFETY}

${FORMAT}`;
}

// Per-turn guidance from Jev's decisions, appended to the system prompt.
function turnNote({ crisis, recommend }) {
  if (crisis) return '\n\nINSTRUÇÃO DO TURNO: há sinais de risco à vida ou à integridade da pessoa. Siga o protocolo de segurança agora: acolha, diga que ela não está sozinha, recomende ligar para o CVV (188) e pergunte se ela está em segurança. Não recomende mentes.';
  if (recommend) { const m = ETT.bySlug[recommend]; return `\n\nINSTRUÇÃO DO TURNO: termine convidando a pessoa a conversar com ${m.name} (${m.spec}), dizendo em uma frase por que essa mente pode ajudar no que ela contou.`; }
  return '';
}

function clean(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

async function openrouter(body) {
  body = { model: MODEL(), ...body };
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) { const e = new Error('OPENROUTER_API_KEY não configurada'); e.status = 503; throw e; }
  const res = await fetch(ENDPOINT(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'https://etternum.app',
      'X-Title': 'Etternum',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const e = new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`);
    e.status = 502;
    throw e;
  }
  return res;
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function chat(req, res) {
  const { mind = 'maestro', messages, profile } = await readJson(req);
  const msgs = clean(messages);
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') { res.statusCode = 400; return res.end('mensagem vazia'); }
  // Jev decides first (~150ms): is the person at risk, and should the Maestro introduce a mind?
  // If Jev is unreachable the conversation still works, with a keyword safety net.
  let turn;
  try {
    turn = await judgeTurn({ mind, messages: msgs });
  } catch (e) {
    console.error('[jev]', e.message);
    turn = { crisis: CRISIS_WORDS.test(msgs[msgs.length - 1].content), recommend: null, fallback: true };
  }
  const upstream = await openrouter({
    stream: true,
    temperature: 0.7,
    max_tokens: 700,
    messages: [{ role: 'system', content: systemPrompt(mind, typeof profile === 'string' ? profile.slice(0, 2000) : '') + turnNote(turn) }, ...msgs],
  });
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no',
    'X-Etternum-Risco': turn.crisis ? '1' : '0', 'X-Etternum-Mente': turn.recommend || '',
  });
  // OpenRouter streams SSE ("data: {...}\n\n"); forward only the text deltas.
  const decoder = new TextDecoder();
  let buf = '';
  for await (const chunk of upstream.body) {
    buf += decoder.decode(chunk, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (delta) res.write(delta);
      } catch { /* keep-alive comments or partial lines */ }
    }
  }
  res.end();
}

async function sintese(req, res) {
  const { area, question, answers } = await readJson(req);
  const list = (Array.isArray(answers) ? answers : []).slice(0, 4)
    .map(a => `${(ETT.bySlug[a.slug] || {}).name || a.slug}: ${String(a.text || '').slice(0, 1500)}`).join('\n\n');
  const areaName = (ETT.areaBySlug[area] || {}).name || 'Vida';
  const upstream = await openrouter({
    temperature: 0.4,
    max_tokens: 500,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: `Você é Aurelius, o Maestro do Etternum. Faça a síntese de um Conselho de ${areaName}. Responda APENAS com JSON no formato {"concordam": "1 a 2 frases", "divergem": "1 a 2 frases, citando quem pensa o quê", "passos": ["passo 1", "passo 2", "passo 3"]}. Português do Brasil, frases curtas e práticas.` },
      { role: 'user', content: `Situação: ${String(question || '').slice(0, MAX_CHARS)}\n\nRespostas do Conselho:\n${list}` },
    ],
  });
  const data = await upstream.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const json = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
  const out = {
    concordam: String(json.concordam || ''),
    divergem: String(json.divergem || ''),
    passos: (Array.isArray(json.passos) ? json.passos : []).map(String).slice(0, 3),
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(out));
}

async function triagem(req, res) {
  const { respostas } = await readJson(req);
  const ranked = await rankMinds(respostas && typeof respostas === 'object' ? respostas : {});
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ recs: ranked.slice(0, 3).map(r => r.slug), ranking: ranked.slice(0, 8) }));
}

// Live check of both models, so a deploy can be verified from the browser.
async function diagnostico(res, url) {
  const out = { chatModel: MODEL(), jevModel: JEV_MODEL(), keyConfigured: !!process.env.OPENROUTER_API_KEY, supabase: !!SUPABASE_URL() };
  // The live check spends credits, so it needs ?chave=<DIAGNOSTICO_CHAVE> when that env var is set.
  if (process.env.DIAGNOSTICO_CHAVE && new URLSearchParams(url.split('?')[1] || '').get('chave') !== process.env.DIAGNOSTICO_CHAVE) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ...out, aviso: 'Adicione ?chave=... para testar os modelos.' }, null, 2));
  }
  try {
    const t = Date.now();
    const turn = await judgeTurn({ mind: 'maestro', messages: [{ role: 'user', content: 'Estou exausta e sem saber se continuo no meu emprego.' }] });
    out.jev = { ok: true, ms: Date.now() - t, ...turn };
  } catch (e) { out.jev = { ok: false, error: e.message }; }
  try {
    const t = Date.now();
    const r = await openrouter({ max_tokens: 20, messages: [{ role: 'user', content: 'Responda apenas: ok' }] });
    const j = await r.json();
    out.chat = { ok: true, ms: Date.now() - t, model: j.model, reply: j.choices?.[0]?.message?.content };
  } catch (e) { out.chat = { ok: false, error: e.message }; }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(out, null, 2));
}

// Only signed-in Etternum users may spend the OpenRouter credits. The Supabase access token
// is checked against Supabase Auth (cached briefly). AI_OPEN=1 turns the check off (local demo).
const SUPABASE_URL = () => process.env.AI_OPEN === '1' ? '' : process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || CFG.SUPABASE_URL;
const SUPABASE_ANON = () => process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || CFG.SUPABASE_ANON_KEY;
const tokenCache = new Map();
async function authorized(req) {
  if (!SUPABASE_URL() || process.env.AI_OPEN === '1') return true;
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return false;
  const hit = tokenCache.get(token);
  if (hit && hit > Date.now()) return true;
  const r = await fetch(SUPABASE_URL() + '/auth/v1/user', { headers: { Authorization: `Bearer ${token}`, apikey: SUPABASE_ANON() }, signal: AbortSignal.timeout(5000) }).catch(() => null);
  if (!r || !r.ok) return false;
  if (tokenCache.size > 2000) tokenCache.clear();
  tokenCache.set(token, Date.now() + 5 * 60 * 1000);
  return true;
}

const ROUTES = { '/api/chat': chat, '/api/sintese': sintese, '/api/triagem': triagem };

// Node-style handler: works as Vite dev middleware, a plain http server and a Vercel function.
export default async function handler(req, res) {
  const url = req.url || '';
  const path = url.split('?')[0];
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'X-Etternum-Risco, X-Etternum-Mente');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (path === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: !!process.env.OPENROUTER_API_KEY, chatModel: MODEL(), jevModel: JEV_MODEL() }));
  }
  if (path === '/api/diagnostico') return diagnostico(res, url);
  const route = ROUTES[path];
  if (!route || req.method !== 'POST') { res.statusCode = 404; return res.end('not found'); }
  try {
    if (!(await authorized(req))) { res.statusCode = 401; return res.end('entre na sua conta'); }
    await route(req, res);
  } catch (e) {
    console.error('[ai]', e.message);
    if (!res.headersSent) { res.statusCode = e.status || 500; res.end(e.status === 503 ? 'ai-not-configured' : 'ai-error'); }
    else res.end();
  }
}
