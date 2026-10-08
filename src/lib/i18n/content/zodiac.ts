import { ZODIAC_SIGNS, getZodiacSign, type ZodiacSign, type ZodiacSlug } from "@/lib/domain/zodiac";
import type { Locale } from "../config";

export type LocalizedSign = Omit<ZodiacSign, "element" | "modality"> & { element: string; modality: string };

type SignText = Pick<LocalizedSign, "name" | "ruler" | "strengths" | "challenges" | "underStress" | "whatHelps">;

const ELEMENTS: Record<Exclude<Locale, "pt-BR">, Record<ZodiacSign["element"], string>> = {
  en: { Fogo: "Fire", Terra: "Earth", Ar: "Air", Água: "Water" },
  es: { Fogo: "Fuego", Terra: "Tierra", Ar: "Aire", Água: "Agua" },
  fr: { Fogo: "Feu", Terra: "Terre", Ar: "Air", Água: "Eau" },
};

const MODALITIES: Record<Exclude<Locale, "pt-BR">, Record<ZodiacSign["modality"], string>> = {
  en: { Cardinal: "Cardinal", Fixo: "Fixed", Mutável: "Mutable" },
  es: { Cardinal: "Cardinal", Fixo: "Fijo", Mutável: "Mutable" },
  fr: { Cardinal: "Cardinal", Fixo: "Fixe", Mutável: "Mutable" },
};

