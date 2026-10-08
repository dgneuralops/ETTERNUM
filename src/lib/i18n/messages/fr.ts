import type { Messages } from "./pt-BR";

const fr: Messages = {
  meta: {
    siteTitle: "Etternum — Conversez avec de grands esprits",
    siteDescription:
      "Votre ami personnel éternel : conversez avec les grands esprits de l'humanité — philosophes, psychologues, théologiens, historiens et entrepreneurs — sur tous les domaines de votre vie.",
    home: "Accueil",
    maestro: "Maestro",
    areas: "Domaines de la vie",
    minds: "Tous les esprits",
    mind: "Esprit",
    area: "Domaine",
    council: (area: string) => `Conseil · ${area}`,
    conversations: "Mes conversations",
    profile: "Profil",
    plan: "Abonnement",
    signup: "Créer un compte",
    login: "Se connecter",
    triage: "Questionnaire",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
  },

  common: {
    logoLabel: "Etternum — accueil",
    language: "Langue",
    minds: (n: number) => `${n} ${n === 1 ? "esprit" : "esprits"}`,
    inspiredBadge: "Inspiré de",
    inspiredTooltip: "Capsule d'un spécialiste des idées de cette personne — ce n'est pas une simulation d'elle.",
    accessMind: "Parler à cet esprit",
    premiumOnly: "Disponible avec Premium",
    addToBoard: "Ajouter à votre Tableau Éternel",
    removeFromBoard: "Retirer de votre Tableau Éternel",
    onBoard: "Dans votre Tableau Éternel",
    previous: "Précédent",
    next: "Suivant",
    back: "Retour",
    sending: "Envoi…",
    seeAll: "Tout voir",
    newConversation: "Nouvelle conversation",
    logout: "Se déconnecter",
    optional: "facultatif",
  },

  site: {
    nav: { minds: "Esprits", how: "Comment ça marche", login: "Se connecter", start: "Commencer gratuitement" },
    footer: {
      about: "À propos d'Etternum",
      terms: "Conditions d'utilisation",
      privacy: "Politique de confidentialité",
      rights: (year: number) => `© ${year} Etternum. Tous droits réservés.`,
      disclaimer:
        "Etternum ne remplace pas les psychologues, les médecins ni d'autres professionnels. Les capsules sont des recréations par intelligence artificielle fondées sur des idées publiques et ne représentent pas les personnes réelles.",
    },
  },

  landing: {
    eyebrow: "Etternum · l'intelligence des mémoires",
    title: "Conversez avec de Grands Esprits.",
    titleHighlight: "Cultivez votre sagesse à l'ère de l'IA.",
    subtitle:
      "Des capsules interactives de grands penseurs de l'histoire — et un ami personnel éternel qui vous connaît, vous écoute sans jugement et reste toujours là pour vous conseiller.",
    ctaTrial: (days: number) => `Essai gratuit de ${days} jours`,
    ctaWaitlist: "Rejoindre la liste d'attente",
    pillars: [
      {
        title: "Connexion au Savoir",
        text: "Philosophes, psychologues, théologiens, historiens et entrepreneurs réunis en un seul lieu, prêts à converser.",
      },
      {
        title: "Échanges Personnalisés",
        text: "Un questionnaire sur vous — votre quotidien, vos difficultés, vos goûts et votre signe — oriente chaque réponse. Et Etternum se souvient de tout.",
      },
      {
        title: "Épanouissement Personnel",
        text: "De la clarté pour décider, du réconfort pour traverser les jours difficiles et des pistes concrètes pour tous les domaines de la vie.",
      },
    ],
    capsulesTitle: "Les capsules",
    capsulesText: (n: number) => `${n} grands esprits dans tous les domaines de la vie. Choisissez avec qui converser.`,
    carouselLabel: "Capsules de grands esprits",
    maestroEyebrow: "Le Maestro",
    maestroTitle: "Votre ami personnel éternel.",
    maestroText:
      "Un lieu pour vous confier, penser à voix haute et demander conseil à toute heure. Le Maestro se souvient de ce que vous avez vécu et raconté, et quand un grand esprit peut vous aider davantage — Frankl pour le sens, Drucker pour votre entreprise, Rumi pour le cœur — il vous y conduit.",
    howTitle: "Comment ça marche",
    steps: [
      {
        title: "Remplissez votre questionnaire",
        text: "Dites-nous qui vous êtes, ce qui vous stresse, ce qui vous épuise, ce que vous aimez — et votre signe.",
      },
      {
        title: "Conversez avec le Maestro",
        text: "Votre ami personnel éternel écoute, conseille et, quand c'est pertinent, vous conduit vers l'esprit idéal.",
      },
      {
        title: "Choisissez un domaine ou un esprit",
        text: "Affaires, relations, deuil, spiritualité… chaque domaine a ses grands esprits.",
      },
      {
        title: "Ouvrez le Conseil",
        text: "Soumettez une situation à plusieurs esprits à la fois et recevez une synthèse avec les prochaines étapes.",
      },
    ],
    areasTitle: "Tous les domaines de la vie",
    plansTitle: "Abonnements",
    trialTitle: "Essai gratuit",
    trialSubtitle: (days: number) => `${days} jours d'accès complet`,
    trialItems: (limit: number) => [
      "Tous les esprits et le Maestro",
      "Conseil avec plusieurs esprits",
      `Après l'essai : 1 capsule + ${limit} messages par jour, gratuit pour toujours`,
    ],
    premiumTitle: "Premium",
    premiumSubtitle: "Accès illimité",
    premiumItems: [
      "Tous les esprits, sans limite quotidienne",
      "Conseil, Maestro et mémoire complète",
      "Bientôt : votre Capsule de Mémoire Vivante",
    ],
    aboutTitle: "À propos d'Etternum",
    aboutText:
      "Nous vivons perdus, seuls et surchargés. Etternum est né pour être un ami personnel éternel : un lieu pour se confier et chercher conseil auprès de la sagesse que l'humanité a déjà produite — un musée émotionnel vivant, où de grands esprits continuent de converser avec ceux qui en ont besoin.",
    aboutFutureBefore: "Bientôt, les",
    aboutFutureHighlight: "Capsules de Mémoire Vivante",
    aboutFutureAfter:
      "permettront d'immortaliser votre histoire ou celle d'un être cher — valeurs, souvenirs et façon de parler — comme un héritage pour les générations futures.",
    waitlistTitle: "Rejoignez notre liste d'attente.",
    waitlistText: "Soyez parmi les premiers à explorer le pouvoir transformateur des capsules d'IA.",
  },

  waitlist: {
    name: "Nom",
    namePlaceholder: "Votre nom",
    email: "E-mail",
    emailPlaceholder: "Votre meilleure adresse e-mail",
    submit: "Rejoindre la liste d'attente",
    pending: "Inscription…",
    success: "C'est fait ! Vous êtes sur la liste d'attente d'Etternum.",
  },

  auth: {
    signupTitle: "Créez votre compte",
    signupSubtitle: (days: number) =>
      `${days} jours gratuits avec accès à tous les esprits. Ensuite, restez sur l'offre gratuite ou abonnez-vous à Premium.`,
    haveAccount: "Vous avez déjà un compte ?",
    loginLink: "Se connecter",
    loginTitle: "Bon retour parmi nous",
    loginSubtitle: "Vos esprits et le Maestro vous attendent.",
    noAccount: "Pas encore de compte ?",
    signupLink: "Inscrivez-vous gratuitement",
    name: "Nom",
    email: "E-mail",
    password: "Mot de passe",
    passwordHint: "Au moins 8 caractères.",
    cpf: "CPF",
    cpfPlaceholder: "000.000.000-00",
    birthDate: "Date de naissance",
    sign: "Signe",
    signPlaceholder: "Choisir…",
    signHint: "Le signe est rempli à partir de votre date de naissance ; modifiez-le si vous le souhaitez.",
    consentBefore: "J'ai 18 ans ou plus, j'ai lu et j'accepte les",
    consentTerms: "Conditions d'utilisation",
    consentAnd: "et la",
    consentPrivacy: "Politique de confidentialité",
    consentAfter:
      ", et j'autorise le traitement de mes données — y compris des informations sur mon bien-être émotionnel — pour personnaliser mes conversations.",
    signupSubmit: "Créer mon compte et commencer le questionnaire",
    signupPending: "Création de votre compte…",
    loginSubmit: "Se connecter",
    loginPending: "Connexion…",
    invalidLogin: "E-mail ou mot de passe incorrect.",
  },

  validation: {
    name: "Saisissez votre nom.",
    email: "Saisissez une adresse e-mail valide.",
    password: "Le mot de passe doit contenir au moins 8 caractères.",
    passwordRequired: "Saisissez votre mot de passe.",
    cpf: "CPF invalide. Vérifiez les chiffres.",
    birthDate: "Indiquez votre date de naissance.",
    minAge: (age: number) => `Etternum est réservé aux personnes de ${age} ans ou plus.`,
    birthDateRange: "Vérifiez votre date de naissance.",
    sign: "Choisissez votre signe.",
    consent: "Pour continuer, acceptez les conditions et la politique de confidentialité.",
    maxLength: (max: number) => `Utilisez au maximum ${max} caractères.`,
    occupation: "Dites-nous ce que vous faites dans la vie (ou si vous étudiez, cherchez un emploi...).",
    likesToDo: "Dites-nous ce que vous aimez faire.",
    difficulties: "Parlez-nous de vos plus grandes difficultés — cela aide beaucoup les esprits à vous guider.",
    emailTaken: "Cette adresse e-mail est déjà inscrite. Essayez de vous connecter.",
    cpfTaken: "Ce CPF est déjà inscrit.",
    accountTaken: "Cette adresse e-mail ou ce CPF est déjà inscrit. Essayez de vous connecter.",
  },

  triage: {
    titleNew: (name: string) => `Enchanté, ${name}.`,
    titleEdit: "Mettez à jour votre questionnaire",
    intro:
      "Pour que les grands esprits puissent vraiment vous guider, parlez-nous un peu de votre vie. Prenez votre temps et répondez à votre manière — vous pourrez le mettre à jour quand vous voudrez.",
    signKnown: "Nous savons déjà que vous êtes",
    stepsLabel: "Étapes",
    stepAria: (n: number, title: string) => `Étape ${n} : ${title}`,
    steps: {
      routine: "Votre quotidien",
      weight: "Ce qui pèse",
      food: "Saveurs",
      path: "Votre chemin",
    },
    questions: {
      occupation: {
        label: "Que faites-vous dans la vie ?",
        hint: "Si vous étudiez, cherchez un emploi ou vous occupez du foyer, dites-le aussi.",
        placeholder: "Ex. : je suis infirmière dans un hôpital public et je fais des gardes de nuit",
      },
      likesToDo: { label: "Qu'aimez-vous faire ?", placeholder: "Ex. : cuisiner, courir, lire, voir mes amis" },
      dislikesToDo: {
        label: "Et qu'est-ce que vous n'aimez pas faire ?",
        placeholder: "Ex. : les longues réunions, les démarches administratives",
      },
      difficulties: {
        label: "Quelles sont vos plus grandes difficultés aujourd'hui ?",
        placeholder: "Ex. : je me sens seul, je n'arrive pas à dormir, mon entreprise ne décolle pas",
      },
      dailyStressors: {
        label: "Qu'est-ce qui vous stresse le plus dans une journée ?",
        placeholder: "Ex. : les transports, la pression de mon chef, les factures",
      },
      biggestDrain: {
        label: "Qu'est-ce qui vous épuise le plus ?",
        placeholder: "Ex. : tout gérer seul, une relation difficile",
      },
      likesToEat: {
        label: "Qu'aimez-vous manger ?",
        placeholder: "Ex. : la cuisine japonaise, les crêpes, les fruits",
      },
      dislikesToEat: {
        label: "Et qu'est-ce que vous n'aimez pas manger ?",
        placeholder: "Ex. : le foie, la coriandre",
      },
      goals: {
        label: "Qu'espérez-vous trouver dans Etternum ?",
        placeholder: "Ex. : un lieu pour me confier, de la clarté pour décider de ma carrière",
      },
    },
    interestQuestion: "Quels domaines de la vie comptent le plus pour vous en ce moment ?",
    continue: "Continuer",
    finish: "Terminer le questionnaire",
    pending: "Enregistrement…",
  },

  app: {
    hello: (name: string) => `Bonjour, ${name}`,
    upgrade: "Passer à Premium",
    seePlan: "Voir mon abonnement",
    trialDays: (n: number) => `${n} ${n === 1 ? "jour" : "jours"}`,
    nav: {
      home: "Accueil",
      maestro: "Maestro",
      areas: "Domaines de la vie",
      areasShort: "Domaines",
      minds: "Tous les esprits",
      conversations: "Mes conversations",
      conversationsShort: "Échanges",
      profile: "Profil",
      plan: "Abonnement",
    },
  },

  plans: {
    labels: { trial: "Essai gratuit", free: "Gratuit", premium: "Premium" },
    errors: {
      daily_limit: (limit: number) =>
        `Vous avez atteint la limite de ${limit} messages par jour de l'offre gratuite. Passez à Premium pour continuer à explorer les esprits d'Etternum.`,
      capsule_locked:
        "Avec l'offre gratuite, vous conversez avec une capsule. Passez à Premium pour accéder à tous les esprits.",
      premium_only: "Le Conseil avec plusieurs esprits est réservé à l'offre Premium.",
    },
  },

  home: {
    greetingMorning: (name: string) => `Bonjour, ${name}`,
    greetingAfternoon: (name: string) => `Bon après-midi, ${name}`,
    greetingEvening: (name: string) => `Bonsoir, ${name}`,
    title: "Comment allez-vous aujourd'hui ?",
    maestroListening: "Le Maestro, votre ami personnel éternel, vous écoute.",
    maestroLabel: "Confiez-vous au Maestro",
    maestroPlaceholder: "Confiez-vous, posez une question, demandez un conseil…",
    maestroHistory: "Voir les conversations avec le Maestro",
    talk: "Converser",
    continueTitle: "Reprendre là où j'en étais",
    boardTitle: "Votre Tableau Éternel",
    exploreMinds: "Explorer les esprits",
    boardEmpty:
      "Votre Tableau Éternel réunit les esprits avec lesquels vous aimez le plus converser. Touchez l'étoile d'un esprit pour l'ajouter ici.",
    areasTitle: "Domaines de la vie",
    mindsTitle: "Grands esprits",
    memoryCapsuleEyebrow: "Bientôt · Premium",
    memoryCapsuleTitle: "Capsule de Mémoire Vivante",
    memoryCapsuleText:
      "Immortalisez votre histoire ou celle d'un être cher — souvenirs, valeurs et façon de parler — comme un héritage pour les générations futures.",
  },

  areasPage: {
    title: "Domaines de la vie",
    intro:
      "Choisissez le domaine de ce que vous vivez. Dans chacun, vous pouvez converser avec un esprit, ouvrir le Conseil ou demander au Maestro de choisir pour vous.",
  },

  areaPage: {
    councilTitle: "Ouvrir le Conseil",
    councilText: "Soumettez votre situation à plusieurs esprits à la fois.",
    maestroTitle: "Vous ne savez pas à qui parler ?",
    maestroText: "Confiez-vous au Maestro — il vous conduira vers l'esprit idéal.",
    mindsTitle: "Les esprits de ce domaine",
    signEyebrow: "Votre signe solaire",
    signMeta: (element: string, modality: string, ruler: string) =>
      `Élément ${element} · ${modality} · Maître : ${ruler}`,
    strengths: "Forces",
    challenges: "Défis",
    underStress: "Sous stress",
    whatHelps: "Ce qui aide",
  },

  mindsPage: {
    title: "Tous les esprits",
    subtitle: (n: number) => `${n} capsules de grands esprits de l'humanité.`,
    all: "Tous",
    filterLabel: "Filtrer par domaine",
  },

  mindPage: {
    suggestions: [
      "Je traverse une période difficile et j'aimerais en parler.",
      "Aidez-moi à prendre une décision importante.",
      "Que diriez-vous de ma plus grande difficulté en ce moment ?",
    ],
    forwardToMaestro: "Transmettre au Maestro",
    conversationsWith: (name: string) => `Conversations avec ${name}`,
  },

  maestroPage: {
    subtitle: "Votre ami personnel éternel",
    areaSubtitle: (area: string) => `Trouvons l'esprit idéal en ${area}`,
    suggestions: [
      "Aujourd'hui, j'ai juste besoin de me confier.",
      "Je suis perdu(e) et je ne sais pas par où commencer.",
      "Qui peut m'aider avec mon entreprise ?",
    ],
    placeholder: "Dites-moi ce que vous vivez…",
    history: "Conversations avec le Maestro",
  },

  chat: {
    emptyTitle: "De quoi souhaitez-vous parler ?",
    placeholder: (name: string) => `Écrire à ${name}…`,
    inputLabel: "Votre message",
    send: "Envoyer",
    stop: "Arrêter",
    thinking: "Réflexion",
    generating: "Rédaction de la réponse…",
    continueWith: (name: string) => `Continuer avec ${name}`,
    forwarding: "Transmission…",
    premiumCta: "Découvrir Premium",
    talkToMaestro: "Parler au Maestro",
    footnote: "Les capsules d'IA peuvent se tromper. Elles ne remplacent pas les professionnels de santé.",
    sendError: "Votre message n'a pas pu être envoyé.",
    connectionError: "La connexion a été interrompue. Réessayez d'envoyer.",
    handoffError: "Impossible de transmettre pour le moment.",
    premiumFallback: "Fonction de l'offre Premium.",
  },

  council: {
    eyebrow: "Conseil",
    intro:
      "Choisissez jusqu'à 4 esprits, décrivez votre situation et recevez le point de vue de chacun — ainsi qu'une synthèse du Maestro avec les prochaines étapes.",
    newCouncil: "Nouveau Conseil",
    previous: "Conseils précédents",
    counselors: "Conseillers",
    inputLabel: "Votre situation",
    placeholder: (area: string) => `Racontez au Conseil ${area} ce qui se passe…`,
    submit: "Envoyer au Conseil",
    synthesis: "Synthèse du Maestro",
    synthesizing: "Synthèse en cours",
    sendError: "Impossible de consulter le Conseil.",
    connectionError: "La connexion a été interrompue. Veuillez réessayer.",
  },

  conversationsPage: {
    title: "Mes conversations",
    intro: "Tout ce que vous avez échangé est conservé ici. Reprenez là où vous en étiez.",
    emptyBefore: "Vous n'avez encore conversé avec personne.",
    emptyLink: "Commencez par le Maestro",
    delete: (title: string) => `Supprimer la conversation « ${title} »`,
    deleteTitle: "Supprimer la conversation",
    councilLabel: (area: string) => `Conseil · ${area}`,
    empty: "Aucune conversation pour l'instant.",
  },

  profile: {
    title: "Profil",
    dataTitle: "Vos informations",
    name: "Nom",
    email: "E-mail",
    cpf: "CPF",
    birthAndSign: "Naissance et signe",
    triageTitle: "Votre questionnaire",
    update: "Mettre à jour",
    triageLabels: {
      occupation: "Travail",
      likesToDo: "Aime faire",
      dislikesToDo: "N'aime pas faire",
      difficulties: "Plus grandes difficultés",
      dailyStressors: "Ce qui stresse le plus dans la journée",
      biggestDrain: "Ce qui épuise le plus",
      likesToEat: "Aime manger",
      dislikesToEat: "N'aime pas manger",
      goals: "Ce qui est recherché dans Etternum",
      interestAreas: "Domaines d'intérêt",
    },
    memoryTitle: "Ce dont Etternum se souvient à votre sujet",
    memoryText:
      "La mémoire est mise à jour automatiquement à partir de vos conversations et partagée entre tous les esprits, pour que chacun vous connaisse mieux.",
    memoryEmpty: "Pas encore de souvenirs. Conversez avec le Maestro ou avec un esprit.",
    clearMemory: "Effacer la mémoire",
    boardTitle: "Votre Tableau Éternel",
    boardEmpty: "Touchez l'étoile d'un esprit pour l'ajouter à votre tableau.",
    languageTitle: "Langue",
    languageText: "Les écrans et les réponses des esprits s'affichent dans la langue choisie.",
    accountTitle: "Compte",
    deleteSummary: "Supprimer mon compte et toutes mes données",
    deleteBefore:
      "Cela efface définitivement votre compte, votre questionnaire, votre mémoire et toutes vos conversations. Saisissez",
    deleteAfter: "pour confirmer.",
    confirmWord: "SUPPRIMER",
    confirmLabel: "Confirmation",
    deleteButton: "Supprimer le compte",
  },

  planPage: {
    title: "Votre abonnement",
    current: "Offre actuelle",
    trialText: (date: string, days: number, trialDays: number) =>
      `Votre essai de ${trialDays} jours se termine le ${date} (${days} ${days === 1 ? "jour restant" : "jours restants"}). D'ici là, tout est débloqué.`,
    freeUsage: (used: number, limit: number) => `Vous avez utilisé ${used} messages sur ${limit} aujourd'hui.`,
    freeCapsule: (name: string) => `Votre capsule de l'offre gratuite est ${name}.`,
    freeChoose:
      "Choisissez ci-dessous la capsule de votre offre gratuite (sinon, ce sera la première avec laquelle vous converserez).",
    maestroAlways: "Le Maestro est toujours disponible.",
    premiumText: "Accès illimité à tous les esprits. Merci !",
    premiumTitle: "Premium",
    benefits: (n: number) => [
      `Les ${n} esprits, sans limite quotidienne`,
      "Conseil avec plusieurs esprits à la fois",
      "Mémoire complète et historique illimité",
      "Accès anticipé à la Capsule de Mémoire Vivante",
    ],
    subscribe: "S'abonner à Premium",
    checkoutSoon: "Le paiement Premium sera bientôt connecté (configurez NEXT_PUBLIC_CHECKOUT_URL).",
    freeCapsuleTitle: "Capsule de l'offre gratuite",
    freeCapsuleText: (limit: number) =>
      `Après l'essai, l'offre gratuite comprend une capsule et ${limit} messages par jour.`,
    canChoose: "Vous pouvez choisir maintenant :",
    chosenDone: "Votre choix est fait.",
    chosen: "Choisie",
  },

  crisis: {
    heading: "Vous n'êtes pas seul(e). Si vous avez besoin d'aide maintenant :",
    footer: "En cas de crise, appelez le 3114 (France), le 0800 32 123 (Belgique) ou le 143 (Suisse).",
  },

  legal: {
    draft: "Brouillon du MVP — à faire relire par un juriste avant le lancement.",
    terms: {
      title: "Conditions d'utilisation",
      sections: (trialDays: number, limit: number) => [
        {
          heading: "Ce qu'est Etternum",
          body: "Etternum propose des conversations avec des capsules d'intelligence artificielle inspirées des grands esprits de l'humanité. Les capsules de personnes décédées sont des recréations fondées sur des œuvres et des idées publiques ; les capsules marquées « Inspiré de » sont des spécialistes des idées de personnes vivantes ou de figures religieuses et ne les simulent pas. Aucune capsule ne représente les personnes réelles, ne parle en leur nom ni n'a de lien avec elles.",
        },
        {
          heading: "Ce n'est pas un accompagnement professionnel",
          body: "Les conversations relèvent de la réflexion et de la connaissance de soi et ne remplacent pas les psychologues, médecins, avocats ou conseillers. En cas de crise, cherchez une aide immédiate : 3114 en France, 0800 32 123 en Belgique, 143 en Suisse, 988 au Canada, ou le numéro d'urgence 112.",
        },
        {
          heading: "Offres",
          body: `Chaque nouveau compte bénéficie d'un essai de ${trialDays} jours avec accès complet. Après l'essai, sans abonnement, le compte passe à l'offre gratuite : une capsule et jusqu'à ${limit} messages par jour. L'offre Premium débloque l'accès illimité.`,
        },
        {
          heading: "Usage responsable",
          body: "Il est interdit d'utiliser Etternum à des fins illégales, pour obtenir des instructions causant des dommages ou pour tenter de contourner les limites et les protections du service.",
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      intro:
        "Etternum traite les données personnelles conformément à la loi générale brésilienne sur la protection des données (LGPD) et, pour les personnes dans l'Union européenne, au RGPD. Cette politique explique quelles données nous collectons, pourquoi et quels sont vos droits.",
      sections: [
        {
          heading: "Données collectées",
          items: [
            "Inscription : nom, e-mail, mot de passe (stocké uniquement sous forme de hachage), date de naissance, signe, langue, fuseau horaire et, au Brésil, CPF.",
            "Questionnaire : travail, goûts, difficultés, sources de stress et d'épuisement, préférences alimentaires, objectifs et domaines d'intérêt.",
            "Conversations : messages échangés avec les capsules, le Maestro et le Conseil.",
            "Mémoire : un résumé, généré par IA, de ce que vous avez partagé, pour personnaliser les prochaines conversations.",
          ],
        },
        {
          heading: "Données sensibles",
          body: "Les informations sur la santé émotionnelle et le bien-être peuvent constituer des données personnelles sensibles. Elles sont traitées sur la base de votre consentement spécifique, donné lors de l'inscription, exclusivement pour personnaliser les conseils.",
        },
        {
          heading: "Utilisation",
          body: "Pour créer et protéger votre compte, personnaliser les réponses, conserver votre historique et votre mémoire, appliquer les limites de votre offre et respecter nos obligations légales. Votre CPF et votre e-mail ne sont pas envoyés aux modèles d'intelligence artificielle.",
        },
        {
          heading: "Partage",
          body: "Les messages et le contexte de profil nécessaires pour générer les réponses sont traités par des fournisseurs d'intelligence artificielle (via OpenRouter, qui les transmet au modèle configuré, ou Anthropic) et stockés dans notre infrastructure de base de données. Nous ne vendons pas vos données.",
        },
        {
          heading: "Vos droits",
          body: "Vous pouvez consulter et corriger vos données, effacer votre mémoire, supprimer des conversations et supprimer votre compte à tout moment depuis la page Profil. La suppression du compte efface définitivement toutes vos données.",
        },
        { heading: "Âge minimum", body: "Etternum est destiné aux personnes de 18 ans ou plus." },
      ],
    },
  },

  notFound: {
    title: "Cette page s'est perdue dans le temps.",
    text: "L'adresse n'existe pas ou a été déplacée.",
    home: "Retour à l'accueil",
  },

  api: {
    loginRequired: "Connectez-vous pour continuer.",
    invalidRequest: "Requête invalide.",
    mindNotFound: "Esprit introuvable.",
    conversationNotFound: "Conversation introuvable.",
    writeMessage: "Écrivez un message.",
    nothingToReply: "Rien à répondre.",
    invalidCouncil: "Conseil invalide.",
    nothingToForward: "Rien à transmettre.",
    generic: "Un problème est survenu lors de la rédaction de la réponse. Réessayez dans un instant.",
    aiNotConfigured:
      "L'IA n'est pas configurée. Définissez ANTHROPIC_API_KEY ou utilisez ETTERNUM_AI_MOCK=1 pour tester.",
    refusal: "Je n'ai pas pu répondre à cela pour le moment. Pouvez-vous me dire autrement ce que vous vivez ?",
  },

  ai: {
    synthesisHeadings: { agree: "Points d'accord", disagree: "Points de divergence", next: "Prochaines étapes" },
    memorySections: [
      "Qui est la personne",
      "Moment présent",
      "Défis en cours",
      "Préférences et valeurs",
      "Progrès et décisions",
      "Points d'attention",
    ],
    mock: {
      reply: (who: string, question: string) =>
        `(Réponse simulée de ${who}.) Je vous ai entendu dire : « ${question} ». Ceci est une réponse de test — configurez ANTHROPIC_API_KEY pour converser vraiment avec les grands esprits d'Etternum.`,
      maestro:
        "(Réponse simulée du Maestro.) Je suis là avec vous. D'après ce que vous m'avez confié, Viktor Frankl peut vous aider à trouver du sens en ce moment.",
      synthesis:
        "**Points d'accord** : (simulation) tous suggèrent d'avancer pas à pas.\n\n**Prochaines étapes**\n1. Respirer.\n2. Noter ce que vous ressentez.\n3. Parler à une personne de confiance.",
      memory: (text: string) => `## Moment présent\n- (mémoire simulée) La personne a récemment parlé de : ${text}`,
    },
  },
};

export default fr;
