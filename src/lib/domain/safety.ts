/**
 * Detecção simples de sinais de risco (suicídio, autolesão, violência) para
 * exibir recursos de ajuda imediatamente. É uma rede de proteção, não um
 * classificador clínico: o modelo também recebe instruções de segurança.
 *
 * Os padrões dos quatro idiomas são sempre verificados juntos, porque a pessoa
 * pode escrever num idioma diferente do que escolheu para a interface.
 * As linhas de ajuda por idioma ficam em `src/lib/i18n/content/crisis.ts`.
 */

const RISK_PATTERNS: RegExp[] = [
  // Vale para todos os idiomas: suicídio, suicide, suicidio, suicidaire...
  /suicid/,

  // Português
  /\bme matar\b/,
  /\bmatar a mim\b/,
  /\btirar (a )?minha (propria )?vida\b/,
  /\bacabar com (a )?minha vida\b/,
  /\bquero morrer\b/,
  /\bqueria morrer\b/,
  /\bvontade de morrer\b/,
  /\bpensando em morrer\b/,
  /\bsem vontade de viver\b/,
  /\bnao (quero|aguento) mais viver\b/,
  /\bnao vale a pena viver\b/,
  /\bme (cortar|cortei|corto)\b/,
  /\bautomutila/,
  /\bme machucar\b/,
  /\bsumir (pra|para) sempre\b/,
  /\bmelhor sem mim\b/,
  /\bme (bate|espanca|agride|ameaca)\b/,

  // English
  /\bkill(ing)? myself\b/,
  /\bend(ing)? my (own )?life\b/,
  /\btake my (own )?life\b/,
  /\bwant(ed)? to die\b/,
  /\bwanna die\b/,
  /\bwish i (was|were) dead\b/,
  /\bno reason to live\b/,
  /\bdon'?t want to (live|be alive)\b/,
  /\bcan'?t go on living\b/,
  /\bself[- ]?harm/,
  /\b(cut|cutting|hurt|hurting) myself\b/,
  /\bbetter off without me\b/,
  /\b(he|she|they) (hits|beats|threatens) me\b/,

  // Español
  /\b(quiero|voy a|pienso en|pensando en|ganas de) matarme\b/,
  /\bme quiero matar\b/,
  /\bquitarme la vida\b/,
  /\bacabar con mi vida\b/,
  /\b(quiero|quisiera|queria) morir(me)?\b/,
  /\bganas de morir(me)?\b/,
  /\bno quiero (vivir|seguir viviendo)\b/,
  /\bno vale la pena vivir\b/,
  /\bcortarme\b(?! el (pelo|cabello))/,
  /\b(hacerme dano|lastimarme)\b/,
  /\bautolesion/,
  /\bmejor sin mi\b/,
  /\bme (pega|golpea|amenaza)\b/,

  // Français
  /\b(vais|veux|voudrais|envie de|pense a|pensais a) me tuer\b/,
  /\bmettre fin a (mes jours|ma vie)\b/,
  /\bveux en finir\b/,
  /\b(veux|voudrais) mourir\b/,
  /\benvie de mourir\b/,
  /\bplus envie de vivre\b/,
  /\bme (couper|scarifier|faire du mal)\b/,
  /\bautomutil/,
  /\bmieux sans moi\b/,
  /\b(il|elle) me (frappe|bat|menace)\b/,
];

export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").replace(/[’‘]/g, "'").toLowerCase();
}

export function detectRisk(text: string): boolean {
  const normalized = normalizeText(text);
  return RISK_PATTERNS.some((pattern) => pattern.test(normalized));
}
