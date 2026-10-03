import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { mockReply } from "./mock";

export const AI_MODEL = process.env.ETTERNUM_MODEL || "claude-opus-5-5";

/** Modelos da geração 5 aceitam `effort` e o fallback automático no servidor. */
const SUPPORTS_MODERN_PARAMS = /^claude-(opus|sonnet|fable)-5/.test(AI_MODEL);

export type Effort = "low" | "medium" | "high";
export type ChatTurn = Anthropic.Beta.BetaMessageParam;

export const REFUSAL_TEXT =
  "Não consegui responder a isso agora. Pode me contar de outro jeito o que você está vivendo?";

export class AiNotConfiguredError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY não configurada. Defina a chave ou use ETTERNUM_AI_MOCK=1 para testar sem IA.");
  }
}

export function isMockMode(): boolean {
  return process.env.ETTERNUM_AI_MOCK === "1";
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) throw new AiNotConfiguredError();
  client ??= new Anthropic();
  return client;
}

function modernParams(effort: Effort) {
  if (!SUPPORTS_MODERN_PARAMS) return {};
  return {
    output_config: { effort },
    // Se um classificador de segurança recusar, a API tenta o modelo recomendado.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default" as const,
  };
}

function textOf(message: Anthropic.Beta.BetaMessage): string {
  return message.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export type StreamResult = { text: string; refused: boolean };

/**
 * Gera uma resposta em streaming, chamando onText a cada trecho.
 * Em caso de recusa, devolve refused=true e um texto alternativo gentil.
 */
export async function streamReply(opts: {
  system: string;
  messages: ChatTurn[];
  effort: Effort;
  maxTokens?: number;
  onText: (delta: string) => void;
  signal?: AbortSignal;
}): Promise<StreamResult> {
  if (isMockMode()) {
    const text = mockReply(opts.system, opts.messages);
    for (const chunk of text.match(/.{1,24}/gs) ?? []) {
      if (opts.signal?.aborted) break;
      opts.onText(chunk);
      await new Promise((r) => setTimeout(r, 15));
    }
    return { text, refused: false };
  }

  const stream = getClient().beta.messages.stream(
    {
      model: AI_MODEL,
      max_tokens: opts.maxTokens ?? 64000,
      system: opts.system,
      messages: opts.messages,
      cache_control: { type: "ephemeral" },
      ...modernParams(opts.effort),
    },
    { signal: opts.signal },
  );
  stream.on("text", (delta) => opts.onText(delta));
  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal") return { text: REFUSAL_TEXT, refused: true };
  return { text: textOf(final), refused: false };
}

/** Resposta completa (sem streaming), para tarefas curtas como memória. */
export async function completeText(opts: {
  system: string;
  messages: ChatTurn[];
  effort: Effort;
  maxTokens?: number;
}): Promise<string | null> {
  if (isMockMode()) return mockReply(opts.system, opts.messages);
  const message = await getClient().beta.messages.create({
    model: AI_MODEL,
    max_tokens: opts.maxTokens ?? 16000,
    system: opts.system,
    messages: opts.messages,
    ...modernParams(opts.effort),
  });
  if (message.stop_reason === "refusal") return null;
  return textOf(message);
}
