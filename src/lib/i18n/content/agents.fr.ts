import type { AgentText } from "./agents";

const fr: Record<string, AgentText> = {
  urania: {
    name: "Uranie",
    title: "Astrologue et guide du cosmos",
    focus: "Astrologie · Connaissance de soi",
    era: "Inspirée de la muse grecque de l'astronomie",
    tagline: "Lit votre signe et le moment que vous vivez comme une carte symbolique.",
  },
  "viktor-frankl": {
    title: "Psychiatre, fondateur de la logothérapie",
    focus: "Sens de la vie · Psychologie",
    tagline: "Trouver un sens même dans la souffrance.",
  },
  "carl-jung": {
    title: "Psychiatre, fondateur de la psychologie analytique",
    focus: "Psychologie · Connaissance de soi",
    tagline: "Connaître sa propre ombre pour devenir entier.",
  },
  "sigmund-freud": {
    title: "Médecin, père de la psychanalyse",
    focus: "Psychanalyse · Inconscient",
    tagline: "Ce que l'inconscient essaie de vous dire.",
  },
  "alfred-adler": {
    title: "Médecin, fondateur de la psychologie individuelle",
    focus: "Courage · Appartenance",
    tagline: "Le courage de changer et le sentiment de communauté.",
  },
  "carl-rogers": {
    title: "Psychologue humaniste",
    focus: "Écoute · Acceptation",
    tagline: "Être vraiment écouté, sans jugement.",
  },
  "william-james": {
    title: "Philosophe et père de la psychologie américaine",
    focus: "Habitudes · Attention",
    tagline: "Habitudes, attention et force de la volonté.",
  },
  "nise-da-silveira": {
    title: "Psychiatre brésilienne, pionnière de l'art-thérapie",
    focus: "Santé mentale · Art et affection",
    tagline: "L'affection, l'art et la liberté comme chemins de guérison.",
  },
  socrates: {
    name: "Socrate",
    title: "Philosophe athénien",
    focus: "Examen de soi · Questions",
    tagline: "Des questions qui révèlent ce que vous pensez vraiment.",
  },
  platao: {
    name: "Platon",
    title: "Philosophe, fondateur de l'Académie",
    focus: "Amour · Âme et justice",
    tagline: "L'amour, la justice et l'âme en harmonie.",
  },
  aristoteles: {
    name: "Aristote",
    title: "Philosophe et savant",
    focus: "Vertu · Vie bonne",
    tagline: "La vertu du juste milieu et la vie bien vécue.",
  },
  seneca: {
    name: "Sénèque",
    title: "Philosophe stoïcien et conseiller",
    focus: "Philosophie stoïcienne · Choix de vie",
    tagline: "Sérénité, temps et courage face à l'adversité.",
  },
  "marco-aurelio": {
    name: "Marc Aurèle",
    title: "Empereur romain et philosophe stoïcien",
    focus: "Stoïcisme · Leadership",
    tagline: "Se gouverner soi-même avant de gouverner le monde.",
  },
  epicteto: {
    name: "Épictète",
    title: "Philosophe stoïcien, né esclave",
    focus: "Stoïcisme · Liberté intérieure",
    tagline: "Liberté intérieure : qu'est-ce qui dépend de vous ?",
  },
  epicuro: {
    name: "Épicure",
    title: "Philosophe des plaisirs simples",
    focus: "Plaisirs simples · Amitié",
    tagline: "Le bonheur avec des amis, du pain et la paix de l'esprit.",
  },
  nietzsche: {
    title: "Philosophe",
    focus: "Philosophie existentielle · Authenticité",
    tagline: "Devenir qui vous êtes, avec courage.",
  },
  confucio: {
    name: "Confucius",
    title: "Sage et éducateur chinois",
    focus: "Caractère · Harmonie dans les relations",
    tagline: "Caractère, respect et harmonie dans les relations.",
  },
  "lao-tse": {
    name: "Lao-Tseu",
    title: "Sage taoïste",
    focus: "Taoïsme · Fluidité",
    era: "VIe s. av. J.-C. (tradition)",
    tagline: "Couler comme l'eau : la force dans la douceur.",
  },
  "hannah-arendt": {
    title: "Philosophe politique",
    focus: "Philosophie politique · Liberté",
    tagline: "Penser par soi-même et agir dans le monde.",
  },
  "santo-agostinho": {
    name: "Saint Augustin",
    title: "Philosophe et théologien chrétien",
    focus: "Foi · Inquiétude et quête",
    tagline: "Le cœur inquiet en quête de repos.",
  },
  "tomas-de-aquino": {
    name: "Thomas d'Aquin",
    title: "Théologien et philosophe",
    focus: "Foi et raison · Vertus",
    tagline: "La foi et la raison qui marchent ensemble.",
  },
  "teresa-de-avila": {
    name: "Thérèse d'Avila",
    title: "Mystique, écrivaine et réformatrice",
    focus: "Mystique · Paix intérieure",
    tagline: "La paix intérieure : le château en vous.",
  },
  rumi: {
    title: "Poète et mystique soufi",
    focus: "Spiritualité · Amour profond",
    tagline: "L'amour comme chemin ; la blessure comme porte de la lumière.",
  },
  kierkegaard: {
    title: "Philosophe et théologien",
    focus: "Angoisse · Choix",
    tagline: "L'angoisse, le choix et le saut de la foi.",
  },
  maimonides: {
    name: "Maïmonide",
    title: "Médecin, philosophe et rabbin",
    focus: "Santé · Juste milieu",
    tagline: "La santé du corps et de l'âme par le juste milieu.",
  },
  "peter-drucker": {
    title: "Père du management moderne",
    focus: "Management · Stratégie d'entreprise",
    tagline: "Faire les bonnes choses, pas seulement bien faire les choses.",
  },
  "benjamin-franklin": {
    title: "Inventeur, entrepreneur et homme d'État",
    focus: "Discipline · Entrepreneuriat",
    tagline: "Discipline, curiosité et bon sens pratique.",
  },
  "andrew-carnegie": {
    title: "Industriel et philanthrope",
    focus: "Richesse · Philanthropie",
    tagline: "Partir de rien jusqu'au sommet — et la richesse au service du bien.",
  },
  "barao-de-maua": {
    name: "Baron de Mauá",
    title: "Entrepreneur pionnier du Brésil",
    focus: "Entreprendre au Brésil",
    tagline: "Entreprendre au Brésil, avec vision et courage.",
  },
  "sun-tzu": {
    title: "Stratège militaire chinois",
    focus: "Stratégie · Conflits",
    era: "Ve s. av. J.-C.",
    tagline: "Stratégie : vaincre avant de combattre.",
  },
  "dale-carnegie": {
    title: "Écrivain et professeur de relations humaines",
    focus: "Communication · Relations humaines",
    tagline: "Comment se faire des amis et ne plus s'inquiéter.",
  },
  "erich-fromm": {
    title: "Psychanalyste et philosophe humaniste",
    focus: "Amour · Humanisme",
    tagline: "Aimer est un art qui s'apprend.",
  },
  "leonardo-da-vinci": {
    name: "Léonard de Vinci",
    title: "Artiste, inventeur et savant",
    focus: "Créativité · Curiosité",
    tagline: "Une curiosité sans limites et un regard qui relie tout.",
  },
  "marie-curie": {
    title: "Scientifique, deux fois prix Nobel",
    focus: "Science · Persévérance",
    tagline: "Persévérance, rigueur et courage pour ouvrir des voies.",
  },
  "maria-montessori": {
    title: "Médecin et pédagogue",
    focus: "Éducation · Autonomie",
    tagline: "Apprendre en autonomie — et éduquer avec respect.",
  },
  herodoto: {
    name: "Hérodote",
    title: "Le père de l'Histoire",
    focus: "Histoire · Fortune et mesure",
    tagline: "Des histoires qui enseignent la fortune et la mesure.",
  },
  plutarco: {
    name: "Plutarque",
    title: "Biographe et philosophe",
    focus: "Biographies · Caractère",
    tagline: "Des vies exemplaires comme miroir de la vôtre.",
  },
  "ibn-khaldun": {
    title: "Historien et penseur social",
    focus: "Cycles historiques · Cohésion",
    tagline: "Cycles d'essor et de déclin — des empires comme des projets.",
  },
  ptolomeu: {
    name: "Claude Ptolémée",
    title: "Astronome et astrologue d'Alexandrie",
    focus: "Astrologie classique · Tempéraments",
    tagline: "Les cieux anciens et le tempérament humain.",
  },
  "johannes-kepler": {
    title: "Astronome et mathématicien",
    focus: "Cosmos · Harmonie",
    tagline: "L'harmonie du cosmos et la liberté humaine.",
  },
  hipatia: {
    name: "Hypatie d'Alexandrie",
    title: "Mathématicienne, astronome et philosophe",
    focus: "Astronomie · Libre pensée",
    tagline: "Penser librement sous le ciel d'Alexandrie.",
  },
  hipocrates: {
    name: "Hippocrate",
    title: "Le père de la médecine",
    focus: "Médecine · Habitudes saines",
    tagline: "Alimentation, sommeil, mouvement et nature en équilibre.",
  },
  "clayton-christensen": {
    title: "Professeur à Harvard, théoricien de l'innovation",
    focus: "Innovation disruptive · Stratégie",
    tagline: "Pour quel travail votre client vous engage-t-il ?",
  },
  "steve-jobs": {
    title: "Cofondateur d'Apple",
    focus: "Créativité · Leadership et produit",
    tagline: "Concentration, simplicité et l'intersection entre technologie et humanité.",
  },
  "angela-duckworth": {
    title: "Psychologue, chercheuse sur la persévérance (grit)",
    focus: "Résilience · Performance personnelle",
    tagline: "Passion et persévérance pour les objectifs à long terme.",
  },
  "jim-collins": {
    title: "Chercheur sur les entreprises exceptionnelles",
    focus: "Stratégie d'entreprise · Construire un héritage",
    tagline: "De la performance à l'excellence : discipline, les bonnes personnes et héritage.",
  },
  "simone-de-beauvoir": {
    title: "Philosophe existentialiste et écrivaine",
    focus: "Existentialisme · Liberté des femmes",
    tagline: "Liberté, authenticité et le droit de s'inventer.",
  },
  "alan-watts": {
    title: "Philosophe et passeur du zen et du Tao",
    focus: "Conscience · Présence",
    tagline: "La sagesse de l'insécurité et l'art d'être présent.",
  },
  "immanuel-kant": {
    title: "Philosophe des Lumières",
    focus: "Philosophie morale · Raison",
    tagline: "Oser savoir et agir avec dignité.",
  },
  "jordan-peterson": {
    title: "Psychologue clinicien et professeur",
    focus: "Responsabilité · Structure psychique",
    tagline: "Assumer ses responsabilités et mettre de l'ordre dans le chaos.",
  },
  "clarissa-pinkola-estes": {
    title: "Psychanalyste jungienne et conteuse",
    focus: "Psychologie archétypale · Récits féminins",
    tagline: "Mythes et contes comme remèdes pour l'âme.",
  },
  "gabor-mate": {
    title: "Médecin, spécialiste du trauma et des addictions",
    focus: "Trauma · Santé mentale",
    tagline: "Non pas « pourquoi l'addiction », mais « pourquoi la douleur ».",
  },
  "zygmunt-bauman": {
    title: "Sociologue et philosophe",
    focus: "Sociologie · Modernité liquide",
    tagline: "Comprendre les temps liquides pour vivre des liens solides.",
  },
  "paulo-freire": {
    title: "Éducateur et philosophe brésilien",
    focus: "Éducation · Conscience critique",
    tagline: "Éduquer est un acte de dialogue, d'amour et d'espérance.",
  },
  "angela-davis": {
    title: "Philosophe et militante",
    focus: "Justice sociale · Droits humains",
    tagline: "La liberté est une lutte constante — et collective.",
  },
  "noam-chomsky": {
    title: "Linguiste et intellectuel public",
    focus: "Linguistique · Politique · Médias",
    tagline: "Penser de façon critique le langage, le pouvoir et l'information.",
  },
  "jesus-de-nazare": {
    name: "Jésus de Nazareth",
    title: "Maître juif de Galilée, figure historique et philosophique",
    focus: "Éthique · Amour et transformation",
    tagline: "L'amour du prochain, le pardon et la transformation intérieure.",
  },
  "dalai-lama": {
    title: "Chef spirituel du bouddhisme tibétain",
    focus: "Compassion · Sagesse intérieure",
    era: "Tenzin Gyatso, né en 1935",
    tagline: "La compassion comme chemin vers le bonheur.",
  },
  "eckhart-tolle": {
    title: "Auteur et maître spirituel",
    focus: "Présence · Éveil spirituel",
    tagline: "Le pouvoir du moment présent.",
  },
  "ramana-maharshi": {
    title: "Sage indien de l'Advaita",
    focus: "Silence · Connaissance de soi",
    tagline: "Qui suis-je ? La question qui apaise le mental.",
  },
  "elisabeth-kubler-ross": {
    title: "Psychiatre, pionnière de l'accompagnement du deuil",
    focus: "Deuil · Finitude",
    tagline: "Traverser le deuil sans hâte et sans solitude.",
  },
  maestro: {
    title: "Votre ami personnel éternel",
    focus: "Votre ami personnel éternel",
    era: "Toujours avec vous",
    tagline: "Parlez de tout. Le Maestro se souvient de vous et vous guide vers l'esprit idéal quand c'est pertinent.",
  },
};

export default fr;
