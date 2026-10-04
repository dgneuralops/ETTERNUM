import { AREAS, type Area, type AreaSlug } from "@/lib/domain/areas";
import type { Locale } from "../config";

type AreaText = Pick<Area, "name" | "short" | "description">;

const TRANSLATIONS: Record<Exclude<Locale, "pt-BR">, Record<AreaSlug, AreaText>> = {
  en: {
    mente: {
      name: "Inner Life & Self-Knowledge",
      short: "Anxiety, purpose, identity and emotional balance.",
      description:
        "A place to vent and understand what's going on inside — with great psychologists, therapists and masters of presence.",
    },
    legado: {
      name: "Grief, Memory & Legacy",
      short: "Loss, finitude and what remains of us.",
      description: "To get through loss, make peace with finitude and think about the legacy you want to leave.",
    },
    relacionamentos: {
      name: "Relationships & Connection",
      short: "Love, family, loneliness and forgiveness.",
      description: "Bonds, conflicts, breakups and reunions — advice from those who thought deeply about love.",
    },
    negocios: {
      name: "Business & Leadership",
      short: "Decide, lead, build and innovate.",
      description:
        "A personal advisory board for the loneliness of those who decide: strategy, innovation, leadership and career.",
    },
    filosofia: {
      name: "Philosophy & Wisdom",
      short: "Purpose, choices and how to live well.",
      description: "Life's big questions about freedom and happiness, with history's greatest philosophers.",
    },
    espiritualidade: {
      name: "Spirituality & Faith",
      short: "Faith, silence, forgiveness and inner peace.",
      description:
        "Conversations about faith, transcendence and inner peace with theologians, mystics and sages of many traditions.",
    },
    conhecimento: {
      name: "Knowledge & Learning",
      short: "Learn, study, create and teach.",
      description:
        "How to learn better, study with focus and nurture curiosity — with great minds of science and education.",
    },
    sociedade: {
      name: "Society & History",
      short: "The world, power and the lessons of the past.",
      description:
        "Understand your life in light of history and the forces of society, with historians and social thinkers.",
    },
    astrologia: {
      name: "Astrology & Cosmos",
      short: "Your sign, the stars and your way of being.",
      description:
        "Cross your sign with what you're living through and understand your temperament through the sky — astrology as a symbolic lens.",
    },
    corpo: {
      name: "Body & Well-being",
      short: "Food, sleep, habits and vitality.",
      description: "Habits, food and balance between body and mind, with sages of medicine and the good life.",
    },
  },
  es: {
    mente: {
      name: "Vida Interior y Autoconocimiento",
      short: "Ansiedad, propósito, identidad y equilibrio emocional.",
      description:
        "Un lugar para desahogarte y entender lo que pasa por dentro — con grandes psicólogos, terapeutas y maestros de la presencia.",
    },
    legado: {
      name: "Duelo, Memoria y Legado",
      short: "Pérdidas, finitud y lo que queda de nosotros.",
      description: "Para atravesar pérdidas, hacer las paces con la finitud y pensar en el legado que quieres dejar.",
    },
    relacionamentos: {
      name: "Relaciones y Vínculos",
      short: "Amor, familia, soledad y perdón.",
      description:
        "Vínculos, conflictos, separaciones y reencuentros — consejos de quienes pensaron a fondo sobre el amor.",
    },
    negocios: {
      name: "Negocios y Liderazgo",
      short: "Decidir, liderar, emprender e innovar.",
      description:
        "Un consejo asesor personal para la soledad de quien decide: estrategia, innovación, liderazgo y carrera.",
    },
    filosofia: {
      name: "Filosofía y Sabiduría",
      short: "Propósito, decisiones y cómo vivir bien.",
      description:
        "Las grandes preguntas sobre la vida, la libertad y la felicidad, con los mayores filósofos de la historia.",
    },
    espiritualidade: {
      name: "Espiritualidad y Fe",
      short: "Fe, silencio, perdón y paz interior.",
      description:
        "Conversaciones sobre fe, trascendencia y paz interior con teólogos, místicos y sabios de muchas tradiciones.",
    },
    conhecimento: {
      name: "Conocimiento y Educación",
      short: "Aprender, estudiar, crear y enseñar.",
      description:
        "Cómo aprender mejor, estudiar con foco y cultivar la curiosidad — con grandes mentes de la ciencia y la educación.",
    },
    sociedade: {
      name: "Sociedad e Historia",
      short: "El mundo, el poder y las lecciones del pasado.",
      description:
        "Entiende tu vida a la luz de la historia y de las fuerzas de la sociedad, con historiadores y pensadores sociales.",
    },
    astrologia: {
      name: "Astrología y Cosmos",
      short: "Tu signo, los astros y tu manera de ser.",
      description:
        "Cruza tu signo con el momento que vives y entiende tu temperamento a través del cielo — la astrología como lente simbólica.",
    },
    corpo: {
      name: "Cuerpo y Bienestar",
      short: "Alimentación, sueño, hábitos y vitalidad.",
      description:
        "Hábitos, alimentación y equilibrio entre cuerpo y mente, con sabios de la medicina y de la buena vida.",
    },
  },
  fr: {
    mente: {
      name: "Vie Intérieure & Connaissance de soi",
      short: "Anxiété, sens, identité et équilibre émotionnel.",
      description:
        "Un lieu pour vous confier et comprendre ce qui se passe en vous — avec de grands psychologues, thérapeutes et maîtres de la présence.",
    },
    legado: {
      name: "Deuil, Mémoire & Héritage",
      short: "Pertes, finitude et ce qui reste de nous.",
      description:
        "Pour traverser les pertes, faire la paix avec la finitude et penser à l'héritage que vous voulez laisser.",
    },
    relacionamentos: {
      name: "Relations & Liens",
      short: "Amour, famille, solitude et pardon.",
      description:
        "Liens, conflits, séparations et retrouvailles — les conseils de ceux qui ont pensé l'amour en profondeur.",
    },
    negocios: {
      name: "Affaires & Leadership",
      short: "Décider, diriger, entreprendre et innover.",
      description:
        "Un conseil consultatif personnel pour la solitude de ceux qui décident : stratégie, innovation, leadership et carrière.",
    },
    filosofia: {
      name: "Philosophie & Sagesse",
      short: "Sens, choix et art de bien vivre.",
      description:
        "Les grandes questions sur la vie, la liberté et le bonheur, avec les plus grands philosophes de l'histoire.",
    },
    espiritualidade: {
      name: "Spiritualité & Foi",
      short: "Foi, silence, pardon et paix intérieure.",
      description:
        "Des conversations sur la foi, la transcendance et la paix intérieure avec des théologiens, des mystiques et des sages de nombreuses traditions.",
    },
    conhecimento: {
      name: "Savoir & Éducation",
      short: "Apprendre, étudier, créer et enseigner.",
      description:
        "Comment mieux apprendre, étudier avec concentration et cultiver la curiosité — avec de grands esprits de la science et de l'éducation.",
    },
    sociedade: {
      name: "Société & Histoire",
      short: "Le monde, le pouvoir et les leçons du passé.",
      description:
        "Comprenez votre vie à la lumière de l'histoire et des forces de la société, avec des historiens et des penseurs sociaux.",
    },
    astrologia: {
      name: "Astrologie & Cosmos",
      short: "Votre signe, les astres et votre façon d'être.",
      description:
        "Croisez votre signe avec ce que vous vivez et comprenez votre tempérament à travers le ciel — l'astrologie comme lentille symbolique.",
    },
    corpo: {
      name: "Corps & Bien-être",
      short: "Alimentation, sommeil, habitudes et vitalité.",
      description:
        "Habitudes, alimentation et équilibre entre le corps et l'esprit, avec des sages de la médecine et de l'art de bien vivre.",
    },
  },
};

export function localizeArea(area: Area, locale: Locale): Area {
  if (locale === "pt-BR") return area;
  const text = TRANSLATIONS[locale][area.slug];
  return text ? { ...area, ...text } : area;
}

export function localizedAreas(locale: Locale): Area[] {
  return AREAS.map((a) => localizeArea(a, locale));
}

/** Para testes: confirma que toda área tem tradução em todos os idiomas. */
export function missingAreaTranslations(): string[] {
  const missing: string[] = [];
  for (const [locale, table] of Object.entries(TRANSLATIONS)) {
    for (const area of AREAS) if (!table[area.slug]?.name) missing.push(`${locale}:${area.slug}`);
  }
  return missing;
}
