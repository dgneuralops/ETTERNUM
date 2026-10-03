import type Anthropic from "@anthropic-ai/sdk";

/**
 * Respostas simuladas para desenvolvimento e testes sem chave da API
 * (ETTERNUM_AI_MOCK=1). Nunca usar em produção.
 */
export function mockReply(system: string, messages: Anthropic.Beta.BetaMessageParam[]): string {
  const last = messages[messages.length - 1];
  const content = typeof last?.content === "string" ? last.content : "";
  const who = /Quem você é nesta conversa: ([^\n(]+)/.exec(system)?.[1]?.trim() ?? "Etternum";

  if (system.includes("memória de longo prazo")) {
    return `## Momento atual\n- (memória simulada) A pessoa conversou recentemente sobre: ${content.slice(-160).replace(/\s+/g, " ")}`;
  }
  if (system.includes("síntese curta")) {
    return "**Onde concordam**: (simulação) todos sugerem dar um passo de cada vez.\n\n**Próximos passos**\n1. Respirar.\n2. Anotar o que sente.\n3. Conversar com alguém de confiança.";
  }
  if (system.includes("Grandes mentes disponíveis")) {
    return "(Resposta simulada do Maestro.) Estou aqui com você. Pelo que você contou, Viktor Frankl pode ajudar a encontrar sentido neste momento.\n\n[[mente:viktor-frankl]]";
  }
  const question = content.replace(/<trechos_das_obras>[\s\S]*<\/trechos_das_obras>/, "").trim();
  return `(Resposta simulada de ${who}.) Ouvi você dizer: "${question.slice(0, 140)}". Esta é uma resposta de teste — configure ANTHROPIC_API_KEY para conversar de verdade com as grandes mentes do Etternum.`;
}
