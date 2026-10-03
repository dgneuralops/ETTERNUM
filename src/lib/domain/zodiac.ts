export type ZodiacSlug =
  | "aries"
  | "touro"
  | "gemeos"
  | "cancer"
  | "leao"
  | "virgem"
  | "libra"
  | "escorpiao"
  | "sagitario"
  | "capricornio"
  | "aquario"
  | "peixes";

export type ZodiacSign = {
  slug: ZodiacSlug;
  name: string;
  symbol: string;
  /** Primeiro dia do signo, como [mês, dia]. */
  start: [number, number];
  element: "Fogo" | "Terra" | "Ar" | "Água";
  modality: "Cardinal" | "Fixo" | "Mutável";
  ruler: string;
  strengths: string;
  challenges: string;
  underStress: string;
  whatHelps: string;
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    slug: "aries",
    name: "Áries",
    symbol: "♈",
    start: [3, 21],
    element: "Fogo",
    modality: "Cardinal",
    ruler: "Marte",
    strengths: "coragem, iniciativa, franqueza e energia para começar",
    challenges: "impaciência, impulsividade e dificuldade em esperar resultados",
    underStress: "tende a reagir rápido demais, se irritar e querer resolver tudo na força",
    whatHelps: "movimento físico, metas curtas e claras, e uma pausa antes de decidir",
  },
  {
    slug: "touro",
    name: "Touro",
    symbol: "♉",
    start: [4, 20],
    element: "Terra",
    modality: "Fixo",
    ruler: "Vênus",
    strengths: "constância, paciência, senso prático e lealdade",
    challenges: "resistência a mudanças, teimosia e apego ao conforto",
    underStress: "tende a se fechar, travar decisões e buscar conforto (comida, rotina)",
    whatHelps: "rotina estável, contato com a natureza e mudanças feitas em pequenos passos",
  },
  {
    slug: "gemeos",
    name: "Gêmeos",
    symbol: "♊",
    start: [5, 21],
    element: "Ar",
    modality: "Mutável",
    ruler: "Mercúrio",
    strengths: "curiosidade, comunicação, versatilidade e raciocínio rápido",
    challenges: "dispersão, ansiedade mental e dificuldade em concluir",
    underStress: "tende a pensar demais, pular de tarefa em tarefa e ficar inquieto",
    whatHelps: "escrever para organizar a mente, conversar e escolher uma prioridade por vez",
  },
  {
    slug: "cancer",
    name: "Câncer",
    symbol: "♋",
    start: [6, 21],
    element: "Água",
    modality: "Cardinal",
    ruler: "Lua",
    strengths: "sensibilidade, cuidado, memória afetiva e intuição",
    challenges: "melindre, apego ao passado e dificuldade em se proteger sem se fechar",
    underStress: "tende a se recolher, se magoar com facilidade e cuidar de todos menos de si",
    whatHelps: "ambientes acolhedores, vínculos seguros e limites gentis com os outros",
  },
  {
    slug: "leao",
    name: "Leão",
    symbol: "♌",
    start: [7, 23],
    element: "Fogo",
    modality: "Fixo",
    ruler: "Sol",
    strengths: "generosidade, criatividade, liderança e calor humano",
    challenges: "orgulho, necessidade de reconhecimento e dificuldade em pedir ajuda",
    underStress: "tende a se sentir desvalorizado, dramatizar ou esconder a vulnerabilidade",
    whatHelps: "expressão criativa, reconhecimento sincero e lembrar que pedir ajuda também é força",
  },
  {
    slug: "virgem",
    name: "Virgem",
    symbol: "♍",
    start: [8, 23],
    element: "Terra",
    modality: "Mutável",
    ruler: "Mercúrio",
    strengths: "análise, organização, dedicação e senso de serviço",
    challenges: "perfeccionismo, autocrítica e preocupação excessiva",
    underStress: "tende a se cobrar demais, controlar detalhes e somatizar a ansiedade",
    whatHelps: "listas e planos simples, aceitar o 'bom o suficiente' e cuidar do corpo",
  },
  {
    slug: "libra",
    name: "Libra",
    symbol: "♎",
    start: [9, 23],
    element: "Ar",
    modality: "Cardinal",
    ruler: "Vênus",
    strengths: "diplomacia, senso de justiça, estética e capacidade de conciliar",
    challenges: "indecisão, dificuldade de dizer não e medo de conflito",
    underStress: "tende a adiar decisões, agradar os outros e engolir o que sente",
    whatHelps: "ambientes harmoniosos, critérios claros para decidir e treinar o 'não' com gentileza",
  },
  {
    slug: "escorpiao",
    name: "Escorpião",
    symbol: "♏",
    start: [10, 23],
    element: "Água",
    modality: "Fixo",
    ruler: "Plutão (tradicionalmente Marte)",
    strengths: "intensidade, profundidade, foco e capacidade de transformação",
    challenges: "desconfiança, controle e dificuldade em soltar mágoas",
    underStress: "tende a se fechar, desconfiar e remoer situações",
    whatHelps: "conversas profundas e honestas, canalizar a intensidade em projetos e praticar o perdão",
  },
  {
    slug: "sagitario",
    name: "Sagitário",
    symbol: "♐",
    start: [11, 22],
    element: "Fogo",
    modality: "Mutável",
    ruler: "Júpiter",
    strengths: "otimismo, busca de sentido, sinceridade e espírito aventureiro",
    challenges: "excesso de promessas, impaciência com rotina e franqueza que fere",
    underStress: "tende a fugir (viagens, distrações), exagerar ou se sentir preso",
    whatHelps: "horizontes novos, aprendizado, liberdade com compromisso e propósito claro",
  },
  {
    slug: "capricornio",
    name: "Capricórnio",
    symbol: "♑",
    start: [12, 22],
    element: "Terra",
    modality: "Cardinal",
    ruler: "Saturno",
    strengths: "disciplina, responsabilidade, ambição e visão de longo prazo",
    challenges: "rigidez, excesso de trabalho e dificuldade em descansar",
    underStress: "tende a carregar tudo sozinho, endurecer e medir o valor pela produtividade",
    whatHelps: "estrutura realista, delegar, celebrar conquistas e permitir-se descanso",
  },
  {
    slug: "aquario",
    name: "Aquário",
    symbol: "♒",
    start: [1, 20],
    element: "Ar",
    modality: "Fixo",
    ruler: "Urano (tradicionalmente Saturno)",
    strengths: "originalidade, visão de futuro, senso coletivo e independência",
    challenges: "distanciamento emocional, teimosia de ideias e sensação de não pertencer",
    underStress: "tende a se isolar, racionalizar sentimentos e se desconectar",
    whatHelps: "comunidades com propósito, espaço para ser diferente e nomear o que sente",
  },
  {
    slug: "peixes",
    name: "Peixes",
    symbol: "♓",
    start: [2, 19],
    element: "Água",
    modality: "Mutável",
    ruler: "Netuno (tradicionalmente Júpiter)",
    strengths: "empatia, imaginação, compaixão e espiritualidade",
    challenges: "fuga da realidade, limites difusos e absorver a dor dos outros",
    underStress: "tende a se sentir sobrecarregado, se perder no outro e fugir dos problemas",
    whatHelps: "arte, silêncio, práticas espirituais e limites claros para proteger a própria energia",
  },
];

