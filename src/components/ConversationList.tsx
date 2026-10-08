import Link from "next/link";
import type { Conversation } from "@/lib/db/schema";
import { DEFAULT_TIME_ZONE, isValidTimeZone } from "@/lib/domain/plans";
import { INTL_LOCALE } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

export async function ConversationList({
  conversations,
  hrefFor,
  activeId,
  timeZone,
  empty,
}: {
  conversations: Conversation[];
  hrefFor: (c: Conversation) => string;
  activeId?: string;
  /** Fuso horário da pessoa, para as datas. */
  timeZone?: string;
  empty?: string;
}) {
  const { locale, t } = await getI18n();
  if (conversations.length === 0) {
    return <p className="px-3 text-sm text-faint">{empty ?? t.conversationsPage.empty}</p>;
  }
  const dateFormat = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "short",
    timeZone: timeZone && isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIME_ZONE,
  });
  return (
    <ul className="space-y-1">
      {conversations.map((c) => (
        <li key={c.id}>
          <Link
            href={hrefFor(c)}
            className={`block rounded-xl px-3 py-2 text-sm transition ${
              c.id === activeId ? "bg-gold/10 text-gold" : "text-muted hover:bg-white/5 hover:text-ink"
            }`}
          >
            <span className="line-clamp-1">{c.title}</span>
            <span className="text-xs text-faint">{dateFormat.format(c.updatedAt)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
