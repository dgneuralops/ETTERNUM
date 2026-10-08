import { FREE_DAILY_MESSAGES, type AccessDenial } from "@/lib/domain/plans";
import { INTL_LOCALE, type Locale } from "./config";
import type { Messages } from "./messages";

/** Texto do motivo pelo qual o plano bloqueou uma ação. */
export function accessMessage(t: Messages, reason: AccessDenial): string {
  return reason === "daily_limit" ? t.plans.errors.daily_limit(FREE_DAILY_MESSAGES) : t.plans.errors[reason];
}

/** Data por extenso no idioma da pessoa (ex.: "4 de outubro de 2026", "October 4, 2026"). */
export function formatLongDate(date: Date, locale: Locale, timeZone?: string): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long", timeZone }).format(date);
}

/** Data de nascimento (AAAA-MM-DD) no formato do idioma, sem efeito de fuso horário. */
export function formatBirthDate(isoDate: string, locale: Locale): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