const BY_SLUG = new Map(ZODIAC_SIGNS.map((s) => [s.slug, s]));

export function getZodiacSign(slug: string): ZodiacSign | undefined {
  return BY_SLUG.get(slug as ZodiacSlug);
}

export function isZodiacSlug(value: string): value is ZodiacSlug {
  return BY_SLUG.has(value as ZodiacSlug);
}

/** Lê uma data ISO (AAAA-MM-DD) sem passar por fuso horário. */
export function parseIsoDate(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day };
}

/** Signo solar (tropical) a partir da data de nascimento. */
export function zodiacFromBirthDate(iso: string): ZodiacSlug | null {
  const date = parseIsoDate(iso);
  if (!date) return null;
  const key = date.month * 100 + date.day;
  // Percorre do fim do ano para o começo: o primeiro início <= data é o signo.
  const ordered = [...ZODIAC_SIGNS].sort((a, b) => b.start[0] * 100 + b.start[1] - (a.start[0] * 100 + a.start[1]));
  for (const sign of ordered) {
    if (key >= sign.start[0] * 100 + sign.start[1]) return sign.slug;
  }
  // Antes de 20/01: ainda é Capricórnio.
  return "capricornio";
}

/** Idade completa em anos numa data de referência. */
export function ageOn(birthIso: string, today: Date = new Date()): number | null {
  const birth = parseIsoDate(birthIso);
  if (!birth) return null;
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  let age = y - birth.year;
  if (m < birth.month || (m === birth.month && d < birth.day)) age -= 1;
  return age;
}
