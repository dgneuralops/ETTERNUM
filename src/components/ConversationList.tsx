import Link from "next/link";
import type { Conversation } from "@/lib/db/schema";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "America/Sao_Paulo" });

export function ConversationList({
  conversations,
  hrefFor,
  activeId,
  empty = "Nenhuma conversa ainda.",
}: {
  conversations: Conversation[];
  hrefFor: (c: Conversation) => string;
  activeId?: string;
  empty?: string;
}) {
  if (conversations.length === 0) return <p className="px-3 text-sm text-faint">{empty}</p>;
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
