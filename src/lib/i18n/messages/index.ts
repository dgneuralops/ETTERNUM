import type { Locale } from "../config";
import en from "./en";
import es from "./es";
import fr from "./fr";
import ptBR, { type Messages } from "./pt-BR";

export type { Messages };

export const MESSAGES: Record<Locale, Messages> = { "pt-BR": ptBR, en, es, fr };

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}
