import type { Messages } from "./pt-BR";

const es: Messages = {
  meta: {
    siteTitle: "Etternum — Conversa con grandes mentes",
    siteDescription:
      "Tu amigo personal eterno: conversa con las grandes mentes de la humanidad — filósofos, psicólogos, teólogos, historiadores y empresarios — sobre todas las áreas de tu vida.",
    home: "Inicio",
    maestro: "Maestro",
    areas: "Áreas de la vida",
    minds: "Todas las mentes",
    mind: "Mente",
    area: "Área",
    council: (area: string) => `Consejo · ${area}`,
    conversations: "Mis conversaciones",
    profile: "Perfil",
    plan: "Plan",
    signup: "Crear cuenta",
    login: "Iniciar sesión",
    triage: "Cuestionario inicial",
    terms: "Términos de uso",
    privacy: "Política de privacidad",
  },

  common: {
    logoLabel: "Etternum — inicio",
    language: "Idioma",
    minds: (n: number) => `${n} ${n === 1 ? "mente" : "mentes"}`,
    inspiredBadge: "Inspirado en",
    inspiredTooltip: "Cápsula de un especialista en las ideas de esta persona — no es una simulación de ella.",
    accessMind: "Hablar con esta mente",
    premiumOnly: "Disponible en Premium",
    addToBoard: "Añadir a tu Cuadro Eterno",
    removeFromBoard: "Quitar de tu Cuadro Eterno",
    onBoard: "En tu Cuadro Eterno",
    previous: "Anterior",
    next: "Siguiente",
    back: "Volver",
    sending: "Enviando…",
    seeAll: "Ver todas",
    newConversation: "Nueva conversación",
    logout: "Cerrar sesión",
    optional: "opcional",
  },

  site: {
    nav: { minds: "Mentes", how: "Cómo funciona", login: "Iniciar sesión", start: "Empezar gratis" },
    footer: {
      about: "Sobre Etternum",
      terms: "Términos de uso",
      privacy: "Política de privacidad",
      rights: (year: number) => `© ${year} Etternum. Todos los derechos reservados.`,
      disclaimer:
        "Etternum no sustituye a psicólogos, médicos ni otros profesionales. Las cápsulas son recreaciones hechas con inteligencia artificial a partir de ideas públicas y no representan a las personas reales.",
    },
  },

  landing: {
    eyebrow: "Etternum · la inteligencia de las memorias",
    title: "Conversa con Grandes Mentes.",
    titleHighlight: "Cultiva tu sabiduría en la era de la IA.",
    subtitle:
      "Cápsulas interactivas de pensadores históricos — y un amigo personal eterno que te conoce, te escucha sin juzgar y siempre está cerca para aconsejarte.",
    ctaTrial: (days: number) => `Prueba gratis ${days} días`,
    ctaWaitlist: "Unirme a la lista de espera",
    pillars: [
      {
        title: "Conexión con el Conocimiento",
        text: "Filósofos, psicólogos, teólogos, historiadores y empresarios reunidos en un solo lugar, listos para conversar.",
      },
      {
        title: "Interacción Personalizada",
        text: "Un cuestionario sobre ti — tu rutina, tus dificultades, tus gustos y tu signo — orienta cada respuesta. Y Etternum lo recuerda todo.",
      },
      {
        title: "Crecimiento Personal",
        text: "Claridad para decidir, consuelo para atravesar días difíciles y caminos prácticos para todas las áreas de la vida.",
      },
    ],
    capsulesTitle: "Las cápsulas",
    capsulesText: (n: number) => `${n} grandes mentes en todas las áreas de la vida. Elige con quién conversar.`,
    carouselLabel: "Cápsulas de grandes mentes",
    maestroEyebrow: "El Maestro",
    maestroTitle: "Tu amigo personal eterno.",
    maestroText:
      "Un lugar para desahogarte, pensar en voz alta y pedir consejo a cualquier hora. El Maestro recuerda lo que has vivido y contado, y cuando una gran mente puede ayudarte más — Frankl para el sentido, Drucker para tu negocio, Rumi para el corazón — te lleva hasta ella.",
    howTitle: "Cómo funciona",
    steps: [
      {
        title: "Responde el cuestionario",
        text: "Cuéntanos quién eres, qué te estresa, qué te desgasta, qué te gusta — y tu signo.",
      },
      {
        title: "Conversa con el Maestro",
        text: "Tu amigo personal eterno escucha, aconseja y, cuando tiene sentido, te lleva a la mente ideal.",
      },
      {
        title: "Elige un área o una mente",
        text: "Negocios, relaciones, duelo, espiritualidad… cada área tiene sus grandes mentes.",
      },
      {
        title: "Abre el Consejo",
        text: "Lleva una situación a varias mentes a la vez y recibe una síntesis con próximos pasos.",
      },
    ],
    areasTitle: "Todas las áreas de la vida",
    plansTitle: "Planes",
    trialTitle: "Prueba gratis",
    trialSubtitle: (days: number) => `${days} días con acceso completo`,
    trialItems: (limit: number) => [
      "Todas las mentes y el Maestro",
      "Consejo con varias mentes",
      `Después de la prueba: 1 cápsula + ${limit} mensajes al día, gratis para siempre`,
    ],
    premiumTitle: "Premium",
    premiumSubtitle: "Acceso ilimitado",
    premiumItems: [
      "Todas las mentes, sin límite diario",
      "Consejo, Maestro y memoria completa",
      "Muy pronto: tu Cápsula de Memoria Viva",
    ],
    aboutTitle: "Sobre Etternum",
    aboutText:
      "Vivimos perdidos, solos y agobiados. Etternum nace para ser un amigo personal eterno: un lugar para desahogarte y aconsejarte con la sabiduría que la humanidad ya ha producido — un museo emocional vivo, donde grandes mentes siguen conversando con quien lo necesita.",
    aboutFutureBefore: "Muy pronto, las",
    aboutFutureHighlight: "Cápsulas de Memoria Viva",
    aboutFutureAfter:
      "permitirán eternizar tu historia o la de alguien que amas — valores, recuerdos y manera de hablar — como un legado para las próximas generaciones.",
    waitlistTitle: "Únete a nuestra lista de espera.",
    waitlistText: "Sé de los primeros en explorar el poder transformador de las cápsulas de IA.",
  },

  waitlist: {
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Correo electrónico",
    emailPlaceholder: "Tu mejor correo",
    submit: "Unirme a la lista de espera",
    pending: "Uniéndote…",
    success: "¡Listo! Ya estás en la lista de espera de Etternum.",
  },

  auth: {
    signupTitle: "Crea tu cuenta",
    signupSubtitle: (days: number) =>
      `${days} días gratis con acceso a todas las mentes. Después, sigues en el plan gratuito o te suscribes a Premium.`,
    haveAccount: "¿Ya tienes cuenta?",
    loginLink: "Iniciar sesión",
    loginTitle: "Bienvenido de nuevo",
    loginSubtitle: "Tus mentes y el Maestro te están esperando.",
    noAccount: "¿Todavía no tienes cuenta?",
    signupLink: "Regístrate gratis",
    name: "Nombre",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHint: "Al menos 8 caracteres.",
    cpf: "CPF",
    cpfPlaceholder: "000.000.000-00",
    birthDate: "Fecha de nacimiento",
    sign: "Signo",
    signPlaceholder: "Elige…",
    signHint: "El signo se completa a partir de tu fecha de nacimiento; ajústalo si quieres.",
    consentBefore: "Tengo 18 años o más, he leído y acepto los",
    consentTerms: "Términos de uso",
    consentAnd: "y la",
    consentPrivacy: "Política de privacidad",
    consentAfter:
      ", y autorizo el tratamiento de mis datos — incluida información sobre mi bienestar emocional — para personalizar mis conversaciones.",
    signupSubmit: "Crear cuenta y empezar el cuestionario",
    signupPending: "Creando tu cuenta…",
    loginSubmit: "Iniciar sesión",
    loginPending: "Entrando…",
    invalidLogin: "Correo o contraseña incorrectos.",
  },

  validation: {
    name: "Escribe tu nombre.",
    email: "Escribe un correo válido.",
    password: "La contraseña debe tener al menos 8 caracteres.",
    passwordRequired: "Escribe tu contraseña.",
    cpf: "CPF inválido. Revisa los números.",
    birthDate: "Indica tu fecha de nacimiento.",
    minAge: (age: number) => `Etternum es para mayores de ${age} años.`,
    birthDateRange: "Revisa tu fecha de nacimiento.",
    sign: "Elige tu signo.",
    consent: "Para continuar, acepta los términos y la política de privacidad.",
    maxLength: (max: number) => `Usa como máximo ${max} caracteres.`,
    occupation: "Cuéntanos a qué te dedicas (o si estás estudiando, buscando trabajo...).",
    likesToDo: "Cuéntanos qué te gusta hacer.",
    difficulties: "Cuéntanos tus mayores dificultades — ayuda mucho a que las mentes te orienten.",
    emailTaken: "Este correo ya está registrado. Intenta iniciar sesión.",
    cpfTaken: "Este CPF ya está registrado.",
    accountTaken: "Este correo o CPF ya está registrado. Intenta iniciar sesión.",
  },

  triage: {
    titleNew: (name: string) => `Encantado de conocerte, ${name}.`,
    titleEdit: "Actualiza tu cuestionario",
    intro:
      "Para que las grandes mentes puedan orientarte de verdad, cuéntanos un poco sobre tu vida. Responde con calma y a tu manera — puedes actualizarlo cuando quieras.",
    signKnown: "Ya sabemos que eres de",
    stepsLabel: "Pasos",
    stepAria: (n: number, title: string) => `Paso ${n}: ${title}`,
    steps: {
      routine: "Tu rutina",
      weight: "Lo que pesa",
      food: "Sabores",
      path: "Tu camino",
    },
    questions: {
      occupation: {
        label: "¿A qué te dedicas?",
        hint: "Si estás estudiando, buscando trabajo o cuidando del hogar, cuéntanoslo también.",
        placeholder: "Ej.: soy enfermera en un hospital público y hago guardias nocturnas",
      },
      likesToDo: { label: "¿Qué te gusta hacer?", placeholder: "Ej.: cocinar, correr, leer, estar con amigos" },
      dislikesToDo: {
        label: "¿Y qué no te gusta hacer?",
        placeholder: "Ej.: reuniones largas, lidiar con la burocracia",
      },
      difficulties: {
        label: "¿Cuáles son tus mayores dificultades hoy?",
        placeholder: "Ej.: me siento solo, no consigo dormir, mi negocio no despega",
      },
      dailyStressors: {
        label: "¿Qué es lo que más te estresa durante el día?",
        placeholder: "Ej.: el tráfico, la presión del jefe, las cuentas",
      },
      biggestDrain: {
        label: "¿Qué es lo que más te desgasta?",
        placeholder: "Ej.: encargarme de todo solo, una relación difícil",
      },
      likesToEat: { label: "¿Qué te gusta comer?", placeholder: "Ej.: comida japonesa, paella, fruta" },
      dislikesToEat: { label: "¿Y qué no te gusta comer?", placeholder: "Ej.: hígado, cilantro" },
      goals: {
        label: "¿Qué esperas encontrar en Etternum?",
        placeholder: "Ej.: un lugar para desahogarme, claridad para decidir sobre mi carrera",
      },
    },
    interestQuestion: "¿Qué áreas de la vida te importan más ahora?",
    continue: "Continuar",
    finish: "Terminar cuestionario",
    pending: "Guardando…",
  },

  app: {
    hello: (name: string) => `Hola, ${name}`,
    upgrade: "Mejorar plan",
    seePlan: "Ver mi plan",
    trialDays: (n: number) => `${n} ${n === 1 ? "día" : "días"}`,
    nav: {
      home: "Inicio",
      maestro: "Maestro",
      areas: "Áreas de la vida",
      areasShort: "Áreas",
      minds: "Todas las mentes",
      conversations: "Mis conversaciones",
      conversationsShort: "Charlas",
      profile: "Perfil",
      plan: "Plan",
    },
  },

  plans: {
    labels: { trial: "Prueba gratis", free: "Gratuito", premium: "Premium" },
    errors: {
      daily_limit: (limit: number) =>
        `Alcanzaste el límite de ${limit} mensajes al día del plan gratuito. Mejora tu plan para seguir explorando las mentes de Etternum.`,
      capsule_locked: "En el plan gratuito conversas con una cápsula. Mejora tu plan para acceder a todas las mentes.",
      premium_only: "El Consejo con varias mentes es exclusivo del plan Premium.",
    },
  },

  home: {
    greetingMorning: (name: string) => `Buenos días, ${name}`,
    greetingAfternoon: (name: string) => `Buenas tardes, ${name}`,
    greetingEvening: (name: string) => `Buenas noches, ${name}`,
    title: "¿Cómo estás hoy?",
    maestroListening: "El Maestro, tu amigo personal eterno, te está escuchando.",
    maestroLabel: "Cuéntaselo al Maestro",
    maestroPlaceholder: "Desahógate, pregunta, pide un consejo…",
    maestroHistory: "Ver conversaciones con el Maestro",
    talk: "Conversar",
    continueTitle: "Seguir donde lo dejé",
    boardTitle: "Tu Cuadro Eterno",
    exploreMinds: "Explorar mentes",
    boardEmpty:
      "Tu Cuadro Eterno reúne las mentes con las que más te gusta conversar. Toca la estrella de cualquier mente para añadirla aquí.",
    areasTitle: "Áreas de la vida",
    mindsTitle: "Grandes mentes",
    memoryCapsuleEyebrow: "Muy pronto · Premium",
    memoryCapsuleTitle: "Cápsula de Memoria Viva",
    memoryCapsuleText:
      "Eterniza tu historia o la de alguien que amas — recuerdos, valores y manera de hablar — como un legado para las próximas generaciones.",
  },

  areasPage: {
    title: "Áreas de la vida",
    intro:
      "Elige el área de lo que estás viviendo. En cada una puedes conversar con una mente, abrir el Consejo o pedirle al Maestro que elija por ti.",
  },

  areaPage: {
    councilTitle: "Abrir el Consejo",
    councilText: "Lleva tu situación a varias mentes a la vez.",
    maestroTitle: "¿No sabes con quién hablar?",
    maestroText: "Cuéntaselo al Maestro — te llevará a la mente ideal.",
    mindsTitle: "Mentes de esta área",
    signEyebrow: "Tu signo solar",
    signMeta: (element: string, modality: string, ruler: string) =>
      `Elemento ${element} · ${modality} · Regente: ${ruler}`,
    strengths: "Fortalezas",
    challenges: "Desafíos",
    underStress: "Bajo estrés",
    whatHelps: "Lo que ayuda",
  },

  mindsPage: {
    title: "Todas las mentes",
    subtitle: (n: number) => `${n} cápsulas de grandes mentes de la humanidad.`,
    all: "Todas",
    filterLabel: "Filtrar por área",
  },

  mindPage: {
    suggestions: [
      "Estoy pasando por un momento difícil y quería conversar.",
      "Ayúdame a tomar una decisión importante.",
      "¿Qué dirías sobre mi mayor dificultad hoy?",
    ],
    forwardToMaestro: "Llevar al Maestro",
    conversationsWith: (name: string) => `Conversaciones con ${name}`,
  },

  maestroPage: {
    subtitle: "Tu amigo personal eterno",
    areaSubtitle: (area: string) => `Encontremos la mente ideal en ${area}`,
    suggestions: [
      "Hoy solo necesito desahogarme.",
      "Estoy confundido(a) y no sé por dónde empezar.",
      "¿Quién puede ayudarme con mi negocio?",
    ],
    placeholder: "Cuéntame lo que estás viviendo…",
    history: "Conversaciones con el Maestro",
  },

  chat: {
    emptyTitle: "¿De qué quieres hablar?",
    placeholder: (name: string) => `Escríbele a ${name}…`,
    inputLabel: "Tu mensaje",
    send: "Enviar",
    stop: "Detener",
    thinking: "Pensando",
    generating: "Escribiendo una respuesta…",
    continueWith: (name: string) => `Seguir con ${name}`,
    forwarding: "Derivando…",
    premiumCta: "Conocer Premium",
    talkToMaestro: "Hablar con el Maestro",
    footnote: "Las cápsulas de IA pueden equivocarse. No sustituyen a profesionales de la salud.",
    sendError: "No se pudo enviar tu mensaje.",
    connectionError: "Se cayó la conexión. Intenta enviarlo de nuevo.",
    handoffError: "No se pudo derivar ahora.",
    premiumFallback: "Función del plan Premium.",
  },

  council: {
    eyebrow: "Consejo",
    intro:
      "Elige hasta 4 mentes, cuenta tu situación y recibe la perspectiva de cada una — y una síntesis del Maestro con próximos pasos.",
    newCouncil: "Nuevo Consejo",
    previous: "Consejos anteriores",
    counselors: "Consejeros",
    inputLabel: "Tu situación",
    placeholder: (area: string) => `Cuéntale al Consejo de ${area} lo que está pasando…`,
    submit: "Enviar al Consejo",
    synthesis: "Síntesis del Maestro",
    synthesizing: "Sintetizando",
    sendError: "No se pudo consultar al Consejo.",
    connectionError: "Se cayó la conexión. Inténtalo de nuevo.",
  },

  conversationsPage: {
    title: "Mis conversaciones",
    intro: "Todo lo que has conversado queda guardado aquí. Sigue donde lo dejaste.",
    emptyBefore: "Todavía no has conversado con nadie.",
    emptyLink: "Empieza por el Maestro",
    delete: (title: string) => `Eliminar conversación "${title}"`,
    deleteTitle: "Eliminar conversación",
    councilLabel: (area: string) => `Consejo · ${area}`,
    empty: "Todavía no hay conversaciones.",
  },

  profile: {
    title: "Perfil",
    dataTitle: "Tus datos",
    name: "Nombre",
    email: "Correo electrónico",
    cpf: "CPF",
    birthAndSign: "Nacimiento y signo",
    triageTitle: "Tu cuestionario",
    update: "Actualizar",
    triageLabels: {
      occupation: "Trabajo",
      likesToDo: "Le gusta hacer",
      dislikesToDo: "No le gusta hacer",
      difficulties: "Mayores dificultades",
      dailyStressors: "Lo que más estresa en el día",
      biggestDrain: "Lo que más desgasta",
      likesToEat: "Le gusta comer",
      dislikesToEat: "No le gusta comer",
      goals: "Lo que busca en Etternum",
      interestAreas: "Áreas de interés",
    },
    memoryTitle: "Lo que Etternum recuerda de ti",
    memoryText:
      "La memoria se actualiza automáticamente a partir de tus conversaciones y se comparte entre todas las mentes, para que cada una te conozca mejor.",
    memoryEmpty: "Todavía no hay recuerdos. Conversa con el Maestro o con una mente.",
    clearMemory: "Borrar memoria",
    boardTitle: "Tu Cuadro Eterno",
    boardEmpty: "Toca la estrella de una mente para añadirla a tu cuadro.",
    languageTitle: "Idioma",
    languageText: "Las pantallas y las respuestas de las mentes aparecen en el idioma elegido.",
    accountTitle: "Cuenta",
    deleteSummary: "Eliminar mi cuenta y todos mis datos",
    deleteBefore: "Esto borra definitivamente tu cuenta, cuestionario, memoria y todas las conversaciones. Escribe",
    deleteAfter: "para confirmar.",
    confirmWord: "ELIMINAR",
    confirmLabel: "Confirmación",
    deleteButton: "Eliminar cuenta",
  },

  planPage: {
    title: "Tu plan",
    current: "Plan actual",
    trialText: (date: string, days: number, trialDays: number) =>
      `Tu prueba de ${trialDays} días termina el ${date} (${days} ${days === 1 ? "día restante" : "días restantes"}). Hasta entonces, todo está desbloqueado.`,
    freeUsage: (used: number, limit: number) => `Has usado ${used} de ${limit} mensajes hoy.`,
    freeCapsule: (name: string) => `Tu cápsula del plan gratuito es ${name}.`,
    freeChoose: "Elige abajo la cápsula de tu plan gratuito (o será la primera con la que converses).",
    maestroAlways: "El Maestro siempre está disponible.",
    premiumText: "Acceso ilimitado a todas las mentes. ¡Gracias!",
    premiumTitle: "Premium",
    benefits: (n: number) => [
      `Las ${n} mentes, sin límite diario`,
      "Consejo con varias mentes a la vez",
      "Memoria completa e historial ilimitado",
      "Acceso anticipado a la Cápsula de Memoria Viva",
    ],
    subscribe: "Suscribirme a Premium",
    checkoutSoon: "El pago de Premium se conectará pronto (configura NEXT_PUBLIC_CHECKOUT_URL).",
    freeCapsuleTitle: "Cápsula del plan gratuito",
    freeCapsuleText: (limit: number) =>
      `Después de la prueba, el plan gratuito incluye una cápsula y ${limit} mensajes al día.`,
    canChoose: "Puedes elegir ahora:",
    chosenDone: "Ya hiciste tu elección.",
    chosen: "Elegida",
  },

  crisis: {
    heading: "No estás solo(a). Si necesitas ayuda ahora:",
    footer:
      "En crisis, llama al 024 (España), a la Línea de la Vida 800 911 2000 (México) o busca una línea en findahelpline.com.",
  },

  legal: {
    draft: "Borrador del MVP — debe revisarlo un profesional jurídico antes del lanzamiento.",
    terms: {
      title: "Términos de uso",
      sections: (trialDays: number, limit: number) => [
        {
          heading: "Qué es Etternum",
          body: "Etternum ofrece conversaciones con cápsulas de inteligencia artificial inspiradas en grandes mentes de la humanidad. Las cápsulas de personas fallecidas son recreaciones basadas en obras e ideas públicas; las cápsulas marcadas como “Inspirado en” son especialistas en las ideas de personas vivas o de figuras religiosas y no las simulan. Ninguna cápsula representa, habla en nombre de ni tiene vínculo con las personas reales.",
        },
        {
          heading: "No es atención profesional",
          body: "Las conversaciones son para la reflexión y el autoconocimiento y no sustituyen a psicólogos, médicos, abogados ni asesores. En una crisis, busca ayuda inmediata: llama a tu número local de emergencias o busca una línea de ayuda en findahelpline.com.",
        },
        {
          heading: "Planes",
          body: `Toda cuenta nueva tiene ${trialDays} días de prueba con acceso completo. Después de la prueba, sin suscripción, la cuenta pasa al plan gratuito: una cápsula y hasta ${limit} mensajes al día. El plan Premium desbloquea el acceso ilimitado.`,
        },
        {
          heading: "Uso responsable",
          body: "Está prohibido usar Etternum con fines ilegales, para obtener instrucciones que causen daño o para intentar eludir los límites y las protecciones del servicio.",
        },
      ],
    },
    privacy: {
      title: "Política de privacidad",
      intro:
        "Etternum trata los datos personales de acuerdo con la Ley General de Protección de Datos de Brasil (LGPD) y, para las personas en la Unión Europea, con el RGPD. Esta política explica qué datos recopilamos, por qué y cuáles son tus derechos.",
      sections: [
        {
          heading: "Datos que recopilamos",
          items: [
            "Registro: nombre, correo, contraseña (guardada solo como hash), fecha de nacimiento, signo, idioma, zona horaria y, en Brasil, CPF.",
            "Cuestionario: trabajo, gustos, dificultades, fuentes de estrés y desgaste, preferencias alimentarias, objetivos y áreas de interés.",
            "Conversaciones: mensajes intercambiados con las cápsulas, el Maestro y el Consejo.",
            "Memoria: un resumen, generado por IA, de lo que has compartido, para personalizar las próximas conversaciones.",
          ],
        },
        {
          heading: "Datos sensibles",
          body: "La información sobre salud emocional y bienestar puede ser un dato personal sensible. Se trata con base en tu consentimiento específico, dado en el registro, exclusivamente para personalizar las orientaciones.",
        },
        {
          heading: "Cómo los usamos",
          body: "Para crear y proteger tu cuenta, personalizar las respuestas, mantener tu historial y tu memoria, aplicar los límites de tu plan y cumplir obligaciones legales. Tu CPF y tu correo no se envían a los modelos de inteligencia artificial.",
        },
        {
          heading: "Compartición",
          body: "Los mensajes y el contexto de perfil necesarios para generar las respuestas los procesa un proveedor de inteligencia artificial (Anthropic) y se guardan en nuestra infraestructura de base de datos. No vendemos tus datos.",
        },
        {
          heading: "Tus derechos",
          body: "Puedes consultar y corregir tus datos, borrar tu memoria, eliminar conversaciones y eliminar tu cuenta en cualquier momento en la página Perfil. Eliminar la cuenta borra todos tus datos de forma definitiva.",
        },
        { heading: "Edad mínima", body: "Etternum está destinado a personas de 18 años o más." },
      ],
    },
  },

  notFound: {
    title: "Esta página se perdió en el tiempo.",
    text: "La dirección no existe o se ha movido.",
    home: "Volver al inicio",
  },

  api: {
    loginRequired: "Inicia sesión para continuar.",
    invalidRequest: "Solicitud inválida.",
    mindNotFound: "Mente no encontrada.",
    conversationNotFound: "Conversación no encontrada.",
    writeMessage: "Escribe un mensaje.",
    nothingToReply: "No hay nada que responder.",
    invalidCouncil: "Consejo inválido.",
    nothingToForward: "No hay nada que derivar.",
    generic: "Algo salió mal al generar la respuesta. Inténtalo de nuevo en unos instantes.",
    aiNotConfigured: "La IA no está configurada. Define ANTHROPIC_API_KEY o usa ETTERNUM_AI_MOCK=1 para probar.",
    refusal: "No pude responder a eso ahora. ¿Puedes contarme de otra manera lo que estás viviendo?",
  },

  ai: {
    synthesisHeadings: { agree: "Dónde coinciden", disagree: "Dónde difieren", next: "Próximos pasos" },
    memorySections: [
      "Quién es",
      "Momento actual",
      "Desafíos en curso",
      "Preferencias y valores",
      "Avances y decisiones",
      "Puntos de atención",
    ],
    mock: {
      reply: (who: string, question: string) =>
        `(Respuesta simulada de ${who}.) Te escuché decir: "${question}". Esta es una respuesta de prueba — configura ANTHROPIC_API_KEY para conversar de verdad con las grandes mentes de Etternum.`,
      maestro:
        "(Respuesta simulada del Maestro.) Estoy aquí contigo. Por lo que me cuentas, Viktor Frankl puede ayudarte a encontrar sentido en este momento.",
      synthesis:
        "**Dónde coinciden**: (simulación) todos sugieren dar un paso a la vez.\n\n**Próximos pasos**\n1. Respirar.\n2. Escribir lo que sientes.\n3. Hablar con alguien de confianza.",
      memory: (text: string) => `## Momento actual\n- (memoria simulada) La persona habló recientemente sobre: ${text}`,
    },
  },
};

export default es;
