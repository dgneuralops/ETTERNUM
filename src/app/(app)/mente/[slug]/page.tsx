import { ArrowLeft, Plus, Share2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatView } from "@/components/ChatView";
import { ConversationList } from "@/components/ConversationList";
import { FavoriteButton } from "@/components/FavoriteButton";
import { KindBadge } from "@/components/MindCard";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { conversationsWith, favoriteSlugs, toClientMessages } from "@/lib/chat/queries";
import { allConversationMessages, getOwnedConversation } from "@/lib/chat/service";
import { MAESTRO, getAgent } from "@/lib/domain/agents";
import { canSendMessage, planState } from "@/lib/domain/plans";
import { localizeAgent } from "@/lib/i18n/content/agents";
import { accessMessage } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/mente/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const agent = getAgent(slug);
  return { title: agent ? localizeAgent(agent, locale).name : t.meta.mind };
}

export default async function MindPage({ params, searchParams }: PageProps<"/mente/[slug]">) {
  const { slug } = await params;
  const { c, responder } = (await searchParams) as { c?: string; responder?: string };
  if (slug === MAESTRO.slug) notFound();
  const found = getAgent(slug);
  if (!found) notFound();

  const { user } = await requireUser();
  const { locale, t } = await getI18n();
  const agent = localizeAgent(found, locale);
  const conversation = c ? await getOwnedConversation(user.id, c) : null;
  const valid = conversation && conversation.agentSlug === agent.slug && conversation.kind === "chat";
  const [messages, history, favorites] = await Promise.all([
    valid ? allConversationMessages(conversation.id) : Promise.resolve([]),
    conversationsWith(user.id, agent.slug),
    favoriteSlugs(user.id),
  ]);

  const access = canSendMessage(planState(user), { capsuleSlug: agent.slug, messagesToday: 0 });
  const lockedMessage = !access.ok && access.reason === "capsule_locked" ? accessMessage(t, access.reason) : null;
  const pending = messages.length > 0 && messages[messages.length - 1].role === "user";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
      <section className="min-w-0">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              href={`/area/${agent.areas[0]}`}
              className="text-muted hover:text-ink lg:hidden"
              aria-label={t.common.back}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <MindAvatar agent={agent} size="md" />
            <div>
              <KindBadge agent={agent} />
              <h1 className="font-serif text-3xl leading-tight text-ink">{agent.name}</h1>
              <p className="text-xs text-muted">
                {agent.title} · {agent.era}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FavoriteButton agentSlug={agent.slug} initial={favorites.has(agent.slug)} />
            {valid && (
              <Link
                href={`/maestro?de=${conversation.id}`}
                className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-gold"
                title={t.mindPage.forwardToMaestro}
                aria-label={t.mindPage.forwardToMaestro}
              >
                <Share2 className="h-5 w-5" />
              </Link>
            )}
            <Link
              href={`/mente/${agent.slug}`}
              className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-gold"
              title={t.common.newConversation}
              aria-label={t.common.newConversation}
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <ChatView
          key={valid ? conversation.id : "nova"}
          mind={{ slug: agent.slug, name: agent.name, focus: agent.focus }}
          conversationId={valid ? conversation.id : undefined}
          initialMessages={toClientMessages(messages)}
          autoRespond={pending && responder === "1"}
          lockedMessage={lockedMessage}
          suggestions={t.mindPage.suggestions}
        />
      </section>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <h2 className="mb-3 px-3 text-xs uppercase tracking-wider text-faint">
            {t.mindPage.conversationsWith(agent.name.split(" ")[0])}
          </h2>
          <ConversationList
            conversations={history}
            activeId={valid ? conversation.id : undefined}
            timeZone={user.timeZone}
            hrefFor={(conv) => `/mente/${agent.slug}?c=${conv.id}`}
          />
          {valid && (
            <Link
              href={`/maestro?de=${conversation.id}`}
              className="btn-ghost mt-6 block rounded-full px-4 py-2 text-center text-sm text-muted"
            >
              {t.mindPage.forwardToMaestro}
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
