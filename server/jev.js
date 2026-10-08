// Jev (TypeSafe) through OpenRouter's decisions endpoint.
//
// Jev is a decision model: it never writes text. It reads `state` and answers typed questions
// with calibrated probabilities:
//   noul   -> { type: 'noul', noul: P(yes) }
//   choice -> { type: 'choice', choice, probabilities, confidence }
//   score  -> { type: 'score', score, probabilities, confidence, legend }
// All questions in one request run in parallel over the same state, so we always batch.
// Policy (thresholds) lives in code, never inside the questions.
import { ETT } from '../src/data.js';

export const JEV_MODEL = () => process.env.JEV_MODEL || 'typesafe/jev-1.13';
const URL_ = () => (process.env.OPENROUTER_ORIGIN || 'https://openrouter.ai') + '/api/alpha/decisions';
const TIMEOUT_MS = 6000;

// Thresholds (tune here; no request changes needed).
export const RISK_THRESHOLD = 0.5;
export const RECOMMEND_THRESHOLD = 0.6;
export const MIND_CONFIDENCE = 0.3;

export async function decide(state, questions) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw Object.assign(new Error('OPENROUTER_API_KEY não configurada'), { status: 503 });
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(URL_(), {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': process.env.APP_URL || 'https://etternum.app', 'X-Title': 'Etternum' },
      body: JSON.stringify({ model: JEV_MODEL(), state, questions }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) return (await res.json()).answers || {};
    lastError = new Error(`Jev ${res.status}: ${(await res.text()).slice(0, 300)}`);
    if (![429, 500, 502, 503, 529].includes(res.status)) break;
    await new Promise(r => setTimeout(r, 400));
  }
  throw lastError;
}

const noul = (instructions, yes, no) => ({ type: 'noul', instructions, criteria: { true: yes, false: no } });

const MIND_OPTIONS = () => ({
  ...Object.fromEntries(ETT.minds.map(m => [m.slug, `${m.name} — ${m.spec}. ${m.role}. Ideia central: "${m.quote}"`])),
  nenhuma: 'Nenhuma destas mentes se encaixa bem no que a pessoa está vivendo agora.',
});

const RISK = noul(
  'A pessoa, na `mensagem_nova` (considerando o contexto de `conversa`), indica risco à própria vida ou integridade: ideação suicida, desejo de sumir ou morrer, autolesão, ou estar sofrendo violência ou em perigo agora?',
  'Há qualquer sinal desse risco, mesmo indireto ("seria melhor sumir", "não aguento mais viver").',
  'A pessoa fala de cansaço, tristeza, ansiedade ou problemas sem indicar risco à vida ou à integridade.',
);

// Called before each chat reply. Returns { risk, recommend } where recommend is a mind slug or null.
export async function judgeTurn({ mind, messages }) {
  const last = messages[messages.length - 1]?.content || '';
  const state = {
    conversando_com: mind === 'maestro' ? 'Maestro (guia que apresenta as grandes mentes)' : (ETT.bySlug[mind] || {}).name,
    conversa: messages.slice(-7, -1).map(m => `${m.role === 'user' ? 'Pessoa' : 'Etternum'}: ${m.content.slice(0, 600)}`),
    mensagem_nova: last.slice(0, 2000),
  };
  const questions = { risco: RISK };
  if (mind === 'maestro') {
    questions.recomendar = noul(
      'Neste ponto da conversa, apresentar à pessoa uma grande mente específica ajudaria de verdade? Considere a `mensagem_nova` e a `conversa`.',
      'A pessoa trouxe um tema, dilema ou sofrimento concreto que uma grande mente pode iluminar.',
      'A pessoa só cumprimentou, está desabafando sem pedir caminho, ou já recebeu uma recomendação.',
    );
    questions.mente = { type: 'choice', instructions: 'Qual grande mente melhor ajudaria a pessoa com o que ela trouxe na `mensagem_nova` e na `conversa`?', criteria: MIND_OPTIONS() };
  }
  const a = await decide(state, questions);
  const risk = a.risco?.noul ?? 0;
  let recommend = null;
  if (a.mente && a.recomendar) {
    const slug = a.mente.choice;
    if (a.recomendar.noul >= RECOMMEND_THRESHOLD && slug !== 'nenhuma' && ETT.bySlug[slug] && (a.mente.confidence ?? 1) >= MIND_CONFIDENCE) recommend = slug;
  }
  return { risk, crisis: risk >= RISK_THRESHOLD, recommend };
}

// Triagem: one noul per mind (several may fit, so they must not compete), ranked in code.
export async function rankMinds(answers) {
  const questions = Object.fromEntries(ETT.minds.map(m => [m.slug, noul(
    `Conversar com uma cápsula de ${m.name} (${m.spec}; ideia central: "${m.quote}") ajudaria esta pessoa com o que ela vive hoje, segundo as respostas da \`triagem\`?`,
    'As ideias dessa mente tocam diretamente as dificuldades, o desgaste ou o que a pessoa espera encontrar.',
    'As ideias dessa mente têm pouca relação com o momento da pessoa.',
  )]));
  const a = await decide({ triagem: answers }, questions);
  return ETT.minds.map(m => ({ slug: m.slug, p: a[m.slug]?.noul ?? 0 })).sort((x, y) => y.p - x.p);
}
