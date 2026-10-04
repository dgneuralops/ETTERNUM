import type { AgentText } from "./agents";

const es: Record<string, AgentText> = {
  urania: {
    name: "Urania",
    title: "Astróloga y guía del cosmos",
    focus: "Astrología · Autoconocimiento",
    era: "Inspirada en la musa griega de la astronomía",
    tagline: "Lee tu signo y el momento que vives como un mapa simbólico.",
  },
  "viktor-frankl": {
    title: "Psiquiatra, creador de la logoterapia",
    focus: "Sentido de la vida · Psicología",
    tagline: "Encontrar sentido incluso en el sufrimiento.",
  },
  "carl-jung": {
    title: "Psiquiatra, fundador de la psicología analítica",
    focus: "Psicología · Autoconocimiento",
    tagline: "Conocer tu propia sombra para volverte íntegro.",
  },
  "sigmund-freud": {
    title: "Médico, padre del psicoanálisis",
    focus: "Psicoanálisis · Inconsciente",
    tagline: "Lo que el inconsciente intenta decirte.",
  },
  "alfred-adler": {
    title: "Médico, fundador de la psicología individual",
    focus: "Coraje · Pertenencia",
    tagline: "Coraje para cambiar y sentimiento de comunidad.",
  },
  "carl-rogers": {
    title: "Psicólogo humanista",
    focus: "Escucha · Aceptación",
    tagline: "Ser escuchado de verdad, sin juicios.",
  },
  "william-james": {
    title: "Filósofo y padre de la psicología estadounidense",
    focus: "Hábitos · Atención",
    tagline: "Hábitos, atención y la fuerza de la voluntad.",
  },
  "nise-da-silveira": {
    title: "Psiquiatra brasileña, pionera de la terapia a través del arte",
    focus: "Salud mental · Arte y afecto",
    tagline: "Afecto, arte y libertad como caminos de sanación.",
  },
  socrates: {
    title: "Filósofo ateniense",
    focus: "Autoexamen · Preguntas",
    tagline: "Preguntas que revelan lo que realmente piensas.",
  },
  platao: {
    name: "Platón",
    title: "Filósofo, fundador de la Academia",
    focus: "Amor · Alma y justicia",
    tagline: "El amor, la justicia y el alma en armonía.",
  },
  aristoteles: {
    title: "Filósofo y científico",
    focus: "Virtud · Vida buena",
    tagline: "La virtud del término medio y la vida bien vivida.",
  },
  seneca: {
    name: "Séneca",
    title: "Filósofo estoico y consejero",
    focus: "Filosofía estoica · Decisiones de vida",
    tagline: "Serenidad, tiempo y coraje ante la adversidad.",
  },
  "marco-aurelio": {
    name: "Marco Aurelio",
    title: "Emperador romano y filósofo estoico",
    focus: "Estoicismo · Liderazgo",
    tagline: "Gobernarte a ti mismo antes de gobernar el mundo.",
  },
  epicteto: {
    title: "Filósofo estoico, nacido esclavo",
    focus: "Estoicismo · Libertad interior",
    tagline: "Libertad interior: ¿qué depende de ti?",
  },
  epicuro: {
    title: "Filósofo del placer sencillo",
    focus: "Placeres sencillos · Amistad",
    tagline: "Felicidad con amigos, pan y paz de espíritu.",
  },
  nietzsche: {
    title: "Filósofo",
    focus: "Filosofía existencial · Autenticidad",
    tagline: "Llegar a ser quien eres, con coraje.",
  },
  confucio: {
    name: "Confucio",
    title: "Sabio y educador chino",
    focus: "Carácter · Armonía en las relaciones",
    tagline: "Carácter, respeto y armonía en las relaciones.",
  },
  "lao-tse": {
    name: "Lao-Tse",
    title: "Sabio taoísta",
    focus: "Taoísmo · Fluidez",
    era: "s. VI a. C. (tradición)",
    tagline: "Fluir como el agua: fuerza en la suavidad.",
  },
  "hannah-arendt": {
    title: "Filósofa política",
    focus: "Filosofía política · Libertad",
    tagline: "Pensar por cuenta propia y actuar en el mundo.",
  },
  "santo-agostinho": {
    name: "San Agustín",
    title: "Filósofo y teólogo cristiano",
    focus: "Fe · Inquietud y búsqueda",
    tagline: "El corazón inquieto en busca de reposo.",
  },
  "tomas-de-aquino": {
    title: "Teólogo y filósofo",
    focus: "Fe y razón · Virtudes",
    tagline: "Fe y razón caminando juntas.",
  },
  "teresa-de-avila": {
    title: "Mística, escritora y reformadora",
    focus: "Mística · Paz interior",
    tagline: "Paz interior: el castillo dentro de ti.",
  },
  rumi: {
    title: "Poeta y místico sufí",
    focus: "Espiritualidad · Amor profundo",
    tagline: "El amor como camino; la herida como puerta de la luz.",
  },
  kierkegaard: {
    title: "Filósofo y teólogo",
    focus: "Angustia · Elección",
    tagline: "Angustia, elección y el salto de fe.",
  },
  maimonides: {
    name: "Maimónides",
    title: "Médico, filósofo y rabino",
    focus: "Salud · Camino del medio",
    tagline: "Salud del cuerpo y del alma por el camino del medio.",
  },
  "peter-drucker": {
    title: "Padre de la administración moderna",
    focus: "Gestión · Negocios estratégicos",
    tagline: "Hacer las cosas correctas, no solo hacer las cosas correctamente.",
  },
  "benjamin-franklin": {
    title: "Inventor, emprendedor y estadista",
    focus: "Disciplina · Emprendimiento",
    tagline: "Disciplina, curiosidad y sentido común práctico.",
  },
  "andrew-carnegie": {
    title: "Industrial y filántropo",
    focus: "Riqueza · Filantropía",
    tagline: "De cero a la cima — y la riqueza al servicio del bien.",
  },
  "barao-de-maua": {
    name: "Barón de Mauá",
    title: "Emprendedor pionero de Brasil",
    focus: "Emprender en Brasil",
    tagline: "Emprender en Brasil, con visión y coraje.",
  },
  "sun-tzu": {
    title: "Estratega militar chino",
    focus: "Estrategia · Conflictos",
    era: "s. V a. C.",
    tagline: "Estrategia: vencer antes de luchar.",
  },
  "dale-carnegie": {
    title: "Escritor y profesor de relaciones humanas",
    focus: "Comunicación · Relaciones humanas",
    tagline: "Cómo tratar con las personas y dejar de preocuparse.",
  },
  "erich-fromm": {
    title: "Psicoanalista y filósofo humanista",
    focus: "Amor · Humanismo",
    tagline: "Amar es un arte que se aprende.",
  },
  "leonardo-da-vinci": {
    title: "Artista, inventor y científico",
    focus: "Creatividad · Curiosidad",
    tagline: "Curiosidad sin límites y una mirada que lo conecta todo.",
  },
  "marie-curie": {
    title: "Científica, dos veces Premio Nobel",
    focus: "Ciencia · Persistencia",
    tagline: "Persistencia, rigor y coraje para abrir caminos.",
  },
  "maria-montessori": {
    title: "Médica y educadora",
    focus: "Educación · Autonomía",
    tagline: "Aprender con autonomía — y educar con respeto.",
  },
  herodoto: {
    title: "El padre de la Historia",
    focus: "Historia · Fortuna y medida",
    tagline: "Historias que enseñan sobre la fortuna y la medida.",
  },
  plutarco: {
    title: "Biógrafo y filósofo",
    focus: "Biografías · Carácter",
    tagline: "Vidas ejemplares como espejo de la tuya.",
  },
  "ibn-khaldun": {
    title: "Historiador y pensador social",
    focus: "Ciclos históricos · Cohesión",
    tagline: "Ciclos de auge y caída — de imperios y de proyectos.",
  },
  ptolomeu: {
    name: "Claudio Ptolomeo",
    title: "Astrónomo y astrólogo de Alejandría",
    focus: "Astrología clásica · Temperamentos",
    tagline: "Los cielos antiguos y el temperamento humano.",
  },
  "johannes-kepler": {
    title: "Astrónomo y matemático",
    focus: "Cosmos · Armonía",
    tagline: "La armonía del cosmos y la libertad humana.",
  },
  hipatia: {
    name: "Hipatia de Alejandría",
    title: "Matemática, astrónoma y filósofa",
    focus: "Astronomía · Pensamiento libre",
    tagline: "Pensar con libertad bajo el cielo de Alejandría.",
  },
  hipocrates: {
    title: "El padre de la medicina",
    focus: "Medicina · Hábitos saludables",
    tagline: "Alimento, sueño, movimiento y naturaleza en equilibrio.",
  },
  "clayton-christensen": {
    title: "Profesor de Harvard, teórico de la innovación",
    focus: "Innovación disruptiva · Estrategia",
    tagline: "¿Qué trabajo te contrata tu cliente para hacer?",
  },
  "steve-jobs": {
    title: "Cofundador de Apple",
    focus: "Creatividad · Liderazgo y producto",
    tagline: "Foco, simplicidad y la intersección entre tecnología y humanidad.",
  },
  "angela-duckworth": {
    title: "Psicóloga, investigadora de la determinación (grit)",
    focus: "Resiliencia · Rendimiento personal",
    tagline: "Pasión y perseverancia para metas a largo plazo.",
  },
  "jim-collins": {
    title: "Investigador de empresas excepcionales",
    focus: "Estrategia empresarial · Construcción de legado",
    tagline: "De buena a excelente: disciplina, las personas correctas y legado.",
  },
  "simone-de-beauvoir": {
    title: "Filósofa existencialista y escritora",
    focus: "Existencialismo · Libertad femenina",
    tagline: "Libertad, autenticidad y el derecho a inventarte.",
  },
  "alan-watts": {
    title: "Filósofo y divulgador del zen y del Tao",
    focus: "Conciencia · Presencia",
    tagline: "La sabiduría de la inseguridad y el arte de estar presente.",
  },
  "immanuel-kant": {
    title: "Filósofo de la Ilustración",
    focus: "Filosofía moral · Razón",
    tagline: "Atreverse a saber y actuar con dignidad.",
  },
  "jordan-peterson": {
    title: "Psicólogo clínico y profesor",
    focus: "Responsabilidad · Estructura psíquica",
    tagline: "Asumir la responsabilidad y poner orden en el caos.",
  },
  "clarissa-pinkola-estes": {
    title: "Psicoanalista junguiana y narradora de cuentos",
    focus: "Psicología arquetípica · Narrativas femeninas",
    tagline: "Mitos y cuentos como medicina para el alma.",
  },
  "gabor-mate": {
    title: "Médico, especialista en trauma y adicciones",
    focus: "Trauma · Salud mental",
    tagline: "No 'por qué la adicción', sino 'por qué el dolor'.",
  },
  "zygmunt-bauman": {
    title: "Sociólogo y filósofo",
    focus: "Sociología · Modernidad líquida",
    tagline: "Entender los tiempos líquidos para vivir vínculos sólidos.",
  },
  "paulo-freire": {
    title: "Educador y filósofo brasileño",
    focus: "Educación · Conciencia crítica",
    tagline: "Educar es un acto de diálogo, amor y esperanza.",
  },
  "angela-davis": {
    title: "Filósofa y activista",
    focus: "Justicia social · Derechos humanos",
    tagline: "La libertad es una lucha constante — y colectiva.",
  },
  "noam-chomsky": {
    title: "Lingüista e intelectual público",
    focus: "Lingüística · Política · Medios",
    tagline: "Pensar críticamente sobre el lenguaje, el poder y la información.",
  },
  "jesus-de-nazare": {
    name: "Jesús de Nazaret",
    title: "Maestro judío de Galilea, figura histórica y filosófica",
    focus: "Ética · Amor y transformación",
    tagline: "Amor al prójimo, perdón y transformación interior.",
  },
  "dalai-lama": {
    title: "Líder espiritual del budismo tibetano",
    focus: "Compasión · Sabiduría interior",
    era: "Tenzin Gyatso, nacido en 1935",
    tagline: "La compasión como camino hacia la felicidad.",
  },
  "eckhart-tolle": {
    title: "Autor y maestro espiritual",
    focus: "Presencia · Despertar espiritual",
    tagline: "El poder del ahora.",
  },
  "ramana-maharshi": {
    title: "Sabio indio del Advaita",
    focus: "Silencio · Autoconocimiento",
    tagline: "¿Quién soy yo? La pregunta que aquieta la mente.",
  },
  "elisabeth-kubler-ross": {
    title: "Psiquiatra, pionera en el acompañamiento del duelo",
    focus: "Duelo · Finitud",
    tagline: "Atravesar el duelo sin prisa y sin soledad.",
  },
  maestro: {
    title: "Tu amigo personal eterno",
    focus: "Tu amigo personal eterno",
    era: "Siempre contigo",
    tagline: "Habla de lo que quieras. El Maestro te recuerda y te lleva a la mente ideal cuando tiene sentido.",
  },
};

export default es;
