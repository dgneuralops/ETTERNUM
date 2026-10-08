// Etternum AI backend: talks to OpenRouter on the server so the API key never reaches the app.
//
//   POST /api/chat       { mind, messages: [{ role: 'user'|'assistant', content }], profile? }
//                        -> text/plain stream of the reply
//   POST /api/sintese    { area, question, answers: [{ slug, text }] }
//                        -> { concordam, divergem, passos: [3 strings] }
//   GET  /api/health     -> { ok, model }
//
// Env: OPENROUTER_API_KEY (required), OPENROUTER_MODEL (default typesafe/jev-1.13), APP_URL (optional).
import { ETT } from '../src/data.js';

const MODEL = () => process.env.OPENROUTER_MODEL || 'typesafe/jev-1.13';
const ENDPOINT = () => (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1') + '/chat/completions';
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
Quando recomendar uma mente, escolha uma destas e escreva na ÚLTIMA linha, sozinha, a marcação [[mente:slug]] (exemplo: [[mente:frankl]]). Recomende no máximo uma por resposta e só quando ajudar de verdade.
Mentes disponíveis: ${slugList()}.

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

function clean(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
}

async function openrouter(body) {
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
    body: JSON.stringify({ model: MODEL(), ...body }),
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
  const upstream = await openrouter({
    stream: true,
    temperature: 0.7,
    max_tokens: 700,
    messages: [{ role: 'system', content: systemPrompt(mind, typeof profile === 'string' ? profile.slice(0, 2000) : '') }, ...msgs],
  });
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' });
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

const ROUTES = { '/api/chat': chat, '/api/sintese': sintese };

// Node-style handler: works as Vite dev middleware, a plain http server and a Vercel function.
export default async function handler(req, res) {
  const path = (req.url || '').split('?')[0];
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (path === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ ok: !!process.env.OPENROUTER_API_KEY, model: MODEL() }));
  }
  const route = ROUTES[path];
  if (!route || req.method !== 'POST') { res.statusCode = 404; return res.end('not found'); }
  try {
    await route(req, res);
  } catch (e) {
    console.error('[ai]', e.message);
    if (!res.headersSent) { res.statusCode = e.status || 500; res.end(e.status === 503 ? 'ai-not-configured' : 'ai-error'); }
    else res.end();
  }
}
