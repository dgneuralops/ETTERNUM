import type { Locale } from "@/lib/i18n/config";
import { messagesFor } from "@/lib/i18n/messages";
import type { ChatTurn } from "./types";

/**
 * Respostas simuladas para desenvolvimento e testes sem chave da API
 * (ETTERNUM_AI_MOCK=1), no idioma da pessoa. Nunca usar em produção.
 * O tipo de resposta é reconhecido pelas instruções (em português) do prompt de sistema.
 */
export function mockReply(system: string, messages: ChatTurn[], locale: Locale): string {
  const mock = messagesFor(locale).ai.mock;
  const last = messages[messages.length - 1];
  const content = typeof last?.content === "string" ? last.content : "";
  const who = /Quem você é nesta conversa: ([^\n(]+)/.exec(system)?.[1]?.trim() ?? "Etternum";

  if (system.includes("memória de longo prazo")) return mock.memory(content.slice(-160).replace(/\s+/g, " "));
  if (system.includes("síntese curta")) return mock.synthesis;
  if (system.includes("Grandes mentes disponíveis")) return `${mock.maestro}\n\n[[mente:viktor-frankl]]`;
  const question = content
    .replace(/<trechos_das_obras>[\s\S]*<\/trechos_das_obras>/, "")
    // No Conselho, a mensagem vem depois do enquadramento interno (em português) do prompt.
    .split("Nova mensagem da pessoa para o Conselho:\n")
    .pop()!
    .trim();
  return mock.reply(who, question.slice(0, 140));
}
