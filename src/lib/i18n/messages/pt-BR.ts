/**
 * Textos da interface em português do Brasil — a fonte de verdade.
 * Os outros idiomas são tipados com `Messages`, então nenhuma chave pode faltar.
 */
const ptBR = {
  meta: {
    siteTitle: "Etternum — Converse com grandes mentes",
    siteDescription:
      "Seu amigo pessoal eterno: converse com grandes mentes da humanidade — filósofos, psicólogos, teólogos, historiadores e empresários — sobre todas as áreas da sua vida.",
    home: "Início",
    maestro: "Maestro",
    areas: "Áreas da vida",
    minds: "Todas as mentes",
    mind: "Mente",
    area: "Área",
    council: (area: string) => `Conselho · ${area}`,
    conversations: "Minhas conversas",
    profile: "Perfil",
    plan: "Plano",
    signup: "Criar conta",
    login: "Entrar",
    triage: "Triagem",
    terms: "Termos de Uso",
    privacy: "Política de Privacidade",
  },

  common: {
    logoLabel: "Etternum — início",
    language: "Idioma",
    minds: (n: number) => `${n} ${n === 1 ? "mente" : "mentes"}`,
    inspiredBadge: "Inspirado em",
    inspiredTooltip: "Cápsula de um especialista nas ideias desta pessoa — não é uma simulação dela.",
    accessMind: "Acessar esta mente",
    premiumOnly: "Disponível no Premium",
    addToBoard: "Adicionar ao Quadro Eterno",
    removeFromBoard: "Remover do Quadro Eterno",
    onBoard: "No seu Quadro Eterno",
    previous: "Anterior",
    next: "Próximo",
    back: "Voltar",
    sending: "Enviando…",
    seeAll: "Ver todas",
    newConversation: "Nova conversa",
    logout: "Sair",
    optional: "opcional",
  },

  site: {
    nav: { minds: "Mentes", how: "Como funciona", login: "Entrar", start: "Começar grátis" },
    footer: {
      about: "Sobre o Etternum",
      terms: "Termos de Uso",
      privacy: "Política de Privacidade",
      rights: (year: number) => `© ${year} Etternum. Todos os direitos reservados.`,
      disclaimer:
        "O Etternum não substitui psicólogos, médicos ou outros profissionais. As cápsulas são recriações feitas por inteligência artificial a partir de ideias públicas e não representam as pessoas reais.",
    },
  },

  landing: {
    eyebrow: "Etternum · a inteligência das memórias",
    title: "Converse com Grandes Mentes.",
    titleHighlight: "Cultive sua sabedoria na era da IA.",
    subtitle:
      "Cápsulas interativas de pensadores históricos — e um amigo pessoal eterno que conhece você, ouve sem julgamento e está sempre por perto para aconselhar.",
    ctaTrial: (days: number) => `Testar grátis por ${days} dias`,
    ctaWaitlist: "Entrar na lista de espera",
    pillars: [
      {
        title: "Conexão com o Conhecimento",
        text: "Filósofos, psicólogos, teólogos, historiadores e empresários reunidos num só lugar, prontos para conversar.",
      },
      {
        title: "Interação Personalizada",
        text: "Uma triagem sobre você — rotina, dificuldades, gostos e signo — orienta cada resposta. E o Etternum lembra de tudo.",
      },
      {
        title: "Enriquecimento Pessoal",
        text: "Clareza para decidir, acolhimento para atravessar dias difíceis e caminhos práticos para todas as áreas da vida.",
      },
    ],
    capsulesTitle: "As cápsulas",
    capsulesText: (n: number) => `${n} grandes mentes, em todas as áreas da vida. Escolha com quem conversar.`,
    carouselLabel: "Cápsulas de grandes mentes",
    maestroEyebrow: "O Maestro",
    maestroTitle: "Seu amigo pessoal eterno.",
    maestroText:
      "Um lugar para desabafar, pensar alto e pedir conselho a qualquer hora. O Maestro lembra do que você já viveu e contou, e quando uma grande mente pode ajudar mais — Frankl para o sentido, Drucker para o seu negócio, Rumi para o coração — ele leva você até ela.",
    howTitle: "Como funciona",
    steps: [
      {
        title: "Faça sua triagem",
        text: "Conte quem você é, o que te estressa, o que te desgasta, do que gosta — e seu signo.",
      },
      {
        title: "Converse com o Maestro",
        text: "Seu amigo pessoal eterno ouve, aconselha e, quando faz sentido, leva você até a mente ideal.",
      },
      {
        title: "Escolha uma área ou uma mente",
        text: "Negócios, relacionamentos, luto, espiritualidade… cada área tem suas grandes mentes.",
      },
      {
        title: "Abra o Conselho",
        text: "Leve uma situação a várias mentes ao mesmo tempo e receba uma síntese com próximos passos.",
      },
    ],
    areasTitle: "Todas as áreas da vida",
    plansTitle: "Planos",
    trialTitle: "Teste grátis",
    trialSubtitle: (days: number) => `${days} dias com acesso completo`,
    trialItems: (limit: number) => [
      "Todas as mentes e o Maestro",
      "Conselho com várias mentes",
      `Depois do teste: 1 cápsula + ${limit} mensagens por dia, para sempre grátis`,
    ],
    premiumTitle: "Premium",
    premiumSubtitle: "Acesso ilimitado",
    premiumItems: [
      "Todas as mentes, sem limite diário",
      "Conselho, Maestro e memória completa",
      "Em breve: sua Cápsula de Memória Viva",
    ],
    aboutTitle: "Sobre o Etternum",
    aboutText:
      "Vivemos perdidos, sozinhos e sobrecarregados. O Etternum nasce para ser um amigo pessoal eterno: um lugar para desabafar e se aconselhar com a sabedoria que a humanidade já produziu — um museu emocional vivo, onde grandes mentes continuam a conversar com quem precisa.",
    aboutFutureBefore: "Em breve, as",
    aboutFutureHighlight: "Cápsulas de Memória Viva",
    aboutFutureAfter:
      "vão permitir eternizar a sua história ou a de quem você ama — valores, memórias e jeito de falar — como um legado para as próximas gerações.",
    waitlistTitle: "Entre para nossa lista de espera.",
    waitlistText: "Seja um dos primeiros a explorar o poder transformador das cápsulas de IA.",
  },

  waitlist: {
    name: "Nome",
    namePlaceholder: "Seu nome",
    email: "E-mail",
    emailPlaceholder: "Seu melhor e-mail",
    submit: "Entrar na lista de espera",
    pending: "Entrando…",
    success: "Pronto! Você está na lista de espera do Etternum.",
  },

  auth: {
    signupTitle: "Crie sua conta",
    signupSubtitle: (days: number) =>
      `${days} dias grátis com acesso a todas as mentes. Depois, você continua no plano gratuito ou assina o Premium.`,
    haveAccount: "Já tem conta?",
    loginLink: "Entrar",
    loginTitle: "Bem-vindo de volta",
    loginSubtitle: "Suas mentes e o Maestro estão esperando por você.",
    noAccount: "Ainda não tem conta?",
    signupLink: "Cadastre-se grátis",
    name: "Nome",
    email: "E-mail",
    password: "Senha",
    passwordHint: "Pelo menos 8 caracteres.",
    cpf: "CPF",
    cpfPlaceholder: "000.000.000-00",
    birthDate: "Data de nascimento",
    sign: "Signo",
    signPlaceholder: "Escolha…",
    signHint: "O signo é preenchido pela data de nascimento; ajuste se preferir.",
    consentBefore: "Tenho 18 anos ou mais, li e aceito os",
    consentTerms: "Termos de Uso",
    consentAnd: "e a",
    consentPrivacy: "Política de Privacidade",
    consentAfter:
      ", e autorizo o tratamento dos meus dados — inclusive informações sobre meu bem-estar emocional — para personalizar minhas conversas.",
    signupSubmit: "Criar conta e começar a triagem",
    signupPending: "Criando sua conta…",
    loginSubmit: "Entrar",
    loginPending: "Entrando…",
    invalidLogin: "E-mail ou senha incorretos.",
  },

  validation: {
    name: "Digite seu nome.",
    email: "Digite um e-mail válido.",
    password: "A senha precisa ter pelo menos 8 caracteres.",
    passwordRequired: "Digite sua senha.",
    cpf: "CPF inválido. Confira os números.",
    birthDate: "Informe sua data de nascimento.",
    minAge: (age: number) => `O Etternum é para maiores de ${age} anos.`,
    birthDateRange: "Confira a data de nascimento.",
    sign: "Escolha seu signo.",
    consent: "Para continuar, aceite os termos e a política de privacidade.",
    maxLength: (max: number) => `Use no máximo ${max} caracteres.`,
    occupation: "Conte com o que você trabalha (ou se está estudando, buscando trabalho...).",
    likesToDo: "Conte o que você gosta de fazer.",
    difficulties: "Conte suas maiores dificuldades — isso ajuda muito as mentes a orientar você.",
    emailTaken: "Este e-mail já tem cadastro. Tente entrar.",
    cpfTaken: "Este CPF já tem cadastro.",
    accountTaken: "Este e-mail ou CPF já tem cadastro. Tente entrar.",
  },

  triage: {
    titleNew: (name: string) => `Prazer, ${name}.`,
    titleEdit: "Atualize sua triagem",
    intro:
      "Para que as grandes mentes possam orientar você de verdade, conte um pouco sobre a sua vida. Responda com calma e do seu jeito — você pode atualizar isso quando quiser.",
    signKnown: "Já sabemos que você é de",
    stepsLabel: "Etapas",
    stepAria: (n: number, title: string) => `Etapa ${n}: ${title}`,
    steps: {
      routine: "Sua rotina",
      weight: "O que pesa",
      food: "Sabores",
      path: "Seu caminho",
    },
    questions: {
      occupation: {
        label: "Com o que você trabalha?",
        hint: "Se estiver estudando, procurando trabalho ou cuidando da casa, conte também.",
        placeholder: "Ex.: sou enfermeira num hospital público e faço plantões noturnos",
      },
      likesToDo: { label: "O que você gosta de fazer?", placeholder: "Ex.: cozinhar, correr, ler, estar com amigos" },
      dislikesToDo: {
        label: "E o que você não gosta de fazer?",
        placeholder: "Ex.: reuniões longas, lidar com burocracia",
      },
      difficulties: {
        label: "Quais são as suas maiores dificuldades hoje?",
        placeholder: "Ex.: me sinto sozinho, não consigo dormir, meu negócio não decola",
      },
      dailyStressors: {
        label: "O que mais deixa você estressado(a) num dia?",
        placeholder: "Ex.: trânsito, cobranças do chefe, as contas",
      },
      biggestDrain: {
        label: "Qual é a maior causa do seu desgaste?",
        placeholder: "Ex.: cuidar de tudo sozinho, um relacionamento difícil",
      },
      likesToEat: { label: "O que você gosta de comer?", placeholder: "Ex.: comida japonesa, feijoada, frutas" },
      dislikesToEat: { label: "E o que você não gosta de comer?", placeholder: "Ex.: fígado, coentro" },
      goals: {
        label: "O que você espera encontrar no Etternum?",
        placeholder: "Ex.: um lugar para desabafar, clareza para decidir sobre minha carreira",
      },
    },
    interestQuestion: "Quais áreas da vida mais importam para você agora?",
    continue: "Continuar",
    finish: "Concluir triagem",
    pending: "Salvando…",
  },

  app: {
    hello: (name: string) => `Olá, ${name}`,
    upgrade: "Fazer upgrade",
    seePlan: "Ver meu plano",
    trialDays: (n: number) => `${n} ${n === 1 ? "dia" : "dias"}`,
    nav: {
      home: "Início",
      maestro: "Maestro",
      areas: "Áreas da vida",
      areasShort: "Áreas",
      minds: "Todas as mentes",
      conversations: "Minhas conversas",
      conversationsShort: "Conversas",
      profile: "Perfil",
      plan: "Plano",
    },
  },

  plans: {
    labels: { trial: "Teste grátis", free: "Gratuito", premium: "Premium" },
    errors: {
      daily_limit: (limit: number) =>
        `Você atingiu o limite de ${limit} mensagens por dia do plano gratuito. Faça upgrade para continuar explorando as mentes do Etternum.`,
      capsule_locked: "No plano gratuito você conversa com uma cápsula. Faça upgrade para acessar todas as mentes.",
      premium_only: "O Conselho com várias mentes é exclusivo do plano Premium.",
    },
  },

  home: {
    greetingMorning: (name: string) => `Bom dia, ${name}`,
    greetingAfternoon: (name: string) => `Boa tarde, ${name}`,
    greetingEvening: (name: string) => `Boa noite, ${name}`,
    title: "Como você está hoje?",
    maestroListening: "O Maestro, seu amigo pessoal eterno, está ouvindo.",
    maestroLabel: "Conte para o Maestro",
    maestroPlaceholder: "Desabafe, pergunte, peça um conselho…",
    maestroHistory: "Ver conversas com o Maestro",
    talk: "Conversar",
    continueTitle: "Continuar de onde parei",
    boardTitle: "Seu Quadro Eterno",
    exploreMinds: "Explorar mentes",
    boardEmpty:
      "Seu Quadro Eterno reúne as mentes com quem você mais gosta de conversar. Toque na estrela de qualquer mente para adicioná-la aqui.",
    areasTitle: "Áreas da vida",
    mindsTitle: "Grandes mentes",
    memoryCapsuleEyebrow: "Em breve · Premium",
    memoryCapsuleTitle: "Cápsula de Memória Viva",
    memoryCapsuleText:
      "Eternize a sua história ou a de alguém que você ama — memórias, valores e jeito de falar — como um legado para as próximas gerações.",
  },

  areasPage: {
    title: "Áreas da vida",
    intro:
      "Escolha a área do que você está vivendo. Em cada uma, você pode conversar com uma mente, abrir o Conselho ou pedir ao Maestro que escolha por você.",
  },

  areaPage: {
    councilTitle: "Abrir o Conselho",
    councilText: "Leve sua situação a várias mentes ao mesmo tempo.",
    maestroTitle: "Não sabe com quem falar?",
    maestroText: "Conte ao Maestro — ele encaminha para a mente ideal.",
    mindsTitle: "Mentes desta área",
    signEyebrow: "Seu signo solar",
    signMeta: (element: string, modality: string, ruler: string) =>
      `Elemento ${element} · ${modality} · Regente: ${ruler}`,
    strengths: "Forças",
    challenges: "Desafios",
    underStress: "Sob estresse",
    whatHelps: "O que ajuda",
  },

  mindsPage: {
    title: "Todas as mentes",
    subtitle: (n: number) => `${n} cápsulas de grandes mentes da humanidade.`,
    all: "Todas",
    filterLabel: "Filtrar por área",
  },

  mindPage: {
    suggestions: [
      "Estou passando por um momento difícil e queria conversar.",
      "Me ajude a tomar uma decisão importante.",
      "O que você diria sobre a minha maior dificuldade hoje?",
    ],
    forwardToMaestro: "Encaminhar ao Maestro",
    conversationsWith: (name: string) => `Conversas com ${name}`,
  },

  maestroPage: {
    subtitle: "Seu amigo pessoal eterno",
    areaSubtitle: (area: string) => `Vamos encontrar a mente ideal em ${area}`,
    suggestions: [
      "Hoje eu só preciso desabafar.",
      "Estou confuso(a) e não sei por onde começar.",
      "Quem pode me ajudar com meu negócio?",
    ],
    placeholder: "Conte o que você está vivendo…",
    history: "Conversas com o Maestro",
  },

  chat: {
    emptyTitle: "Sobre o que você quer conversar?",
    placeholder: (name: string) => `Escreva para ${name}…`,
    inputLabel: "Sua mensagem",
    send: "Enviar",
    stop: "Parar",
    thinking: "Pensando",
    generating: "Gerando resposta…",
    continueWith: (name: string) => `Continuar com ${name}`,
    forwarding: "Encaminhando…",
    premiumCta: "Conhecer o Premium",
    talkToMaestro: "Falar com o Maestro",
    footnote: "Cápsulas de IA podem errar. Não substituem profissionais de saúde.",
    sendError: "Não foi possível enviar sua mensagem.",
    connectionError: "A conexão caiu. Tente enviar de novo.",
    handoffError: "Não foi possível encaminhar agora.",
    premiumFallback: "Recurso do plano Premium.",
  },

  council: {
    eyebrow: "Conselho",
    intro:
      "Escolha até 4 mentes, conte sua situação e receba a perspectiva de cada uma — e uma síntese do Maestro com próximos passos.",
    newCouncil: "Novo Conselho",
    previous: "Conselhos anteriores",
    counselors: "Conselheiros",
    inputLabel: "Sua situação",
    placeholder: (area: string) => `Conte ao Conselho de ${area} o que está acontecendo…`,
    submit: "Enviar ao Conselho",
    synthesis: "Síntese do Maestro",
    synthesizing: "Sintetizando",
    sendError: "Não foi possível consultar o Conselho.",
    connectionError: "A conexão caiu. Tente novamente.",
  },

  conversationsPage: {
    title: "Minhas conversas",
    intro: "Tudo o que você conversou fica guardado aqui. Continue de onde parou.",
    emptyBefore: "Você ainda não conversou com ninguém.",
    emptyLink: "Comece pelo Maestro",
    delete: (title: string) => `Excluir conversa "${title}"`,
    deleteTitle: "Excluir conversa",
    councilLabel: (area: string) => `Conselho · ${area}`,
    empty: "Nenhuma conversa ainda.",
  },

  profile: {
    title: "Perfil",
    dataTitle: "Seus dados",
    name: "Nome",
    email: "E-mail",
    cpf: "CPF",
    birthAndSign: "Nascimento e signo",
    triageTitle: "Sua triagem",
    update: "Atualizar",
    triageLabels: {
      occupation: "Trabalho",
      likesToDo: "Gosta de fazer",
      dislikesToDo: "Não gosta de fazer",
      difficulties: "Maiores dificuldades",
      dailyStressors: "O que mais estressa no dia",
      biggestDrain: "Maior causa de desgaste",
      likesToEat: "Gosta de comer",
      dislikesToEat: "Não gosta de comer",
      goals: "O que busca no Etternum",
      interestAreas: "Áreas de interesse",
    },
    memoryTitle: "O que o Etternum lembra sobre você",
    memoryText:
      "A memória é atualizada automaticamente a partir das suas conversas e compartilhada entre todas as mentes, para que cada uma conheça você melhor.",
    memoryEmpty: "Ainda não há memórias. Converse com o Maestro ou com uma mente.",
    clearMemory: "Apagar memória",
    boardTitle: "Seu Quadro Eterno",
    boardEmpty: "Toque na estrela de uma mente para adicioná-la ao seu quadro.",
    languageTitle: "Idioma",
    languageText: "As telas e as respostas das mentes aparecem no idioma escolhido.",
    accountTitle: "Conta",
    deleteSummary: "Excluir minha conta e todos os meus dados",
    deleteBefore: "Isso apaga definitivamente sua conta, triagem, memória e todas as conversas. Digite",
    deleteAfter: "para confirmar.",
    confirmWord: "EXCLUIR",
    confirmLabel: "Confirmação",
    deleteButton: "Excluir conta",
  },

  planPage: {
    title: "Seu plano",
    current: "Plano atual",
    trialText: (date: string, days: number, trialDays: number) =>
      `Seu teste de ${trialDays} dias termina em ${date} (${days} ${days === 1 ? "dia restante" : "dias restantes"}). Até lá, tudo está liberado.`,
    freeUsage: (used: number, limit: number) => `Você usou ${used} de ${limit} mensagens hoje.`,
    freeCapsule: (name: string) => `Sua cápsula do plano gratuito é ${name}.`,
    freeChoose: "Escolha abaixo a cápsula do seu plano gratuito (ou ela será a primeira com quem você conversar).",
    maestroAlways: "O Maestro está sempre disponível.",
    premiumText: "Acesso ilimitado a todas as mentes. Obrigado!",
    premiumTitle: "Premium",
    benefits: (n: number) => [
      `Todas as ${n} mentes, sem limite diário`,
      "Conselho com várias mentes ao mesmo tempo",
      "Memória completa e histórico ilimitado",
      "Acesso antecipado à Cápsula de Memória Viva",
    ],
    subscribe: "Assinar o Premium",
    checkoutSoon: "O checkout do Premium será conectado em breve (configure NEXT_PUBLIC_CHECKOUT_URL).",
    freeCapsuleTitle: "Cápsula do plano gratuito",
    freeCapsuleText: (limit: number) =>
      `Depois do teste, o plano gratuito inclui uma cápsula e ${limit} mensagens por dia.`,
    canChoose: "Você pode escolher agora:",
    chosenDone: "Sua escolha está feita.",
    chosen: "Escolhida",
  },

  crisis: {
    heading: "Você não está sozinho(a). Se precisar de ajuda agora:",
    footer: "Em crise, ligue 188 (CVV, 24 horas, gratuito).",
  },

  legal: {
    draft: "Rascunho para o MVP — deve ser revisado por um profissional jurídico antes do lançamento.",
    terms: {
      title: "Termos de Uso",
      sections: (trialDays: number, limit: number) => [
        {
          heading: "O que é o Etternum",
          body: "O Etternum oferece conversas com cápsulas de inteligência artificial inspiradas em grandes mentes da humanidade. As cápsulas de pessoas falecidas são recriações baseadas em obras e ideias públicas; as cápsulas marcadas como “Inspirado em” são especialistas nas ideias de pessoas vivas ou de figuras religiosas e não as simulam. Nenhuma cápsula representa, fala em nome de ou tem vínculo com as pessoas reais.",
        },
        {
          heading: "Não é atendimento profissional",
          body: "As conversas têm caráter de reflexão e autoconhecimento e não substituem psicólogos, médicos, advogados ou consultores. Em situação de crise, procure ajuda imediata: CVV 188, SAMU 192 ou polícia 190.",
        },
        {
          heading: "Planos",
          body: `Toda conta nova tem ${trialDays} dias de teste com acesso completo. Após o teste, sem assinatura, a conta passa ao plano gratuito: uma cápsula e até ${limit} mensagens por dia. O plano Premium libera o acesso ilimitado.`,
        },
        {
          heading: "Uso responsável",
          body: "É proibido usar o Etternum para fins ilegais, para obter instruções que causem danos ou para tentar burlar os limites e as proteções do serviço.",
        },
      ],
    },
    privacy: {
      title: "Política de Privacidade",
      intro:
        "O Etternum trata dados pessoais conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e, para pessoas na União Europeia, conforme o GDPR. Esta política explica quais dados coletamos, por que e quais são os seus direitos.",
      sections: [
        {
          heading: "Dados que coletamos",
          items: [
            "Cadastro: nome, e-mail, senha (armazenada apenas como hash), data de nascimento, signo, idioma, fuso horário e, no Brasil, CPF.",
            "Triagem: trabalho, gostos, dificuldades, fontes de estresse e desgaste, preferências alimentares, objetivos e áreas de interesse.",
            "Conversas: mensagens trocadas com as cápsulas, o Maestro e o Conselho.",
            "Memória: um resumo, gerado por IA, do que você compartilhou, para personalizar as próximas conversas.",
          ],
        },
        {
          heading: "Dados sensíveis",
          body: "Informações sobre saúde emocional e bem-estar podem ser dados pessoais sensíveis. Elas são tratadas com base no seu consentimento específico, dado no cadastro, exclusivamente para personalizar as orientações.",
        },
        {
          heading: "Como usamos",
          body: "Para criar e proteger sua conta, personalizar as respostas, manter seu histórico e sua memória, aplicar os limites do seu plano e cumprir obrigações legais. Seu CPF e seu e-mail não são enviados aos modelos de inteligência artificial.",
        },
        {
          heading: "Compartilhamento",
          body: "As mensagens e o contexto de perfil necessários para gerar as respostas são processados por um provedor de inteligência artificial (Anthropic) e armazenados em nossa infraestrutura de banco de dados. Não vendemos seus dados.",
        },
        {
          heading: "Seus direitos",
          body: "Você pode consultar e corrigir seus dados, apagar sua memória, excluir conversas e excluir sua conta a qualquer momento na página Perfil. A exclusão da conta remove todos os seus dados de forma definitiva.",
        },
        { heading: "Idade mínima", body: "O Etternum é destinado a pessoas com 18 anos ou mais." },
      ],
    },
  },

  notFound: {
    title: "Esta página se perdeu no tempo.",
    text: "O endereço não existe ou foi movido.",
    home: "Voltar ao início",
  },

  api: {
    loginRequired: "Faça login para continuar.",
    invalidRequest: "Requisição inválida.",
    mindNotFound: "Mente não encontrada.",
    conversationNotFound: "Conversa não encontrada.",
    writeMessage: "Escreva uma mensagem.",
    nothingToReply: "Nada para responder.",
    invalidCouncil: "Conselho inválido.",
    nothingToForward: "Nada para encaminhar.",
    generic: "Algo deu errado ao gerar a resposta. Tente novamente em instantes.",
    aiNotConfigured: "A IA não está configurada. Defina ANTHROPIC_API_KEY ou use ETTERNUM_AI_MOCK=1 para testar.",
    refusal: "Não consegui responder a isso agora. Pode me contar de outro jeito o que você está vivendo?",
  },

  /** Textos que orientam o modelo a escrever no idioma da pessoa. */
  ai: {
    synthesisHeadings: { agree: "Onde concordam", disagree: "Onde divergem", next: "Próximos passos" },
    memorySections: [
      "Quem é",
      "Momento atual",
      "Desafios em andamento",
      "Preferências e valores",
      "Progressos e decisões",
      "Pontos de atenção",
    ],
    mock: {
      reply: (who: string, question: string) =>
        `(Resposta simulada de ${who}.) Ouvi você dizer: "${question}". Esta é uma resposta de teste — configure ANTHROPIC_API_KEY para conversar de verdade com as grandes mentes do Etternum.`,
      maestro:
        "(Resposta simulada do Maestro.) Estou aqui com você. Pelo que você contou, Viktor Frankl pode ajudar a encontrar sentido neste momento.",
      synthesis:
        "**Onde concordam**: (simulação) todos sugerem dar um passo de cada vez.\n\n**Próximos passos**\n1. Respirar.\n2. Anotar o que sente.\n3. Conversar com alguém de confiança.",
      memory: (text: string) => `## Momento atual\n- (memória simulada) A pessoa conversou recentemente sobre: ${text}`,
    },
  },
};

export type Messages = typeof ptBR;
export default ptBR;
