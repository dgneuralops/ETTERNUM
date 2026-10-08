import Anthropic from "@anthropic-ai/sdk";
import type { CompleteOptions, Effort, StreamOptions, StreamResult } from "../types";

/** Cliente do Claude (Anthropic), pelo SDK oficial. */

/** Modelos da geração 5 aceitam `effort` e o fallback automático no servidor. */
const supportsModernParams = (model: string) => /^claude-(opus|sonnet|fable)-5/.test(model);

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

function modernParams(model: string, effort: Effort) {
  if (!supportsModernParams(model)) return {};
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

export async function anthropicStream(model: string, opts: StreamOptions): Promise<StreamResult> {
  const stream = getClient().beta.messages.stream(
    {
      model,
      max_tokens: opts.maxTokens ?? 64000,
      system: opts.system,
      messages: opts.messages,
      cache_control: { type: "ephemeral" },
      ...modernParams(model, opts.effort),
    },
    { signal: opts.signal },
  );
  stream.on("text", (delta) => opts.onText(delta));
  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal") return { text: "", refused: true };
  return { text: textOf(final), refused: false };
}

export async function anthropicComplete(model: string, opts: CompleteOptions): Promise<string | null> {
  const message = await getClient().beta.messages.create({
    model,
    max_tokens: opts.maxTokens ?? 16000,
    system: opts.system,
    messages: opts.messages,
    ...modernParams(model, opts.effort),
  });
  if (message.stop_reason === "refusal") return null;
  return textOf(message);
}
