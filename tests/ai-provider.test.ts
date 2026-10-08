import { describe, expect, it } from "vitest";
import { DEFAULT_MODELS, modelFor, selectProvider } from "@/lib/ai/provider";
import {
  OpenRouterError,
  openRouterComplete,
  openRouterConfigFromEnv,
  openRouterStream,
  readOpenRouterStream,
  type OpenRouterConfig,
} from "@/lib/ai/providers/openrouter";

/** Stream que entrega os pedaços exatamente como dados, para simular quebras no meio das linhas. */
function streamOf(pieces: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const piece of pieces) controller.enqueue(encoder.encode(piece));
      controller.close();
    },
  });
}

const sse = (chunk: unknown) => `data: ${JSON.stringify(chunk)}\n\n`;
const delta = (content: string, finish: string | null = null) => ({
  choices: [{ delta: { content }, finish_reason: finish }],
});

function fakeFetch(response: Response, calls: { url: string; init: RequestInit }[] = []) {
  return (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return response;
  }) as unknown as typeof fetch;
}

const config = (fetchImpl: typeof fetch): OpenRouterConfig => ({
  apiKey: "chave-de-teste",
  model: "typesafe/jev-1.13",
  baseUrl: "https://openrouter.test/api/v1",
  maxTokens: 4000,
  appUrl: "https://etternum.app",
  appName: "Etternum",
  fetch: fetchImpl,
});

describe("Escolha do provedor de IA", () => {
  it("OpenRouter tem prioridade e usa o modelo pedido por padrão", () => {
    const env = { OPENROUTER_API_KEY: "x", ANTHROPIC_API_KEY: "y" };
    expect(selectProvider(env)).toBe("openrouter");
    expect(modelFor("openrouter", env)).toBe("typesafe/jev-1.13");
    expect(DEFAULT_MODELS.openrouter).toBe("typesafe/jev-1.13");
  });
  it("respeita a escolha explícita e o modelo configurado", () => {
    expect(selectProvider({ ETTERNUM_AI_PROVIDER: "anthropic", OPENROUTER_API_KEY: "x" })).toBe("anthropic");
    expect(selectProvider({ ANTHROPIC_API_KEY: "y" })).toBe("anthropic");
    expect(selectProvider({})).toBeNull();
    expect(modelFor("openrouter", { ETTERNUM_MODEL: "outro/modelo" })).toBe("outro/modelo");
  });
  it("lê a configuração do OpenRouter do ambiente", () => {
    expect(openRouterConfigFromEnv("m", {})).toBeNull();
    expect(openRouterConfigFromEnv("m", { OPENROUTER_API_KEY: " k ", OPENROUTER_MAX_TOKENS: "2000" })).toMatchObject({
      apiKey: "k",
      model: "m",
      maxTokens: 2000,
      baseUrl: "https://openrouter.ai/api/v1",
    });
  });
});

describe("Cliente do OpenRouter", () => {
  it("faz streaming juntando pedaços quebrados no meio da linha e ignora comentários", async () => {
    const body =
      sse(delta("Olá, ")) + ": OPENROUTER PROCESSING\n\n" + sse(delta("tudo bem?", "stop")) + "data: [DONE]\n\n";
    const pieces = [body.slice(0, 17), body.slice(17, 60), body.slice(60)];
    const calls: { url: string; init: RequestInit }[] = [];
    const seen: string[] = [];
    const result = await openRouterStream(config(fakeFetch(new Response(streamOf(pieces), { status: 200 }), calls)), {
      system: "Você é o Maestro.",
      messages: [{ role: "user", content: "oi" }],
      effort: "medium",
      maxTokens: 64000,
      onText: (t) => seen.push(t),
    });
    expect(result).toEqual({ text: "Olá, tudo bem?", refused: false });
    expect(seen).toEqual(["Olá, ", "tudo bem?"]);

    expect(calls[0].url).toBe("https://openrouter.test/api/v1/chat/completions");
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer chave-de-teste");
    expect(headers["X-Title"]).toBe("Etternum");
    const sent = JSON.parse(String(calls[0].init.body));
    expect(sent).toMatchObject({ model: "typesafe/jev-1.13", stream: true, max_tokens: 4000 });
    expect(sent.messages).toEqual([
      { role: "system", content: "Você é o Maestro." },
      { role: "user", content: "oi" },
    ]);
  });

  it("marca recusa quando o filtro de conteúdo interrompe", async () => {
    const result = await readOpenRouterStream(
      streamOf([sse(delta("Não posso", "content_filter")), "data: [DONE]\n"]),
      () => {},
    );
    expect(result.refused).toBe(true);
  });

  it("transforma erros HTTP e erros no meio do stream em OpenRouterError", async () => {
    const unauthorized = new Response(JSON.stringify({ error: { message: "No auth credentials found" } }), {
      status: 401,
    });
    await expect(
      openRouterStream(config(fakeFetch(unauthorized)), {
        system: "s",
        messages: [{ role: "user", content: "oi" }],
        effort: "low",
        onText: () => {},
      }),
    ).rejects.toThrow(/401: No auth credentials found/);

    await expect(
      readOpenRouterStream(
        streamOf([sse(delta("começo")), sse({ error: { message: "Provider overloaded" } })]),
        () => {},
      ),
    ).rejects.toBeInstanceOf(OpenRouterError);
  });

  it("resposta completa sem streaming (memória)", async () => {
    const ok = new Response(
      JSON.stringify({ choices: [{ message: { content: "## Momento atual\n- algo" }, finish_reason: "stop" }] }),
      { status: 200 },
    );
    const calls: { url: string; init: RequestInit }[] = [];
    const text = await openRouterComplete(config(fakeFetch(ok, calls)), {
      system: "s",
      messages: [{ role: "user", content: "x" }],
      effort: "low",
      maxTokens: 1000,
    });
    expect(text).toBe("## Momento atual\n- algo");
    expect(JSON.parse(String(calls[0].init.body))).toMatchObject({ stream: false, max_tokens: 1000 });

    const filtered = new Response(
      JSON.stringify({ choices: [{ message: { content: "" }, finish_reason: "content_filter" }] }),
    );
    expect(
      await openRouterComplete(config(fakeFetch(filtered)), { system: "s", messages: [], effort: "low" }),
    ).toBeNull();
  });
});
