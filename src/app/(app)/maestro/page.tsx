import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ChatView, type MindSummary } from "@/components/ChatView";
import { ConversationList } from "@/components/ConversationList";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { conversationsWith, toClientMessages } from "@/lib/chat/queries";
import { allConversationMessages, conversationMessages, getOwnedConversation } from "@/lib/chat/service";
import { AGENTS, MAESTRO } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { localizeAgent, localizeAgents } from "@/lib/i18n/content/agents";
import { localizeArea } from "@/lib/i18n/content/areas";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.maestro };
}

export default async function MaestroPage({ searchParams }: PageProps<"/maestro">) {
  const { c, area, texto, de } = (await searchParams) as { c?: string; area?: string; texto?: string; de?: string };
  const { user } = await requireUser();
  const { locale, t } = await getI18n();
  const maestro = localizeAgent(MAESTRO, locale);
  const minds: Record<string, MindSummary> = Object.fromEntries(
    localizeAgents(AGENTS, locale).map((a) => [a.slug, { slug: a.slug, name: a.name, focus: a.focus }]),
  );

  const conversation = c ? await getOwnedConversation(user.id, c) : null;
  const valid = conversation && conversation.agentSlug === MAESTRO.slug && conversation.kind === "chat";
  const [messages, history] = await Promise.all([
    valid ? allConversationMessages(conversation.id) : Promise.resolve([]),
    conversationsWith(user.id, MAESTRO.slug),
  ]);

  // "Encaminhar ao Maestro": traz a última mensagem da conversa com a outra mente.
  let draft = texto ?? "";
  if (!valid && de) {
    const source = await getOwnedConversation(user.id, de);
    if (source) {
      const recent = await conversationMessages(source.id, 20);
      draft = [...recent].reverse().find((m) => m.role === "user")?.content ?? "";
    }
  }
  const areaFound = area ? getArea(area) : undefined;
  const areaInfo = areaFound ? localizeArea(areaFound, locale) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
      <section className="min-w-0">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <MindAvatar agent={MAESTRO} size="md" />
            <div>
              <h1 className="font-serif text-3xl leading-tight text-ink">Maestro</h1>
              <p className="text-xs text-muted">
                {areaInfo ? t.maestroPage.areaSubtitle(areaInfo.name) : t.maestroPage.subtitle}
              </p>
            </div>
          </div>
          <Link
            href="/maestro"
            className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-gold"
            title={t.common.newConversation}
            aria-label={t.common.newConversation}
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
        <ChatView
          key={valid ? conversation.id : `nova-${area ?? ""}`}
          mind={{ slug: maestro.slug, name: maestro.name, focus: maestro.tagline }}
          conversationId={valid ? conversation.id : undefined}
          initialMessages={toClientMessages(messages)}
          areaSlug={areaInfo?.slug}
          initialDraft={draft}
          autoSend={Boolean(texto) && !valid}
          minds={minds}
          suggestions={t.maestroPage.suggestions}
          placeholder={t.maestroPage.placeholder}
        />
      </section>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <h2 className="mb-3 px-3 text-xs uppercase tracking-wider text-faint">{t.maestroPage.history}</h2>
          <ConversationList
            conversations={history}
            activeId={valid ? conversation.id : undefined}
            timeZone={user.timeZone}
            hrefFor={(conv) => `/maestro?c=${conv.id}`}
          />
        </div>
      </aside>
    </div>
  );
}
