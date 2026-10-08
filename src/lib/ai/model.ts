import "server-only";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { messagesFor } from "@/lib/i18n/messages";
import { mockReply } from "./mock";
import { modelFor, selectProvider, type AiProvider } from "./provider";
import { anthropicComplete, anthropicStream } from "./providers/anthropic";
import { openRouterComplete, openRouterConfigFromEnv, openRouterStream } from "./providers/openrouter";
import type { CompleteOptions, StreamOptions, StreamResult } from "./types";

/**
 * Único ponto de acesso aos modelos de IA do Etternum.
 * O provedor (OpenRouter ou Anthropic) e o modelo vêm das variáveis de ambiente — ver `provider.ts`.
 */

export type { ChatTurn, Effort, StreamResult } from "./types";

export class AiNotConfiguredError extends Error {
  constructor() {
    super(
      "Nenhum provedor de IA configurado. Defina OPENROUTER_API_KEY (ou ANTHROPIC_API_KEY), ou use ETTERNUM_AI_MOCK=1 para testar sem IA.",
    );
  }
}

export function isMockMode(): boolean {
  return process.env.ETTERNUM_AI_MOCK === "1";
}

/** Provedor e modelo em uso (para logs e para o modo demonstração). */
export function aiProviderInfo(): { provider: AiProvider; model: string } | null {
  const provider = selectProvider();
  return provider ? { provider, model: modelFor(provider) } : null;
}

function requireProvider(): { provider: AiProvider; model: string } {
  const info = aiProviderInfo();
  if (!info) throw new AiNotConfiguredError();
  return info;
}

function openRouterConfig(model: string) {
  const config = openRouterConfigFromEnv(model);
  if (!config) throw new AiNotConfiguredError();
  return config;
}

/**
 * Gera uma resposta em streaming, chamando onText a cada trecho.
 * Em caso de recusa, devolve refused=true e um texto alternativo gentil no idioma da pessoa.
 */
export async function streamReply(opts: StreamOptions & { locale?: Locale }): Promise<StreamResult> {
  const locale = opts.locale ?? DEFAULT_LOCALE;
  if (isMockMode()) {
    const text = mockReply(opts.system, opts.messages, locale);
    for (const chunk of text.match(/.{1,24}/gs) ?? []) {
      if (opts.signal?.aborted) break;
      opts.onText(chunk);
      await new Promise((r) => setTimeout(r, 15));
    }
    return { text, refused: false };
  }

  const { provider, model } = requireProvider();
  const result =
    provider === "openrouter"
      ? await openRouterStream(openRouterConfig(model), opts)
      : await anthropicStream(model, opts);
  return result.refused ? { text: messagesFor(locale).api.refusal, refused: true } : result;
}

/** Resposta completa (sem streaming), para tarefas curtas como a memória. Null quando o provedor recusa. */
export async function completeText(opts: CompleteOptions & { locale?: Locale }): Promise<string | null> {
  if (isMockMode()) return mockReply(opts.system, opts.messages, opts.locale ?? DEFAULT_LOCALE);
  const { provider, model } = requireProvider();
  return provider === "openrouter" ? openRouterComplete(openRouterConfig(model), opts) : anthropicComplete(model, opts);
}
