import type { Conversation } from "@/lib/db/schema";
import { MAESTRO, getSpeaker } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import type { Locale } from "@/lib/i18n/config";
import { localizeAgent } from "@/lib/i18n/content/agents";
import { localizeArea } from "@/lib/i18n/content/areas";
import { messagesFor } from "@/lib/i18n/messages";

export function conversationHref(c: Conversation): string {
  if (c.kind === "council") return `/conselho/${c.areaSlug}?c=${c.id}`;
  if (c.agentSlug === MAESTRO.slug) return `/maestro?c=${c.id}`;
  return `/mente/${c.agentSlug}?c=${c.id}`;
}

/** Com quem foi a conversa, no idioma da pessoa ("Sêneca", "Conselho · Negócios"...). */
export function conversationLabel(c: Conversation, locale: Locale): string {
  const t = messagesFor(locale);
  if (c.kind === "council") {
    const area = getArea(c.areaSlug ?? "");
    return t.conversationsPage.councilLabel(area ? localizeArea(area, locale).name : "");
  }
  const speaker = getSpeaker(c.agentSlug ?? "");
  return speaker ? localizeAgent(speaker, locale).name : (c.agentSlug ?? "");
}
