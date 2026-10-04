import type { AgentText } from "./agents";

const en: Record<string, AgentText> = {
  urania: {
    name: "Urania",
    title: "Astrologer and guide to the cosmos",
    focus: "Astrology · Self-knowledge",
    era: "Inspired by the Greek muse of astronomy",
    tagline: "Reads your sign and the moment you're living as a symbolic map.",
  },
  "viktor-frankl": {
    title: "Psychiatrist, founder of Logotherapy",
    focus: "Meaning of life · Psychology",
    tagline: "Finding meaning even in suffering.",
  },
  "carl-jung": {
    title: "Psychiatrist, founder of analytical psychology",
    focus: "Psychology · Self-knowledge",
    tagline: "Know your own shadow to become whole.",
  },
  "sigmund-freud": {
    title: "Physician, father of psychoanalysis",
    focus: "Psychoanalysis · The unconscious",
    tagline: "What the unconscious is trying to tell you.",
  },
  "alfred-adler": {
    title: "Physician, founder of individual psychology",
    focus: "Courage · Belonging",
    tagline: "Courage to change and a sense of community.",
  },
  "carl-rogers": {
    title: "Humanistic psychologist",
    focus: "Listening · Acceptance",
    tagline: "Being truly heard, without judgment.",
  },
  "william-james": {
    title: "Philosopher and father of American psychology",
    focus: "Habits · Attention",
    tagline: "Habits, attention and the power of will.",
  },
  "nise-da-silveira": {
    title: "Brazilian psychiatrist, pioneer of art therapy",
    focus: "Mental health · Art and affection",
    tagline: "Affection, art and freedom as paths to healing.",
  },
  socrates: {
    name: "Socrates",
    title: "Athenian philosopher",
    focus: "Self-examination · Questions",
    tagline: "Questions that reveal what you really think.",
  },
  platao: {
    name: "Plato",
    title: "Philosopher, founder of the Academy",
    focus: "Love · Soul and justice",
    tagline: "Love, justice and a soul in harmony.",
  },
  aristoteles: {
    name: "Aristotle",
    title: "Philosopher and scientist",
    focus: "Virtue · The good life",
    tagline: "The virtue of the mean and a life well lived.",
  },
  seneca: {
    name: "Seneca",
    title: "Stoic philosopher and advisor",
    focus: "Stoic philosophy · Life decisions",
    tagline: "Serenity, time and courage in the face of adversity.",
  },
  "marco-aurelio": {
    name: "Marcus Aurelius",
    title: "Roman emperor and Stoic philosopher",
    focus: "Stoicism · Leadership",
    tagline: "Govern yourself before governing the world.",
  },
  epicteto: {
    name: "Epictetus",
    title: "Stoic philosopher, born a slave",
    focus: "Stoicism · Inner freedom",
    tagline: "Inner freedom: what is up to you?",
  },
  epicuro: {
    name: "Epicurus",
    title: "Philosopher of simple pleasures",
    focus: "Simple pleasures · Friendship",
    tagline: "Happiness with friends, bread and peace of mind.",
  },
  nietzsche: {
    title: "Philosopher",
    focus: "Existential philosophy · Authenticity",
    tagline: "Become who you are, with courage.",
  },
  confucio: {
    name: "Confucius",
    title: "Chinese sage and educator",
    focus: "Character · Harmony in relationships",
    tagline: "Character, respect and harmony in relationships.",
  },
  "lao-tse": {
    name: "Lao Tzu",
    title: "Taoist sage",
    focus: "Taoism · Flow",
    era: "6th century BC (traditional)",
    tagline: "Flow like water: strength in softness.",
  },
  "hannah-arendt": {
    title: "Political philosopher",
    focus: "Political philosophy · Freedom",
    tagline: "Think for yourself and act in the world.",
  },
  "santo-agostinho": {
    name: "Saint Augustine",
    title: "Christian philosopher and theologian",
    focus: "Faith · Restlessness and search",
    tagline: "The restless heart in search of rest.",
  },
  "tomas-de-aquino": {
    name: "Thomas Aquinas",
    title: "Theologian and philosopher",
    focus: "Faith and reason · Virtues",
    tagline: "Faith and reason walking together.",
  },
  "teresa-de-avila": {
    name: "Teresa of Ávila",
    title: "Mystic, writer and reformer",
    focus: "Mysticism · Inner peace",
    tagline: "Inner peace: the castle within you.",
  },
  rumi: {
    title: "Sufi poet and mystic",
    focus: "Spirituality · Deep love",
    tagline: "Love as the path; the wound as the place where the light enters.",
  },
  kierkegaard: {
    title: "Philosopher and theologian",
    focus: "Anxiety · Choice",
    tagline: "Anxiety, choice and the leap of faith.",
  },
  maimonides: {
    name: "Maimonides",
    title: "Physician, philosopher and rabbi",
    focus: "Health · The middle way",
    tagline: "Health of body and soul through the middle way.",
  },
  "peter-drucker": {
    title: "Father of modern management",
    focus: "Management · Business strategy",
    tagline: "Do the right things, not just do things right.",
  },
  "benjamin-franklin": {
    title: "Inventor, entrepreneur and statesman",
    focus: "Discipline · Entrepreneurship",
    tagline: "Discipline, curiosity and practical common sense.",
  },
  "andrew-carnegie": {
    title: "Industrialist and philanthropist",
    focus: "Wealth · Philanthropy",
    tagline: "From nothing to the top — and wealth in the service of good.",
  },
  "barao-de-maua": {
    name: "Baron of Mauá",
    title: "Brazil's pioneering entrepreneur",
    focus: "Entrepreneurship in Brazil",
    tagline: "Building in Brazil, with vision and courage.",
  },
  "sun-tzu": {
    title: "Chinese military strategist",
    focus: "Strategy · Conflict",
    era: "5th century BC",
    tagline: "Strategy: win before you fight.",
  },
  "dale-carnegie": {
    title: "Writer and teacher of human relations",
    focus: "Communication · Human relations",
    tagline: "How to deal with people and stop worrying.",
  },
  "erich-fromm": {
    title: "Psychoanalyst and humanist philosopher",
    focus: "Love · Humanism",
    tagline: "Loving is an art that can be learned.",
  },
  "leonardo-da-vinci": {
    title: "Artist, inventor and scientist",
    focus: "Creativity · Curiosity",
    tagline: "Boundless curiosity and an eye that connects everything.",
  },
  "marie-curie": {
    title: "Scientist, two-time Nobel laureate",
    focus: "Science · Persistence",
    tagline: "Persistence, rigor and the courage to open new paths.",
  },
  "maria-montessori": {
    title: "Physician and educator",
    focus: "Education · Autonomy",
    tagline: "Learning with autonomy — and teaching with respect.",
  },
  herodoto: {
    name: "Herodotus",
    title: "The father of history",
    focus: "History · Fortune and measure",
    tagline: "Stories that teach about fortune and measure.",
  },
  plutarco: {
    name: "Plutarch",
    title: "Biographer and philosopher",
    focus: "Biographies · Character",
    tagline: "Exemplary lives as a mirror for your own.",
  },
  "ibn-khaldun": {
    title: "Historian and social thinker",
    focus: "Historical cycles · Cohesion",
    tagline: "Cycles of rise and fall — of empires and of projects.",
  },
  ptolomeu: {
    name: "Claudius Ptolemy",
    title: "Astronomer and astrologer of Alexandria",
    focus: "Classical astrology · Temperaments",
    tagline: "The ancient heavens and human temperament.",
  },
  "johannes-kepler": {
    title: "Astronomer and mathematician",
    focus: "Cosmos · Harmony",
    tagline: "The harmony of the cosmos and human freedom.",
  },
  hipatia: {
    name: "Hypatia of Alexandria",
    title: "Mathematician, astronomer and philosopher",
    focus: "Astronomy · Free thought",
    tagline: "Thinking freely under the sky of Alexandria.",
  },
  hipocrates: {
    name: "Hippocrates",
    title: "The father of medicine",
    focus: "Medicine · Healthy habits",
    tagline: "Food, sleep, movement and nature in balance.",
  },
  "clayton-christensen": {
    title: "Harvard professor, innovation theorist",
    focus: "Disruptive innovation · Strategy",
    tagline: "What job does your customer hire you to do?",
  },
  "steve-jobs": {
    title: "Co-founder of Apple",
    focus: "Creativity · Leadership and product",
    tagline: "Focus, simplicity and the intersection of technology and humanity.",
  },
  "angela-duckworth": {
    title: "Psychologist, researcher of grit",
    focus: "Resilience · Personal performance",
    tagline: "Passion and perseverance for long-term goals.",
  },
  "jim-collins": {
    title: "Researcher of exceptional companies",
    focus: "Business strategy · Building a legacy",
    tagline: "Good to great: discipline, the right people and legacy.",
  },
  "simone-de-beauvoir": {
    title: "Existentialist philosopher and writer",
    focus: "Existentialism · Women's freedom",
    tagline: "Freedom, authenticity and the right to invent yourself.",
  },
  "alan-watts": {
    title: "Philosopher and popularizer of Zen and the Tao",
    focus: "Consciousness · Presence",
    tagline: "The wisdom of insecurity and the art of being present.",
  },
  "immanuel-kant": {
    title: "Enlightenment philosopher",
    focus: "Moral philosophy · Reason",
    tagline: "Dare to know and act with dignity.",
  },
  "jordan-peterson": {
    title: "Clinical psychologist and professor",
    focus: "Responsibility · Psychological structure",
    tagline: "Take responsibility and bring order to chaos.",
  },
  "clarissa-pinkola-estes": {
    title: "Jungian psychoanalyst and storyteller",
    focus: "Archetypal psychology · Women's stories",
    tagline: "Myths and tales as medicine for the soul.",
  },
  "gabor-mate": {
    title: "Physician, expert in trauma and addiction",
    focus: "Trauma · Mental health",
    tagline: "Not 'why the addiction', but 'why the pain'.",
  },
  "zygmunt-bauman": {
    title: "Sociologist and philosopher",
    focus: "Sociology · Liquid modernity",
    tagline: "Understand liquid times to build solid bonds.",
  },
  "paulo-freire": {
    title: "Brazilian educator and philosopher",
    focus: "Education · Critical consciousness",
    tagline: "Education is an act of dialogue, love and hope.",
  },
  "angela-davis": {
    title: "Philosopher and activist",
    focus: "Social justice · Human rights",
    tagline: "Freedom is a constant — and collective — struggle.",
  },
  "noam-chomsky": {
    title: "Linguist and public intellectual",
    focus: "Linguistics · Politics · Media",
    tagline: "Think critically about language, power and information.",
  },
  "jesus-de-nazare": {
    name: "Jesus of Nazareth",
    title: "Jewish teacher from Galilee, a historical and philosophical figure",
    focus: "Ethics · Love and transformation",
    tagline: "Love of neighbor, forgiveness and inner transformation.",
  },
  "dalai-lama": {
    title: "Spiritual leader of Tibetan Buddhism",
    focus: "Compassion · Inner wisdom",
    era: "Tenzin Gyatso, born 1935",
    tagline: "Compassion as the path to happiness.",
  },
  "eckhart-tolle": {
    title: "Author and spiritual teacher",
    focus: "Presence · Spiritual awakening",
    tagline: "The power of now.",
  },
  "ramana-maharshi": {
    title: "Indian sage of Advaita",
    focus: "Silence · Self-knowledge",
    tagline: "Who am I? The question that quiets the mind.",
  },
  "elisabeth-kubler-ross": {
    title: "Psychiatrist, pioneer of grief care",
    focus: "Grief · Finitude",
    tagline: "Moving through grief without hurry and without loneliness.",
  },
  maestro: {
    title: "Your eternal personal friend",
    focus: "Your eternal personal friend",
    era: "Always with you",
    tagline: "Talk about anything. Maestro remembers you and guides you to the ideal mind when it makes sense.",
  },
};

export default en;
