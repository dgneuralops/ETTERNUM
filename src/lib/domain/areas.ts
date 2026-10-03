export type AreaSlug =
  | "mente"
  | "legado"
  | "relacionamentos"
  | "negocios"
  | "filosofia"
  | "espiritualidade"
  | "conhecimento"
  | "sociedade"
  | "astrologia"
  | "corpo";

export type AreaIcon =
  "Brain" | "Infinity" | "Heart" | "Briefcase" | "Landmark" | "Sparkles" | "BookOpen" | "ScrollText" | "Moon" | "Leaf";

export type Area = {
  slug: AreaSlug;
  name: string;
  /** Uma linha para cards. */
  short: string;
  /** Texto do cabeçalho da página da área. */
  description: string;
  /** Cor de destaque (hex) usada em detalhes da área. */
  color: string;
  icon: AreaIcon;
};

/** Ordenadas pela urgência da dor e pelo apelo emocional (prioridades do MVP primeiro). */
export const AREAS: Area[] = [
  {
    slug: "mente",
    name: "Vida Interior & Autoconhecimento",
    short: "Ansiedade, propósito, identidade e equilíbrio emocional.",
    description:
      "Um lugar para desabafar e entender o que se passa por dentro — com grandes psicólogos, terapeutas e mestres da presença.",
    color: "#c9a7ff",
    icon: "Brain",
  },
  {
    slug: "legado",
    name: "Luto, Memória & Legado",
    short: "Perdas, finitude e o que permanece de nós.",
    description: "Para atravessar perdas, fazer as pazes com a finitude e pensar no legado que você quer deixar.",
    color: "#e0c78e",
    icon: "Infinity",
  },
  {
    slug: "relacionamentos",
    name: "Relacionamentos & Conexões",
    short: "Amor, família, solidão e perdão.",
    description: "Vínculos, conflitos, separações e reencontros — conselhos de quem pensou profundamente sobre o amor.",
    color: "#f2a7b8",
    icon: "Heart",
  },
  {
    slug: "negocios",
    name: "Negócios & Liderança",
    short: "Decidir, liderar, empreender e inovar.",
    description:
      "Um conselho consultivo pessoal para a solidão de quem decide: estratégia, inovação, liderança e carreira.",
    color: "#f0c36d",
    icon: "Briefcase",
  },
  {
    slug: "filosofia",
    name: "Filosofia & Sabedoria",
    short: "Propósito, escolhas e como viver bem.",
    description: "As grandes perguntas sobre a vida, a liberdade e a felicidade, com os maiores filósofos da história.",
    color: "#9ec5f5",
    icon: "Landmark",
  },
  {
    slug: "espiritualidade",
    name: "Espiritualidade & Fé",
    short: "Fé, silêncio, perdão e paz interior.",
    description:
      "Conversas sobre fé, transcendência e paz interior com teólogos, místicos e sábios de várias tradições.",
    color: "#d8c4ff",
    icon: "Sparkles",
  },
  {
    slug: "conhecimento",
    name: "Conhecimento & Educação",
    short: "Aprender, estudar, criar e ensinar.",
    description:
      "Como aprender melhor, estudar com foco e cultivar a curiosidade — com grandes mentes da ciência e da educação.",
    color: "#8fd9b6",
    icon: "BookOpen",
  },
  {
    slug: "sociedade",
    name: "Sociedade & História",
    short: "O mundo, o poder e as lições do passado.",
    description:
      "Entenda sua vida à luz da história e das forças da sociedade, com historiadores e pensadores sociais.",
    color: "#f3a977",
    icon: "ScrollText",
  },
  {
    slug: "astrologia",
    name: "Astrologia & Cosmos",
    short: "Seu signo, os astros e o seu modo de ser.",
    description:
      "Cruze seu signo com o momento que você vive e entenda seu temperamento através do céu — astrologia como lente simbólica.",
    color: "#b9a6f2",
    icon: "Moon",
  },
  {
    slug: "corpo",
    name: "Corpo & Bem-estar",
    short: "Alimentação, sono, hábitos e vitalidade.",
    description: "Hábitos, alimentação e equilíbrio entre corpo e mente, com sábios da medicina e da boa vida.",
    color: "#a4dd8c",
    icon: "Leaf",
  },
];

const BY_SLUG = new Map(AREAS.map((a) => [a.slug, a]));

export function getArea(slug: string): Area | undefined {
  return BY_SLUG.get(slug as AreaSlug);
}

export function isAreaSlug(value: string): value is AreaSlug {
  return BY_SLUG.has(value as AreaSlug);
}
