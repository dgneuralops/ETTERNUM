import type { Conversation } from "@/lib/db/schema";
import { MAESTRO, getSpeaker } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";

export function conversationHref(c: Conversation): string {
  if (c.kind === "council") return `/conselho/${c.areaSlug}?c=${c.id}`;
  if (c.agentSlug === MAESTRO.slug) return `/maestro?c=${c.id}`;
  return `/mente/${c.agentSlug}?c=${c.id}`;
}

export function conversationLabel(c: Conversation): string {
  if (c.kind === "council") return `Conselho · ${getArea(c.areaSlug ?? "")?.name ?? ""}`;
  return getSpeaker(c.agentSlug ?? "")?.name ?? "Conversa";
}
