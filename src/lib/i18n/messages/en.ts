import type { Messages } from "./pt-BR";

const en: Messages = {
  meta: {
    siteTitle: "Etternum — Talk with great minds",
    siteDescription:
      "Your eternal personal friend: talk with humanity's great minds — philosophers, psychologists, theologians, historians and business leaders — about every area of your life.",
    home: "Home",
    maestro: "Maestro",
    areas: "Areas of life",
    minds: "All minds",
    mind: "Mind",
    area: "Area",
    council: (area: string) => `Council · ${area}`,
    conversations: "My conversations",
    profile: "Profile",
    plan: "Plan",
    signup: "Create account",
    login: "Sign in",
    triage: "Intake",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
  },

  common: {
    logoLabel: "Etternum — home",
    language: "Language",
    minds: (n: number) => `${n} ${n === 1 ? "mind" : "minds"}`,
    inspiredBadge: "Inspired by",
    inspiredTooltip: "A capsule of an expert in this person's ideas — not a simulation of them.",
    accessMind: "Talk to this mind",
    premiumOnly: "Available on Premium",
    addToBoard: "Add to your Eternal Board",
    removeFromBoard: "Remove from your Eternal Board",
    onBoard: "On your Eternal Board",
    previous: "Previous",
    next: "Next",
    back: "Back",
    sending: "Sending…",
    seeAll: "See all",
    newConversation: "New conversation",
    logout: "Sign out",
    optional: "optional",
  },

  site: {
    nav: { minds: "Minds", how: "How it works", login: "Sign in", start: "Start for free" },
    footer: {
      about: "About Etternum",
      terms: "Terms of Use",
      privacy: "Privacy Policy",
      rights: (year: number) => `© ${year} Etternum. All rights reserved.`,
      disclaimer:
        "Etternum does not replace psychologists, doctors or other professionals. The capsules are AI recreations based on public ideas and do not represent the real people.",
    },
  },

  landing: {
    eyebrow: "Etternum · the intelligence of memories",
    title: "Talk with Great Minds.",
    titleHighlight: "Grow your wisdom in the age of AI.",
    subtitle:
      "Interactive capsules of history's great thinkers — and an eternal personal friend who knows you, listens without judgment and is always there to give advice.",
    ctaTrial: (days: number) => `Try free for ${days} days`,
    ctaWaitlist: "Join the waitlist",
    pillars: [
      {
        title: "Connection with Knowledge",
        text: "Philosophers, psychologists, theologians, historians and business leaders gathered in one place, ready to talk.",
      },
      {
        title: "Personalized Conversations",
        text: "An intake about you — your routine, struggles, tastes and star sign — shapes every answer. And Etternum remembers everything.",
      },
      {
        title: "Personal Growth",
        text: "Clarity to decide, comfort to get through hard days and practical paths for every area of life.",
      },
    ],
    capsulesTitle: "The capsules",
    capsulesText: (n: number) => `${n} great minds across every area of life. Choose who to talk to.`,
    carouselLabel: "Capsules of great minds",
    maestroEyebrow: "The Maestro",
    maestroTitle: "Your eternal personal friend.",
    maestroText:
      "A place to vent, think out loud and ask for advice at any hour. The Maestro remembers what you've lived and shared, and when a great mind can help more — Frankl for meaning, Drucker for your business, Rumi for the heart — it takes you there.",
    howTitle: "How it works",
    steps: [
      {
        title: "Complete your intake",
        text: "Tell us who you are, what stresses you, what wears you down, what you enjoy — and your star sign.",
      },
      {
        title: "Talk with the Maestro",
        text: "Your eternal personal friend listens, advises and, when it makes sense, takes you to the right mind.",
      },
      {
        title: "Choose an area or a mind",
        text: "Business, relationships, grief, spirituality… every area has its great minds.",
      },
      {
        title: "Open the Council",
        text: "Bring a situation to several minds at once and get a synthesis with next steps.",
      },
    ],
    areasTitle: "Every area of life",
    plansTitle: "Plans",
    trialTitle: "Free trial",
    trialSubtitle: (days: number) => `${days} days of full access`,
    trialItems: (limit: number) => [
      "Every mind and the Maestro",
      "Council with several minds",
      `After the trial: 1 capsule + ${limit} messages a day, free forever`,
    ],
    premiumTitle: "Premium",
    premiumSubtitle: "Unlimited access",
    premiumItems: [
      "Every mind, no daily limit",
      "Council, Maestro and full memory",
      "Coming soon: your Living Memory Capsule",
    ],
    aboutTitle: "About Etternum",
    aboutText:
      "We live lost, lonely and overwhelmed. Etternum was born to be an eternal personal friend: a place to vent and seek advice from the wisdom humanity has already produced — a living emotional museum where great minds keep talking with whoever needs them.",
    aboutFutureBefore: "Soon,",
    aboutFutureHighlight: "Living Memory Capsules",
    aboutFutureAfter:
      "will let you preserve your own story or that of someone you love — values, memories and way of speaking — as a legacy for the next generations.",
    waitlistTitle: "Join our waitlist.",
    waitlistText: "Be one of the first to explore the transformative power of AI capsules.",
  },

  waitlist: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "Your best email",
    submit: "Join the waitlist",
    pending: "Joining…",
    success: "Done! You're on the Etternum waitlist.",
  },

  auth: {
    signupTitle: "Create your account",
    signupSubtitle: (days: number) =>
      `${days} days free with access to every mind. Afterwards, stay on the free plan or subscribe to Premium.`,
    haveAccount: "Already have an account?",
    loginLink: "Sign in",
    loginTitle: "Welcome back",
    loginSubtitle: "Your minds and the Maestro are waiting for you.",
    noAccount: "Don't have an account yet?",
    signupLink: "Sign up for free",
    name: "Name",
    email: "Email",
    password: "Password",
    passwordHint: "At least 8 characters.",
    cpf: "CPF",
    cpfPlaceholder: "000.000.000-00",
    birthDate: "Date of birth",
    sign: "Star sign",
    signPlaceholder: "Choose…",
    signHint: "Your sign is filled in from your date of birth; adjust it if you like.",
    consentBefore: "I am 18 or older, I have read and accept the",
    consentTerms: "Terms of Use",
    consentAnd: "and the",
    consentPrivacy: "Privacy Policy",
    consentAfter:
      ", and I authorize the processing of my data — including information about my emotional well-being — to personalize my conversations.",
    signupSubmit: "Create account and start the intake",
    signupPending: "Creating your account…",
    loginSubmit: "Sign in",
    loginPending: "Signing in…",
    invalidLogin: "Incorrect email or password.",
  },

  validation: {
    name: "Enter your name.",
    email: "Enter a valid email.",
    password: "Your password must be at least 8 characters.",
    passwordRequired: "Enter your password.",
    cpf: "Invalid CPF. Please check the numbers.",
    birthDate: "Enter your date of birth.",
    minAge: (age: number) => `Etternum is for people aged ${age} or older.`,
    birthDateRange: "Please check your date of birth.",
    sign: "Choose your star sign.",
    consent: "To continue, accept the terms and the privacy policy.",
    maxLength: (max: number) => `Use at most ${max} characters.`,
    occupation: "Tell us what you do for work (or if you're studying, looking for work...).",
    likesToDo: "Tell us what you enjoy doing.",
    difficulties: "Tell us about your biggest struggles — it really helps the minds guide you.",
    emailTaken: "This email is already registered. Try signing in.",
    cpfTaken: "This CPF is already registered.",
    accountTaken: "This email or CPF is already registered. Try signing in.",
  },

  triage: {
    titleNew: (name: string) => `Nice to meet you, ${name}.`,
    titleEdit: "Update your intake",
    intro:
      "So the great minds can truly guide you, tell us a little about your life. Take your time and answer in your own way — you can update this whenever you want.",
    signKnown: "We already know you're a",
    stepsLabel: "Steps",
    stepAria: (n: number, title: string) => `Step ${n}: ${title}`,
    steps: {
      routine: "Your routine",
      weight: "What weighs on you",
      food: "Flavors",
      path: "Your path",
    },
    questions: {
      occupation: {
        label: "What do you do for work?",
        hint: "If you're studying, looking for work or taking care of the home, tell us too.",
        placeholder: "E.g.: I'm a nurse at a public hospital and work night shifts",
      },
      likesToDo: {
        label: "What do you enjoy doing?",
        placeholder: "E.g.: cooking, running, reading, being with friends",
      },
      dislikesToDo: {
        label: "And what don't you enjoy doing?",
        placeholder: "E.g.: long meetings, dealing with bureaucracy",
      },
      difficulties: {
        label: "What are your biggest struggles right now?",
        placeholder: "E.g.: I feel lonely, I can't sleep, my business isn't taking off",
      },
      dailyStressors: {
        label: "What stresses you out the most during the day?",
        placeholder: "E.g.: traffic, pressure from my boss, the bills",
      },
      biggestDrain: {
        label: "What wears you down the most?",
        placeholder: "E.g.: handling everything alone, a difficult relationship",
      },
      likesToEat: { label: "What do you like to eat?", placeholder: "E.g.: Japanese food, pasta, fruit" },
      dislikesToEat: { label: "And what don't you like to eat?", placeholder: "E.g.: liver, cilantro" },
      goals: {
        label: "What do you hope to find in Etternum?",
        placeholder: "E.g.: a place to vent, clarity to make a career decision",
      },
    },
    interestQuestion: "Which areas of life matter most to you right now?",
    continue: "Continue",
    finish: "Finish intake",
    pending: "Saving…",
  },

  app: {
    hello: (name: string) => `Hi, ${name}`,
    upgrade: "Upgrade",
    seePlan: "See my plan",
    trialDays: (n: number) => `${n} ${n === 1 ? "day" : "days"}`,
    nav: {
      home: "Home",
      maestro: "Maestro",
      areas: "Areas of life",
      areasShort: "Areas",
      minds: "All minds",
      conversations: "My conversations",
      conversationsShort: "Chats",
      profile: "Profile",
      plan: "Plan",
    },
  },

  plans: {
    labels: { trial: "Free trial", free: "Free", premium: "Premium" },
    errors: {
      daily_limit: (limit: number) =>
        `You've reached the free plan's limit of ${limit} messages a day. Upgrade to keep exploring Etternum's minds.`,
      capsule_locked: "On the free plan you talk with one capsule. Upgrade to access every mind.",
      premium_only: "The Council with several minds is exclusive to the Premium plan.",
    },
  },

  home: {
    greetingMorning: (name: string) => `Good morning, ${name}`,
    greetingAfternoon: (name: string) => `Good afternoon, ${name}`,
    greetingEvening: (name: string) => `Good evening, ${name}`,
    title: "How are you today?",
    maestroListening: "The Maestro, your eternal personal friend, is listening.",
    maestroLabel: "Tell the Maestro",
    maestroPlaceholder: "Vent, ask, seek advice…",
    maestroHistory: "See conversations with the Maestro",
    talk: "Talk",
    continueTitle: "Pick up where I left off",
    boardTitle: "Your Eternal Board",
    exploreMinds: "Explore minds",
    boardEmpty:
      "Your Eternal Board gathers the minds you most enjoy talking to. Tap the star on any mind to add it here.",
    areasTitle: "Areas of life",
    mindsTitle: "Great minds",
    memoryCapsuleEyebrow: "Coming soon · Premium",
    memoryCapsuleTitle: "Living Memory Capsule",
    memoryCapsuleText:
      "Preserve your own story or that of someone you love — memories, values and way of speaking — as a legacy for the next generations.",
  },

  areasPage: {
    title: "Areas of life",
    intro:
      "Choose the area of what you're going through. In each one you can talk with a mind, open the Council or ask the Maestro to choose for you.",
  },

  areaPage: {
    councilTitle: "Open the Council",
    councilText: "Bring your situation to several minds at once.",
    maestroTitle: "Not sure who to talk to?",
    maestroText: "Tell the Maestro — it will take you to the right mind.",
    mindsTitle: "Minds in this area",
    signEyebrow: "Your sun sign",
    signMeta: (element: string, modality: string, ruler: string) =>
      `${element} element · ${modality} · Ruler: ${ruler}`,
    strengths: "Strengths",
    challenges: "Challenges",
    underStress: "Under stress",
    whatHelps: "What helps",
  },

  mindsPage: {
    title: "All minds",
    subtitle: (n: number) => `${n} capsules of humanity's great minds.`,
    all: "All",
    filterLabel: "Filter by area",
  },

  mindPage: {
    suggestions: [
      "I'm going through a hard time and would like to talk.",
      "Help me make an important decision.",
      "What would you say about my biggest struggle right now?",
    ],
    forwardToMaestro: "Forward to the Maestro",
    conversationsWith: (name: string) => `Conversations with ${name}`,
  },

  maestroPage: {
    subtitle: "Your eternal personal friend",
    areaSubtitle: (area: string) => `Let's find the right mind in ${area}`,
    suggestions: [
      "Today I just need to vent.",
      "I'm confused and don't know where to start.",
      "Who can help me with my business?",
    ],
    placeholder: "Tell me what you're going through…",
    history: "Conversations with the Maestro",
  },

  chat: {
    emptyTitle: "What would you like to talk about?",
    placeholder: (name: string) => `Write to ${name}…`,
    inputLabel: "Your message",
    send: "Send",
    stop: "Stop",
    thinking: "Thinking",
    generating: "Writing a reply…",
    continueWith: (name: string) => `Continue with ${name}`,
    forwarding: "Forwarding…",
    premiumCta: "Discover Premium",
    talkToMaestro: "Talk to the Maestro",
    footnote: "AI capsules can make mistakes. They don't replace health professionals.",
    sendError: "Your message couldn't be sent.",
    connectionError: "The connection dropped. Try sending again.",
    handoffError: "Couldn't forward right now.",
    premiumFallback: "Premium feature.",
  },

  council: {
    eyebrow: "Council",
    intro:
      "Choose up to 4 minds, describe your situation and get each one's perspective — plus a synthesis from the Maestro with next steps.",
    newCouncil: "New Council",
    previous: "Previous councils",
    counselors: "Counselors",
    inputLabel: "Your situation",
    placeholder: (area: string) => `Tell the ${area} Council what's happening…`,
    submit: "Send to the Council",
    synthesis: "The Maestro's synthesis",
    synthesizing: "Synthesizing",
    sendError: "Couldn't consult the Council.",
    connectionError: "The connection dropped. Please try again.",
  },

  conversationsPage: {
    title: "My conversations",
    intro: "Everything you've talked about is saved here. Pick up where you left off.",
    emptyBefore: "You haven't talked with anyone yet.",
    emptyLink: "Start with the Maestro",
    delete: (title: string) => `Delete conversation "${title}"`,
    deleteTitle: "Delete conversation",
    councilLabel: (area: string) => `Council · ${area}`,
    empty: "No conversations yet.",
  },

  profile: {
    title: "Profile",
    dataTitle: "Your details",
    name: "Name",
    email: "Email",
    cpf: "CPF",
    birthAndSign: "Birth date and sign",
    triageTitle: "Your intake",
    update: "Update",
    triageLabels: {
      occupation: "Work",
      likesToDo: "Enjoys doing",
      dislikesToDo: "Doesn't enjoy doing",
      difficulties: "Biggest struggles",
      dailyStressors: "Most stressful during the day",
      biggestDrain: "What wears you down most",
      likesToEat: "Likes to eat",
      dislikesToEat: "Doesn't like to eat",
      goals: "Looking for in Etternum",
      interestAreas: "Areas of interest",
    },
    memoryTitle: "What Etternum remembers about you",
    memoryText:
      "Memory is updated automatically from your conversations and shared across every mind, so each one knows you better.",
    memoryEmpty: "No memories yet. Talk with the Maestro or with a mind.",
    clearMemory: "Erase memory",
    boardTitle: "Your Eternal Board",
    boardEmpty: "Tap the star on a mind to add it to your board.",
    languageTitle: "Language",
    languageText: "Screens and the minds' replies appear in the chosen language.",
    accountTitle: "Account",
    deleteSummary: "Delete my account and all my data",
    deleteBefore: "This permanently erases your account, intake, memory and every conversation. Type",
    deleteAfter: "to confirm.",
    confirmWord: "DELETE",
    confirmLabel: "Confirmation",
    deleteButton: "Delete account",
  },

  planPage: {
    title: "Your plan",
    current: "Current plan",
    trialText: (date: string, days: number, trialDays: number) =>
      `Your ${trialDays}-day trial ends on ${date} (${days} ${days === 1 ? "day left" : "days left"}). Until then, everything is unlocked.`,
    freeUsage: (used: number, limit: number) => `You've used ${used} of ${limit} messages today.`,
    freeCapsule: (name: string) => `Your free plan capsule is ${name}.`,
    freeChoose: "Choose your free plan capsule below (or it will be the first one you talk to).",
    maestroAlways: "The Maestro is always available.",
    premiumText: "Unlimited access to every mind. Thank you!",
    premiumTitle: "Premium",
    benefits: (n: number) => [
      `All ${n} minds, no daily limit`,
      "Council with several minds at once",
      "Full memory and unlimited history",
      "Early access to the Living Memory Capsule",
    ],
    subscribe: "Subscribe to Premium",
    checkoutSoon: "Premium checkout will be connected soon (set NEXT_PUBLIC_CHECKOUT_URL).",
    freeCapsuleTitle: "Free plan capsule",
    freeCapsuleText: (limit: number) =>
      `After the trial, the free plan includes one capsule and ${limit} messages a day.`,
    canChoose: "You can choose now:",
    chosenDone: "Your choice is made.",
    chosen: "Chosen",
  },

  crisis: {
    heading: "You are not alone. If you need help right now:",
    footer: "In a crisis, call or text 988 (US & Canada) or find a helpline at findahelpline.com.",
  },

  legal: {
    draft: "MVP draft — must be reviewed by a legal professional before launch.",
    terms: {
      title: "Terms of Use",
      sections: (trialDays: number, limit: number) => [
        {
          heading: "What Etternum is",
          body: "Etternum offers conversations with artificial intelligence capsules inspired by humanity's great minds. Capsules of people who have died are recreations based on public works and ideas; capsules marked “Inspired by” are experts in the ideas of living people or religious figures and do not simulate them. No capsule represents, speaks for or is affiliated with the real people.",
        },
        {
          heading: "Not professional care",
          body: "Conversations are meant for reflection and self-knowledge and do not replace psychologists, doctors, lawyers or advisors. In a crisis, seek immediate help: call or text 988 in the US and Canada, call your local emergency number, or find a helpline at findahelpline.com.",
        },
        {
          heading: "Plans",
          body: `Every new account gets a ${trialDays}-day trial with full access. After the trial, without a subscription, the account moves to the free plan: one capsule and up to ${limit} messages a day. The Premium plan unlocks unlimited access.`,
        },
        {
          heading: "Responsible use",
          body: "You may not use Etternum for illegal purposes, to obtain instructions that cause harm or to try to bypass the service's limits and protections.",
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        "Etternum processes personal data in accordance with Brazil's General Data Protection Law (LGPD) and, for people in the European Union, the GDPR. This policy explains what data we collect, why, and what your rights are.",
      sections: [
        {
          heading: "Data we collect",
          items: [
            "Sign-up: name, email, password (stored only as a hash), date of birth, star sign, language, time zone and, in Brazil, CPF.",
            "Intake: work, tastes, struggles, sources of stress and fatigue, food preferences, goals and areas of interest.",
            "Conversations: messages exchanged with the capsules, the Maestro and the Council.",
            "Memory: an AI-generated summary of what you've shared, to personalize future conversations.",
          ],
        },
        {
          heading: "Sensitive data",
          body: "Information about emotional health and well-being may be sensitive personal data. It is processed based on the specific consent you give at sign-up, exclusively to personalize guidance.",
        },
        {
          heading: "How we use it",
          body: "To create and protect your account, personalize answers, keep your history and memory, apply your plan's limits and meet legal obligations. Your CPF and email are not sent to the artificial intelligence models.",
        },
        {
          heading: "Sharing",
          body: "The messages and profile context needed to generate answers are processed by an artificial intelligence provider (Anthropic) and stored in our database infrastructure. We do not sell your data.",
        },
        {
          heading: "Your rights",
          body: "You can view and correct your data, erase your memory, delete conversations and delete your account at any time on the Profile page. Deleting your account permanently removes all your data.",
        },
        { heading: "Minimum age", body: "Etternum is intended for people aged 18 or older." },
      ],
    },
  },

  notFound: {
    title: "This page was lost in time.",
    text: "The address doesn't exist or has moved.",
    home: "Back to home",
  },

  api: {
    loginRequired: "Sign in to continue.",
    invalidRequest: "Invalid request.",
    mindNotFound: "Mind not found.",
    conversationNotFound: "Conversation not found.",
    writeMessage: "Write a message.",
    nothingToReply: "Nothing to reply to.",
    invalidCouncil: "Invalid Council.",
    nothingToForward: "Nothing to forward.",
    generic: "Something went wrong while writing the reply. Please try again in a moment.",
    aiNotConfigured: "AI is not configured. Set ANTHROPIC_API_KEY or use ETTERNUM_AI_MOCK=1 to test.",
    refusal: "I couldn't answer that right now. Could you tell me in another way what you're going through?",
  },

  ai: {
    synthesisHeadings: { agree: "Where they agree", disagree: "Where they differ", next: "Next steps" },
    memorySections: [
      "Who they are",
      "Current moment",
      "Ongoing challenges",
      "Preferences and values",
      "Progress and decisions",
      "Points of attention",
    ],
    mock: {
      reply: (who: string, question: string) =>
        `(Simulated reply from ${who}.) I heard you say: "${question}". This is a test reply — set ANTHROPIC_API_KEY to truly talk with Etternum's great minds.`,
      maestro:
        "(Simulated reply from the Maestro.) I'm here with you. From what you've shared, Viktor Frankl can help you find meaning in this moment.",
      synthesis:
        "**Where they agree**: (simulation) they all suggest taking one step at a time.\n\n**Next steps**\n1. Breathe.\n2. Write down what you feel.\n3. Talk to someone you trust.",
      memory: (text: string) => `## Current moment\n- (simulated memory) The person recently talked about: ${text}`,
    },
  },
};

export default en;
