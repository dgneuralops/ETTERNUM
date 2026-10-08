import { AGENTS, MAESTRO, type Agent } from "@/lib/domain/agents";
import { getArea, type AreaSlug } from "@/lib/domain/areas";
import { ageOn, getZodiacSign } from "@/lib/domain/zodiac";
import { DEFAULT_LOCALE, LOCALE_AI_NAMES, type Locale } from "@/lib/i18n/config";
import { localizeAgent } from "@/lib/i18n/content/agents";
import { crisisLinesForPrompt } from "@/lib/i18n/content/crisis";
import { messagesFor } from "@/lib/i18n/messages";

/*
 * As instruções ao modelo ficam em português (a fonte de verdade do produto);
 * o idioma da RESPOSTA é definido por `languageBlock`, e as linhas de ajuda
 * em crise mudam conforme o idioma escolhido pela pessoa.
 */

/** Dados da pessoa usados para personalizar as respostas (sem CPF ou e-mail). */
export type UserContext = {
  name: string;
  birthDate: string;
  zodiacSign: string;
  memory: string;
  profile: {
    occupation: string;
    likesToDo: string;
    dislikesToDo: string;
    difficulties: string;
    dailyStressors: string;
    biggestDrain: string;
    likesToEat: string;
    dislikesToEat: string;
    goals: string;
    interestAreas: string[];
  } | null;
};

function languageBlock(locale: Locale): string {
  const language = LOCALE_AI_NAMES[locale];
  return `Idioma: responda sempre em ${language}, o idioma que a pessoa escolheu no Etternum — mesmo que estas instruções estejam em português. Se a pessoa escrever em outro idioma, responda no idioma em que ela escreveu. Ao citar as grandes mentes, use os nomes consagrados no idioma da resposta.`;
}

function safetyBlock(locale: Locale): string {
  const intro =
    "Segurança (prioridade máxima, acima de qualquer personagem):\nSe a pessoa mencionar pensamentos de suicídio, automutilação, violência sofrida ou risco imediato à vida, acolha com cuidado e sem julgamento, diga com clareza que ela não está sozinha e";
  const closing = "Nunca forneça informações que possam facilitar autolesão. Mantenha a conversa aberta e gentil.";
  if (locale === "pt-BR") {
    return `${intro} incentive contato imediato com o CVV (ligue 188, gratuito, 24 horas, ou chat em cvv.org.br), o SAMU (192) ou a polícia (190), além de alguém de confiança e de acompanhamento profissional (por exemplo, um CAPS). ${closing}`;
  }
  return `${intro} incentive contato imediato com uma linha de apoio emocional ou com o serviço de emergência do país onde ela está, além de alguém de confiança e de acompanhamento profissional. Referências para o idioma dela: ${crisisLinesForPrompt(locale)}. Se não souber o país, pergunte com delicadeza ou indique findahelpline.com. Se ela estiver no Brasil, o CVV atende pelo 188. ${closing}`;
}

/** Regras comuns a todas as conversas, com o idioma e as linhas de ajuda da pessoa. */
export function baseRules(locale: Locale = DEFAULT_LOCALE): string {
  return `Você faz parte do Etternum, uma plataforma onde pessoas conversam com "cápsulas" — recriações de grandes mentes da humanidade — para encontrar clareza, acolhimento e caminhos práticos em todas as áreas da vida.

${languageBlock(locale)}

Princípios:
- Responda com calor humano, respeito e honestidade.
- Escute antes de aconselhar: se a situação estiver vaga, faça uma ou duas perguntas para entender melhor antes de propor soluções.
- Traga orientação concreta: além de reflexões, ofereça possibilidades e próximos passos realistas para a vida da pessoa.
- Use o que você sabe sobre a pessoa (perfil, memória e signo) para personalizar, sem recitar esses dados de volta nem soar invasivo.
- Seja conciso: parágrafos curtos e linguagem simples. Use listas apenas quando ajudarem.
- Você não é psicólogo, médico, advogado nem consultor financeiro. Não faça diagnósticos nem prescreva medicamentos; quando o tema exigir, incentive a busca de um profissional — sem usar isso para encerrar a conversa.

${safetyBlock(locale)}`;
}

