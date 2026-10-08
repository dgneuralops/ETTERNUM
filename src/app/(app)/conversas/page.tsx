import { Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { deleteConversation } from "@/app/actions/account";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { conversationHref, conversationLabel } from "@/lib/chat/links";
import { recentConversations } from "@/lib/chat/queries";
import { MAESTRO, getSpeaker } from "@/lib/domain/agents";
import { DEFAULT_TIME_ZONE, isValidTimeZone } from "@/lib/domain/plans";
import { INTL_LOCALE } from "@/lib/i18n/config";
import { localizeAgent } from "@/lib/i18n/content/agents";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.conversations };
}

export default async function ConversationsPage() {
  const { user } = await requireUser();
  const { locale, t } = await getI18n();
  const p = t.conversationsPage;
  const conversations = await recentConversations(user.id, 200);
  const dateFormat = new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: isValidTimeZone(user.timeZone) ? user.timeZone : DEFAULT_TIME_ZONE,
  });

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">{p.title}</h1>
      <p className="mt-2 text-muted">{p.intro}</p>
      {conversations.length === 0 ? (
        <div className="glass mt-8 rounded-3xl p-6 text-muted">
          {p.emptyBefore}{" "}
          <Link href="/maestro" className="text-gold hover:underline">
            {p.emptyLink}
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {conversations.map((c) => {
            const speaker = c.kind === "council" ? MAESTRO : (getSpeaker(c.agentSlug ?? "") ?? MAESTRO);
            return (
              <li key={c.id} className="glass flex items-center gap-4 rounded-3xl p-4">
                <MindAvatar agent={localizeAgent(speaker, locale)} size="md" />
                <Link href={conversationHref(c)} className="min-w-0 flex-1">
                  <span className="block text-xs uppercase tracking-wider text-gold">
                    {conversationLabel(c, locale)}
                  </span>
                  <span className="block truncate text-ink">{c.title}</span>
                  <span className="block text-xs text-faint">{dateFormat.format(c.updatedAt)}</span>
                </Link>
                <form action={deleteConversation.bind(null, c.id)}>
                  <button
                    type="submit"
                    className="rounded-full p-2 text-faint hover:bg-white/5 hover:text-danger"
                    aria-label={p.delete(c.title)}
                    title={p.deleteTitle}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
