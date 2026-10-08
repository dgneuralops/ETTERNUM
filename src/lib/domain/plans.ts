/**
 * Regras de plano do Etternum.
 * - Teste: 14 dias de acesso completo a partir do cadastro.
 * - Gratuito (após o teste): 1 cápsula escolhida + 5 mensagens por dia.
 * - Premium: acesso ilimitado.
 */

export const TRIAL_DAYS = 14;
export const FREE_DAILY_MESSAGES = 5;
/** Fuso usado quando a pessoa não informou o dela (contas antigas, navegador sem Intl). */
export const DEFAULT_TIME_ZONE = "America/Sao_Paulo";

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

export type AccessDenial = "daily_limit" | "capsule_locked" | "premium_only";

/** O texto de cada motivo fica no dicionário (`plans.errors`), no idioma da pessoa. */
export type AccessDecision = { ok: true } | { ok: false; reason: AccessDenial };

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
  if (opts.council) return { ok: false, reason: "premium_only" };
  if (opts.capsuleSlug && state.freeCapsuleSlug && opts.capsuleSlug !== state.freeCapsuleSlug) {
    return { ok: false, reason: "capsule_locked" };
  }
  if (opts.messagesToday >= FREE_DAILY_MESSAGES) return { ok: false, reason: "daily_limit" };
  return { ok: true };
}

export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || !value || value.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** Hora (0–23) agora no fuso da pessoa — usada na saudação. */
export function hourIn(timeZone: string, now: Date = new Date()): number {
  const zone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE;
  const hour = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", hourCycle: "h23" }).format(now);
  return Number(hour) % 24;
}

/** Início do dia atual no fuso da pessoa, como instante UTC (o limite diário recomeça à meia-noite local). */
export function startOfTodayIn(timeZone: string, now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE,
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