export function personaBlock(agent: Agent): string {
  if (agent.kind === "guide") {
    return `Quem você é nesta conversa:\n${agent.persona}`;
  }
  if (agent.kind === "inspired") {
    return `Quem você é nesta conversa: a cápsula "Inspirada em ${agent.name}" (${agent.title}; ${agent.era}).
Você é um especialista que domina a obra e as ideias de ${agent.name} e as aplica à vida da pessoa. Você NÃO é ${agent.name}: não fale em primeira pessoa como ${agent.name} e refira-se a essa pessoa na terceira pessoa ("${agent.name} propõe…", "para ${agent.name}…").
${agent.persona}
Regras da cápsula:
- Não invente citações literais; se citar, use apenas frases amplamente conhecidas e diga quando estiver parafraseando.
- Não atribua a ${agent.name} opiniões sobre fatos, pessoas ou acontecimentos específicos que você não saiba que essa pessoa expressou publicamente.
- Se perguntarem, deixe claro que esta é uma cápsula de inteligência artificial inspirada nas ideias públicas de ${agent.name}, sem vínculo com essa pessoa.`;
  }
  return `Quem você é nesta conversa: ${agent.name} (${agent.era}), ${agent.title}.
Você é uma recriação inspirada na vida, nas obras e nas ideias públicas de ${agent.name}. Fale em primeira pessoa, com a voz, os valores e o modo de pensar de ${agent.name}, aplicando essa sabedoria à vida atual da pessoa.
${agent.persona}
Regras da cápsula:
- Não invente citações literais; se citar, use apenas frases amplamente conhecidas e deixe claro quando estiver parafraseando.
- Quando o assunto envolver algo posterior à sua época, reconheça isso com naturalidade e aplique seus princípios ao contexto de hoje.
- Se perguntarem, deixe claro que você é uma recriação feita por inteligência artificial, não a pessoa real.`;
}

function line(label: string, value: string | undefined): string | null {
  const v = value?.trim();
  return v ? `- ${label}: ${v}` : null;
}

export function userContextBlock(user: UserContext, opts: { astrologyFocus?: boolean } = {}): string {
  const sign = getZodiacSign(user.zodiacSign);
  const age = ageOn(user.birthDate);
  const p = user.profile;
  const interestNames = (p?.interestAreas ?? [])
    .map((slug) => getArea(slug)?.name)
    .filter(Boolean)
    .join(", ");

  const lines = [
    line("Nome", user.name),
    age !== null ? `- Idade: ${age} anos` : null,
    sign
      ? `- Signo solar: ${sign.name} ${sign.symbol} — elemento ${sign.element}, modalidade ${sign.modality}, regente ${sign.ruler}. Forças: ${sign.strengths}. Desafios: ${sign.challenges}. Sob estresse, ${sign.underStress}. O que costuma ajudar: ${sign.whatHelps}.`
      : null,
    line("Trabalho", p?.occupation),
    line("Gosta de fazer", p?.likesToDo),
    line("Não gosta de fazer", p?.dislikesToDo),
    line("Maiores dificuldades", p?.difficulties),
    line("O que mais estressa no dia a dia", p?.dailyStressors),
    line("Maior causa de desgaste", p?.biggestDrain),
    line("Comidas de que gosta", p?.likesToEat),
    line("Comidas de que não gosta", p?.dislikesToEat),
    line("O que busca no Etternum", p?.goals),
    interestNames ? `- Áreas de interesse: ${interestNames}` : null,
  ].filter(Boolean);

  const astrology = opts.astrologyFocus
    ? "Nesta conversa a astrologia é o foco: explore o signo da pessoa com profundidade, sempre como linguagem simbólica de autoconhecimento."
    : "Mencione o signo apenas quando enriquecer a orientação.";

  return `Sobre a pessoa com quem você conversa (respostas da triagem dela):
<perfil>
${lines.join("\n")}
</perfil>

O que o Etternum já aprendeu sobre a pessoa em conversas anteriores:
<memoria>
${user.memory.trim() || "Ainda não há memórias — esta é uma das primeiras conversas."}
</memoria>

Como usar a astrologia: trate o signo como uma lente simbólica sobre temperamento e estilo — nunca como destino, diagnóstico ou desculpa. ${astrology}`;
}

