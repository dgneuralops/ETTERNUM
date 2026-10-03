/**
 * Regras de plano do Etternum.
 * - Teste: 14 dias de acesso completo a partir do cadastro.
 * - Gratuito (após o teste): 1 cápsula escolhida + 5 mensagens por dia.
 * - Premium: acesso ilimitado.
 */

export const TRIAL_DAYS = 14;
export const FREE_DAILY_MESSAGES = 5;
export const TIME_ZONE = "America/Sao_Paulo";

export type StoredPlan = "trial" | "premium";
export type EffectivePlan = "trial" | "free" | "premium";

export type PlanState = {
  plan: EffectivePlan;
  trialEndsAt: Date;
  /** Dias inteiros restantes no teste (0 quando acabou). */
  trialDaysLeft: number;
  freeCapsuleSlug: string | null;
};

export function trialEndFrom(createdAt: Date): Date {
  return new Date(createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}

export function planState(
  user: { plan: string; trialEndsAt: Date; freeCapsuleSlug: string | null },
  now: Date = new Date(),
): PlanState {
  const msLeft = user.trialEndsAt.getTime() - now.getTime();
  const trialDaysLeft = msLeft > 0 ? Math.ceil(msLeft / (24 * 60 * 60 * 1000)) : 0;
  let plan: EffectivePlan;
  if (user.plan === "premium") plan = "premium";
  else if (msLeft > 0) plan = "trial";
  else plan = "free";
  return { plan, trialEndsAt: user.trialEndsAt, trialDaysLeft, freeCapsuleSlug: user.freeCapsuleSlug };
}

export const PLAN_LABELS: Record<EffectivePlan, string> = {
  trial: "Teste grátis",
  free: "Gratuito",
  premium: "Premium",
};

export type AccessDecision =
  { ok: true } | { ok: false; reason: "daily_limit" | "capsule_locked" | "premium_only"; message: string };

/**
 * Decide se a pessoa pode enviar uma mensagem.
 * capsuleSlug: cápsula da conversa (null para o Maestro, que é sempre liberado).
 * council: o Conselho reúne várias cápsulas e fica fora do plano gratuito.
 */
export function canSendMessage(
  state: PlanState,
  opts: { capsuleSlug: string | null; council?: boolean; messagesToday: number },
): AccessDecision {
  if (state.plan !== "free") return { ok: true };
  if (opts.council) {
    return {
      ok: false,
      reason: "premium_only",
      message: "O Conselho com várias mentes é exclusivo do plano Premium.",
    };
  }
  if (opts.capsuleSlug && state.freeCapsuleSlug && opts.capsuleSlug !== state.freeCapsuleSlug) {
    return {
      ok: false,
      reason: "capsule_locked",
      message: "No plano gratuito você conversa com uma cápsula. Faça upgrade para acessar todas as mentes.",
    };
  }
  if (opts.messagesToday >= FREE_DAILY_MESSAGES) {
    return {
      ok: false,
      reason: "daily_limit",
      message: `Você atingiu o limite de ${FREE_DAILY_MESSAGES} mensagens por dia do plano gratuito. Faça upgrade para continuar explorando as mentes do Etternum.`,
    };
  }
  return { ok: true };
}

/** Início do dia atual no fuso de São Paulo, como instante UTC. */
export function startOfTodayInSaoPaulo(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const local = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  const offsetMs = local - Math.floor(now.getTime() / 1000) * 1000;
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day")) - offsetMs);
}
