/**
 * Detecção simples de sinais de risco (suicídio, autolesão, violência) para
 * exibir recursos de ajuda imediatamente. É uma rede de proteção, não um
 * classificador clínico: o modelo também recebe instruções de segurança.
 */

const RISK_PATTERNS: RegExp[] = [
  /suicid/,
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
];

export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function detectRisk(text: string): boolean {
  const normalized = normalizeText(text);
  return RISK_PATTERNS.some((pattern) => pattern.test(normalized));
}

export const HELP_RESOURCES = [
  {
    name: "CVV — Centro de Valorização da Vida",
    contact: "Ligue 188",
    detail: "Gratuito, 24 horas, ou chat em cvv.org.br",
  },
  { name: "SAMU", contact: "Ligue 192", detail: "Emergências médicas" },
  { name: "Polícia", contact: "Ligue 190", detail: "Se você estiver em perigo agora" },
  { name: "Central de Atendimento à Mulher", contact: "Ligue 180", detail: "Violência contra a mulher, 24 horas" },
] as const;