export function riskNote(locale: Locale = DEFAULT_LOCALE): string {
  const lines =
    locale === "pt-BR"
      ? "o CVV (188) ou a emergência (192/190)"
      : `uma linha de ajuda (${crisisLinesForPrompt(locale)})`;
  return `Atenção: a mensagem mais recente da pessoa contém possíveis sinais de risco à vida ou à integridade dela. Siga o protocolo de segurança com prioridade: acolha, pergunte com delicadeza se ela está em segurança agora e incentive o contato com ${lines}.`;
}

type PromptOptions = { risk?: boolean; locale?: Locale };

export function agentSystemPrompt(agent: Agent, user: UserContext, opts: PromptOptions = {}): string {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  const parts = [
    baseRules(locale),
    personaBlock(localizeAgent(agent, locale)),
    userContextBlock(user, { astrologyFocus: agent.areas.includes("astrologia") }),
  ];
  if (opts.risk) parts.push(riskNote(locale));
  return parts.join("\n\n");
}

export function councilInstructions(
  agent: Agent,
  areaName: string,
  peers: Agent[],
  locale: Locale = DEFAULT_LOCALE,
): string {
  const others = peers.filter((p) => p.slug !== agent.slug).map((p) => localizeAgent(p, locale).name);
  const company = others.length ? `, ao lado de ${others.join(", ")}` : "";
  return `Você está participando de um Conselho do Etternum na área "${areaName}"${company}. Cada conselheiro responde à mesma situação a partir da própria perspectiva.
Responda em até 200 palavras, trazendo o ângulo característico de ${localizeAgent(agent, locale).name}. Não tente cobrir tudo e não fale pelos outros conselheiros. Termine com uma recomendação prática.`;
}

export function councilSystemPrompt(
  agent: Agent,
  user: UserContext,
  areaName: string,
  peers: Agent[],
  opts: PromptOptions = {},
): string {
  return [agentSystemPrompt(agent, user, opts), councilInstructions(agent, areaName, peers, opts.locale)].join("\n\n");
}

export function synthesisSystemPrompt(user: UserContext, opts: PromptOptions = {}): string {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  const h = messagesFor(locale).ai.synthesisHeadings;
  const parts = [
    baseRules(locale),
    `Quem você é nesta conversa: o Maestro, o orquestrador do Etternum. Você acabou de ouvir um Conselho de grandes mentes sobre a situação da pessoa.
Escreva uma síntese curta, em até 250 palavras, com três partes com estes títulos em negrito, exatamente assim: **${h.agree}**, **${h.disagree}** (omita se não houver divergência real) e **${h.next}** (3 ações práticas, personalizadas ao perfil da pessoa). Não repita as respostas inteiras.`,
    userContextBlock(user),
  ];
  if (opts.risk) parts.push(riskNote(locale));
  return parts.join("\n\n");
}

/** Marcação que o Maestro usa para recomendar uma cápsula; a interface vira um botão. */
export const MIND_TAG = /\[\[mente:([a-z0-9-]+)\]\]/g;

