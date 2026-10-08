import type { ChatTurn, CompleteOptions, StreamOptions, StreamResult } from "../types";

/**
 * Cliente do OpenRouter (API compatível com OpenAI: /chat/completions com streaming SSE).
 * Sem dependências: usa fetch, que pode ser injetado nos testes.
 * Documentação: https://openrouter.ai/docs/api-reference/chat-completion
 */

export type OpenRouterConfig = {
  apiKey: string;
  model: string;
  baseUrl?: string;
  /** Limite de tokens por resposta (os modelos do OpenRouter têm limites de saída variados). */
  maxTokens?: number;
  /** Identificação do app no painel do OpenRouter. */
  appUrl?: string;
  appName?: string;
  fetch?: typeof fetch;
};

export class OpenRouterError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MAX_TOKENS = 4000;

type Env = Record<string, string | undefined>;

export function openRouterConfigFromEnv(model: string, env: Env = process.env): OpenRouterConfig | null {
  const apiKey = env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;
  const maxTokens = Number(env.OPENROUTER_MAX_TOKENS);
  return {
    apiKey,
    model,
    baseUrl: env.OPENROUTER_BASE_URL?.trim() || DEFAULT_BASE_URL,
    maxTokens: Number.isFinite(maxTokens) && maxTokens > 0 ? maxTokens : DEFAULT_MAX_TOKENS,
    appUrl: env.NEXT_PUBLIC_APP_URL?.trim() || "https://etternum.app",
    appName: "Etternum",
  };
}

function request(
  config: OpenRouterConfig,
  system: string,
  messages: ChatTurn[],
  maxTokens: number | undefined,
  stream: boolean,
) {
  const limit = Math.min(maxTokens ?? Infinity, config.maxTokens ?? DEFAULT_MAX_TOKENS);
  return {
    url: `${config.baseUrl ?? DEFAULT_BASE_URL}/chat/completions`,
    init: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        ...(config.appUrl ? { "HTTP-Referer": config.appUrl } : {}),
        ...(config.appName ? { "X-Title": config.appName } : {}),
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "system", content: system }, ...messages],
        max_tokens: limit,
        stream,
      }),
    } satisfies RequestInit,
  };
}

async function errorFrom(response: Response): Promise<OpenRouterError> {
  const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
  const detail = body?.error?.message ?? response.statusText;
  return new OpenRouterError(`OpenRouter respondeu ${response.status}: ${detail}`, response.status);
}

type ChunkChoice = { delta?: { content?: string | null }; finish_reason?: string | null };
type Chunk = { choices?: ChunkChoice[]; error?: { message?: string; code?: number } };

/**
 * Lê um stream SSE do OpenRouter. Linhas que começam com ":" são comentários de keep-alive;
 * "data: [DONE]" encerra; um chunk com "error" é um erro no meio da geração.
 */
export async function readOpenRouterStream(
  body: ReadableStream<Uint8Array>,
  onText: (delta: string) => void,
): Promise<StreamResult> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let refused = false;

  const handleLine = (raw: string): boolean => {
    const line = raw.trim();
    if (!line.startsWith("data:")) return false;
    const data = line.slice(5).trim();
    if (data === "[DONE]") return true;
    const chunk = JSON.parse(data) as Chunk;
    if (chunk.error)
      throw new OpenRouterError(`OpenRouter: ${chunk.error.message ?? "erro na geração"}`, chunk.error.code);
    for (const choice of chunk.choices ?? []) {
      const delta = choice.delta?.content;
      if (delta) {
        text += delta;
        onText(delta);
      }
      if (choice.finish_reason === "content_filter") refused = true;
    }
    return false;
  };

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      if (handleLine(line)) {
        await reader.cancel().catch(() => {});
        return { text, refused };
      }
      newline = buffer.indexOf("\n");
    }
  }
  if (buffer.trim()) handleLine(buffer);
  return { text, refused };
}

export async function openRouterStream(config: OpenRouterConfig, opts: StreamOptions): Promise<StreamResult> {
  const { url, init } = request(config, opts.system, opts.messages, opts.maxTokens, true);
  const response = await (config.fetch ?? fetch)(url, { ...init, signal: opts.signal });
  if (!response.ok) throw await errorFrom(response);
  if (!response.body) throw new OpenRouterError("OpenRouter não devolveu o stream da resposta.");
  return readOpenRouterStream(response.body, opts.onText);
}

/** Resposta completa (sem streaming). Devolve null quando o provedor recusa. */
export async function openRouterComplete(config: OpenRouterConfig, opts: CompleteOptions): Promise<string | null> {
  const { url, init } = request(config, opts.system, opts.messages, opts.maxTokens, false);
  const response = await (config.fetch ?? fetch)(url, init);
  if (!response.ok) throw await errorFrom(response);
  const data = (await response.json()) as {
    choices?: { message?: { content?: string | null }; finish_reason?: string | null }[];
    error?: { message?: string };
  };
  if (data.error) throw new OpenRouterError(`OpenRouter: ${data.error.message ?? "erro na geração"}`);
  const choice = data.choices?.[0];
  if (choice?.finish_reason === "content_filter") return null;
  return choice?.message?.content ?? "";
}