const SIGNS: Record<Exclude<Locale, "pt-BR">, Record<ZodiacSlug, SignText>> = {
  en: {
    aries: {
      name: "Aries",
      ruler: "Mars",
      strengths: "courage, initiative, frankness and energy to start things",
      challenges: "impatience, impulsiveness and difficulty waiting for results",
      underStress: "tends to react too fast, get irritated and try to force solutions",
      whatHelps: "physical movement, short and clear goals, and a pause before deciding",
    },
    touro: {
      name: "Taurus",
      ruler: "Venus",
      strengths: "steadiness, patience, practical sense and loyalty",
      challenges: "resistance to change, stubbornness and attachment to comfort",
      underStress: "tends to shut down, stall decisions and seek comfort (food, routine)",
      whatHelps: "a stable routine, contact with nature and changes made in small steps",
    },
    gemeos: {
      name: "Gemini",
      ruler: "Mercury",
      strengths: "curiosity, communication, versatility and quick thinking",
      challenges: "scattered attention, mental anxiety and difficulty finishing",
      underStress: "tends to overthink, jump from task to task and feel restless",
      whatHelps: "writing to organize the mind, talking it through and choosing one priority at a time",
    },
    cancer: {
      name: "Cancer",
      ruler: "Moon",
      strengths: "sensitivity, care, emotional memory and intuition",
      challenges: "touchiness, attachment to the past and difficulty protecting oneself without shutting down",
      underStress: "tends to withdraw, get hurt easily and care for everyone except themselves",
      whatHelps: "nurturing environments, safe bonds and gentle boundaries with others",
    },
    leao: {
      name: "Leo",
      ruler: "Sun",
      strengths: "generosity, creativity, leadership and warmth",
      challenges: "pride, need for recognition and difficulty asking for help",
      underStress: "tends to feel undervalued, dramatize or hide vulnerability",
      whatHelps: "creative expression, sincere recognition and remembering that asking for help is also strength",
    },
    virgem: {
      name: "Virgo",
      ruler: "Mercury",
      strengths: "analysis, organization, dedication and a sense of service",
      challenges: "perfectionism, self-criticism and excessive worry",
      underStress: "tends to demand too much of themselves, control details and feel anxiety in the body",
      whatHelps: "simple lists and plans, accepting 'good enough' and taking care of the body",
    },
    libra: {
      name: "Libra",
      ruler: "Venus",
      strengths: "diplomacy, sense of justice, aesthetics and the ability to reconcile",
      challenges: "indecision, difficulty saying no and fear of conflict",
      underStress: "tends to postpone decisions, please others and swallow feelings",
      whatHelps: "harmonious environments, clear criteria for deciding and practicing a kind 'no'",
    },
    escorpiao: {
      name: "Scorpio",
      ruler: "Pluto (traditionally Mars)",
      strengths: "intensity, depth, focus and capacity for transformation",
      challenges: "distrust, control and difficulty letting go of hurt",
      underStress: "tends to shut down, distrust and ruminate",
      whatHelps: "deep and honest conversations, channeling intensity into projects and practicing forgiveness",
    },
    sagitario: {
      name: "Sagittarius",
      ruler: "Jupiter",
      strengths: "optimism, search for meaning, sincerity and an adventurous spirit",
      challenges: "overpromising, impatience with routine and bluntness that can hurt",
      underStress: "tends to escape (trips, distractions), exaggerate or feel trapped",
      whatHelps: "new horizons, learning, freedom with commitment and a clear purpose",
    },
    capricornio: {
      name: "Capricorn",
      ruler: "Saturn",
      strengths: "discipline, responsibility, ambition and long-term vision",
      challenges: "rigidity, overwork and difficulty resting",
      underStress: "tends to carry everything alone, harden and measure worth by productivity",
      whatHelps: "realistic structure, delegating, celebrating achievements and allowing rest",
    },
    aquario: {
      name: "Aquarius",
      ruler: "Uranus (traditionally Saturn)",
      strengths: "originality, vision of the future, collective sense and independence",
      challenges: "emotional distance, stubborn ideas and a feeling of not belonging",
      underStress: "tends to isolate, rationalize feelings and disconnect",
      whatHelps: "communities with purpose, room to be different and naming what they feel",
    },
    peixes: {
      name: "Pisces",
      ruler: "Neptune (traditionally Jupiter)",
      strengths: "empathy, imagination, compassion and spirituality",
      challenges: "escaping reality, blurry boundaries and absorbing others' pain",
      underStress: "tends to feel overwhelmed, lose themselves in others and avoid problems",
      whatHelps: "art, silence, spiritual practices and clear boundaries to protect their energy",
    },
  },
  es: {
    aries: {
      name: "Aries",
      ruler: "Marte",
      strengths: "valentía, iniciativa, franqueza y energía para empezar",
      challenges: "impaciencia, impulsividad y dificultad para esperar resultados",
      underStress: "tiende a reaccionar demasiado rápido, irritarse y querer resolverlo todo a la fuerza",
      whatHelps: "movimiento físico, metas cortas y claras, y una pausa antes de decidir",
    },
    touro: {
      name: "Tauro",
      ruler: "Venus",
      strengths: "constancia, paciencia, sentido práctico y lealtad",
      challenges: "resistencia al cambio, terquedad y apego a la comodidad",
      underStress: "tiende a cerrarse, frenar decisiones y buscar consuelo (comida, rutina)",
      whatHelps: "una rutina estable, contacto con la naturaleza y cambios en pasos pequeños",
    },
    gemeos: {
      name: "Géminis",
      ruler: "Mercurio",
      strengths: "curiosidad, comunicación, versatilidad y rapidez mental",
      challenges: "dispersión, ansiedad mental y dificultad para terminar",
      underStress: "tiende a pensar demasiado, saltar de tarea en tarea e inquietarse",
      whatHelps: "escribir para ordenar la mente, conversar y elegir una prioridad a la vez",
    },
    cancer: {
      name: "Cáncer",
      ruler: "Luna",
      strengths: "sensibilidad, cuidado, memoria afectiva e intuición",
      challenges: "susceptibilidad, apego al pasado y dificultad para protegerse sin cerrarse",
      underStress: "tiende a replegarse, herirse con facilidad y cuidar de todos menos de sí",
      whatHelps: "ambientes acogedores, vínculos seguros y límites amables con los demás",
    },
    leao: {
      name: "Leo",
      ruler: "Sol",
      strengths: "generosidad, creatividad, liderazgo y calidez",
      challenges: "orgullo, necesidad de reconocimiento y dificultad para pedir ayuda",
      underStress: "tiende a sentirse poco valorado, dramatizar o esconder la vulnerabilidad",
      whatHelps: "expresión creativa, reconocimiento sincero y recordar que pedir ayuda también es fuerza",
    },
    virgem: {
      name: "Virgo",
      ruler: "Mercurio",
      strengths: "análisis, organización, dedicación y vocación de servicio",
      challenges: "perfeccionismo, autocrítica y preocupación excesiva",
      underStress: "tiende a exigirse demasiado, controlar detalles y somatizar la ansiedad",
      whatHelps: "listas y planes sencillos, aceptar lo 'suficientemente bueno' y cuidar el cuerpo",
    },
    libra: {
      name: "Libra",
      ruler: "Venus",
      strengths: "diplomacia, sentido de la justicia, estética y capacidad de conciliar",
      challenges: "indecisión, dificultad para decir no y miedo al conflicto",
      underStress: "tiende a posponer decisiones, complacer a los demás y tragarse lo que siente",
      whatHelps: "ambientes armoniosos, criterios claros para decidir y practicar un 'no' amable",
    },
    escorpiao: {
      name: "Escorpio",
      ruler: "Plutón (tradicionalmente Marte)",
      strengths: "intensidad, profundidad, foco y capacidad de transformación",
      challenges: "desconfianza, control y dificultad para soltar los rencores",
      underStress: "tiende a cerrarse, desconfiar y darle vueltas a las cosas",
      whatHelps: "conversaciones profundas y honestas, canalizar la intensidad en proyectos y practicar el perdón",
    },
    sagitario: {
      name: "Sagitario",
      ruler: "Júpiter",
      strengths: "optimismo, búsqueda de sentido, sinceridad y espíritu aventurero",
      challenges: "prometer de más, impaciencia con la rutina y franqueza que hiere",
      underStress: "tiende a huir (viajes, distracciones), exagerar o sentirse atrapado",
      whatHelps: "horizontes nuevos, aprendizaje, libertad con compromiso y un propósito claro",
    },
    capricornio: {
      name: "Capricornio",
      ruler: "Saturno",
      strengths: "disciplina, responsabilidad, ambición y visión a largo plazo",
      challenges: "rigidez, exceso de trabajo y dificultad para descansar",
      underStress: "tiende a cargar con todo solo, endurecerse y medir su valor por la productividad",
      whatHelps: "estructura realista, delegar, celebrar los logros y permitirse descansar",
    },
    aquario: {
      name: "Acuario",
      ruler: "Urano (tradicionalmente Saturno)",
      strengths: "originalidad, visión de futuro, sentido colectivo e independencia",
      challenges: "distancia emocional, terquedad con las ideas y sensación de no pertenecer",
      underStress: "tiende a aislarse, racionalizar los sentimientos y desconectarse",
      whatHelps: "comunidades con propósito, espacio para ser diferente y nombrar lo que siente",
    },
    peixes: {
      name: "Piscis",
      ruler: "Neptuno (tradicionalmente Júpiter)",
      strengths: "empatía, imaginación, compasión y espiritualidad",
      challenges: "huir de la realidad, límites difusos y absorber el dolor ajeno",
      underStress: "tiende a sentirse sobrepasado, perderse en el otro y huir de los problemas",
      whatHelps: "arte, silencio, prácticas espirituales y límites claros para proteger su energía",
    },
  },
  fr: {
    aries: {
      name: "Bélier",
      ruler: "Mars",
      strengths: "courage, initiative, franchise et énergie pour commencer",
      challenges: "impatience, impulsivité et difficulté à attendre les résultats",
      underStress: "a tendance à réagir trop vite, à s'irriter et à vouloir tout régler par la force",
      whatHelps: "le mouvement physique, des objectifs courts et clairs, et une pause avant de décider",
    },
    touro: {
      name: "Taureau",
      ruler: "Vénus",
      strengths: "constance, patience, sens pratique et loyauté",
      challenges: "résistance au changement, entêtement et attachement au confort",
      underStress: "a tendance à se fermer, à bloquer les décisions et à chercher du réconfort (nourriture, routine)",
      whatHelps: "une routine stable, le contact avec la nature et des changements à petits pas",
    },
    gemeos: {
      name: "Gémeaux",
      ruler: "Mercure",
      strengths: "curiosité, communication, polyvalence et vivacité d'esprit",
      challenges: "dispersion, anxiété mentale et difficulté à terminer",
      underStress: "a tendance à trop réfléchir, à sauter d'une tâche à l'autre et à s'agiter",
      whatHelps: "écrire pour mettre de l'ordre dans ses idées, en parler et choisir une priorité à la fois",
    },
    cancer: {
      name: "Cancer",
      ruler: "Lune",
      strengths: "sensibilité, bienveillance, mémoire affective et intuition",
      challenges: "susceptibilité, attachement au passé et difficulté à se protéger sans se fermer",
      underStress: "a tendance à se replier, à se blesser facilement et à prendre soin de tous sauf de soi",
      whatHelps: "des environnements chaleureux, des liens sûrs et des limites douces avec les autres",
    },
    leao: {
      name: "Lion",
      ruler: "Soleil",
      strengths: "générosité, créativité, leadership et chaleur humaine",
      challenges: "orgueil, besoin de reconnaissance et difficulté à demander de l'aide",
      underStress: "a tendance à se sentir dévalorisé, à dramatiser ou à cacher sa vulnérabilité",
      whatHelps:
        "l'expression créative, une reconnaissance sincère et se rappeler que demander de l'aide est aussi une force",
    },
    virgem: {
      name: "Vierge",
      ruler: "Mercure",
      strengths: "analyse, organisation, dévouement et sens du service",
      challenges: "perfectionnisme, autocritique et inquiétude excessive",
      underStress: "a tendance à trop exiger de soi, à contrôler les détails et à somatiser l'anxiété",
      whatHelps: "des listes et des plans simples, accepter le « suffisamment bien » et prendre soin du corps",
    },
    libra: {
      name: "Balance",
      ruler: "Vénus",
      strengths: "diplomatie, sens de la justice, esthétique et capacité à concilier",
      challenges: "indécision, difficulté à dire non et peur du conflit",
      underStress: "a tendance à repousser les décisions, à vouloir plaire et à ravaler ce qu'il ressent",
      whatHelps:
        "des environnements harmonieux, des critères clairs pour décider et s'exercer à un « non » bienveillant",
    },
    escorpiao: {
      name: "Scorpion",
      ruler: "Pluton (traditionnellement Mars)",
      strengths: "intensité, profondeur, concentration et capacité de transformation",
      challenges: "méfiance, contrôle et difficulté à lâcher les rancunes",
      underStress: "a tendance à se fermer, à se méfier et à ruminer",
      whatHelps:
        "des conversations profondes et honnêtes, canaliser l'intensité dans des projets et pratiquer le pardon",
    },
    sagitario: {
      name: "Sagittaire",
      ruler: "Jupiter",
      strengths: "optimisme, quête de sens, sincérité et esprit d'aventure",
      challenges: "promesses excessives, impatience face à la routine et franchise qui blesse",
      underStress: "a tendance à fuir (voyages, distractions), à exagérer ou à se sentir enfermé",
      whatHelps: "de nouveaux horizons, l'apprentissage, la liberté avec engagement et un but clair",
    },
    capricornio: {
      name: "Capricorne",
      ruler: "Saturne",
      strengths: "discipline, responsabilité, ambition et vision à long terme",
      challenges: "rigidité, excès de travail et difficulté à se reposer",
      underStress: "a tendance à tout porter seul, à se durcir et à mesurer sa valeur à sa productivité",
      whatHelps: "une structure réaliste, déléguer, célébrer les réussites et s'autoriser le repos",
    },
    aquario: {
      name: "Verseau",
      ruler: "Uranus (traditionnellement Saturne)",
      strengths: "originalité, vision d'avenir, sens du collectif et indépendance",
      challenges: "distance émotionnelle, entêtement dans les idées et sentiment de ne pas appartenir",
      underStress: "a tendance à s'isoler, à rationaliser ses émotions et à se déconnecter",
      whatHelps: "des communautés porteuses de sens, de l'espace pour être différent et nommer ce qu'il ressent",
    },
    peixes: {
      name: "Poissons",
      ruler: "Neptune (traditionnellement Jupiter)",
      strengths: "empathie, imagination, compassion et spiritualité",
      challenges: "fuite de la réalité, limites floues et absorption de la douleur des autres",
      underStress: "a tendance à se sentir submergé, à se perdre dans l'autre et à fuir les problèmes",
      whatHelps: "l'art, le silence, les pratiques spirituelles et des limites claires pour protéger son énergie",
    },
  },
};

export function localizeSign(sign: ZodiacSign, locale: Locale): LocalizedSign {
  if (locale === "pt-BR") return sign;
  return {
    ...sign,
    ...SIGNS[locale][sign.slug],
    element: ELEMENTS[locale][sign.element],
    modality: MODALITIES[locale][sign.modality],
  };
}

export function getLocalizedSign(slug: string, locale: Locale): LocalizedSign | undefined {
  const sign = getZodiacSign(slug);
  return sign && localizeSign(sign, locale);
}

export function localizedSigns(locale: Locale): LocalizedSign[] {
  return ZODIAC_SIGNS.map((s) => localizeSign(s, locale));
}
