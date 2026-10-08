/**
 * Escolha do provedor de IA a partir das variáveis de ambiente.
 * - ETTERNUM_AI_PROVIDER força "openrouter" ou "anthropic".
 * - Sem ela, OPENROUTER_API_KEY tem prioridade; depois ANTHROPIC_API_KEY.
 * - ETTERNUM_MODEL troca o modelo do provedor escolhido.
 */

export type AiProvider = "openrouter" | "anthropic";

export const DEFAULT_MODELS: Record<AiProvider, string> = {
  openrouter: "typesafe/jev-1.13",
  anthropic: "claude-opus-5-5",
};

type Env = Record<string, string | undefined>;

export function selectProvider(env: Env = process.env): AiProvider | null {
  const forced = env.ETTERNUM_AI_PROVIDER?.trim().toLowerCase();
  if (forced === "openrouter" || forced === "anthropic") return forced;
  if (env.OPENROUTER_API_KEY) return "openrouter";
  if (env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN) return "anthropic";
  return null;
}

export function modelFor(provider: AiProvider, env: Env = process.env): string {
  return env.ETTERNUM_MODEL?.trim() || DEFAULT_MODELS[provider];
}