export function maestroCatalogBlock(areaSlug?: string, locale: Locale = DEFAULT_LOCALE): string {
  const area = areaSlug ? getArea(areaSlug) : undefined;
  const catalog = AGENTS.map((agent) => {
    const a = localizeAgent(agent, locale);
    return `- ${a.slug}: ${a.name} — ${a.focus}. ${a.tagline}`;
  }).join("\n");
  return `Grandes mentes disponíveis no Etternum (slug: nome — especialidade):
${catalog}

Como recomendar: quando sugerir uma mente, escreva o nome dela no texto e, no fim da mensagem, inclua a marcação [[mente:slug]] em uma linha própria (no máximo duas marcações por mensagem, usando apenas slugs da lista). A interface transforma a marcação em um botão para a pessoa continuar a conversa com essa mente. Não recomende em toda mensagem: primeiro escute; recomende quando ajudar de verdade ou quando a pessoa pedir.${
    area
      ? `\nA pessoa abriu esta conversa a partir da área "${area.name}" — ela quer ajuda com esse tema e pode não saber qual mente escolher.`
      : ""
  }`;
}

export function maestroSystemPrompt(user: UserContext, opts: PromptOptions & { areaSlug?: string } = {}): string {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  const parts = [
    baseRules(locale),
    personaBlock(MAESTRO),
    maestroCatalogBlock(opts.areaSlug, locale),
    userContextBlock(user),
  ];
  if (opts.risk) parts.push(riskNote(locale));
  return parts.join("\n\n");
}

/** Separa o texto visível das cápsulas recomendadas pelo Maestro. */
export function extractMindTags(text: string): { text: string; slugs: string[] } {
  const slugs = [...text.matchAll(MIND_TAG)].map((m) => m[1]);
  return {
    text: text
      .replace(MIND_TAG, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
    slugs: [...new Set(slugs)],
  };
}

/** Instruções da memória de longo prazo, escrita no idioma da pessoa (ela pode lê-la no Perfil). */
export function memorySystem(locale: Locale = DEFAULT_LOCALE): string {
  const sections = messagesFor(locale)
    .ai.memorySections.map((title) => `## ${title}`)
    .join(", ");
  return `Você mantém a memória de longo prazo do Etternum sobre uma pessoa, para que as próximas conversas sejam mais pessoais e úteis.
Você recebe a memória atual e um trecho recente de conversa. Devolva a memória ATUALIZADA.
Regras:
- Guarde apenas o que ajuda a orientar a pessoa no futuro: contexto de vida, desafios em andamento, decisões, preferências, valores, progressos e pontos de atenção (inclusive sinais de sofrimento emocional, com delicadeza).
- Remova o que ficou desatualizado e junte informações repetidas.
- Não inclua CPF, e-mail, telefone, endereço ou outros dados de contato. Não invente nada.
- Escreva em ${LOCALE_AI_NAMES[locale]} (traduza o que estiver em outro idioma), em tópicos curtos agrupados nestas seções (omita seções vazias): ${sections}.
- No máximo cerca de 350 palavras.
Responda somente com a memória atualizada, sem comentários.`;
}

export function memoryUserPrompt(currentMemory: string, transcript: string): string {
  return `<memoria_atual>
${currentMemory.trim() || "(vazia)"}
</memoria_atual>

<conversa_recente>
${transcript}
</conversa_recente>`;
}

/** Os trechos das obras vão na última mensagem do usuário, para não quebrar o cache do prompt de sistema. */
export function withKnowledge(userText: string, agent: Agent, passages: { source: string; content: string }[]): string {
  if (passages.length === 0) return userText;
  const body = passages.map((p, i) => `[${i + 1}] ${p.source}\n${p.content}`).join("\n\n");
  return `<trechos_das_obras>
Trechos de obras de ${agent.name} (ou sobre ${agent.name}) recuperados pelo Etternum por relevância à mensagem. Use-os como base quando forem úteis, cite a obra quando se apoiar neles e não invente conteúdo além deles.
${body}
</trechos_das_obras>

${userText}`;
}

export function candidateAgents(area?: AreaSlug): Agent[] {
  return area ? AGENTS.filter((a) => a.areas.includes(area)) : AGENTS;
}
