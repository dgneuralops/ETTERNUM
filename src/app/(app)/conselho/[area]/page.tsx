import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CouncilView } from "@/components/CouncilView";
import { requireUser } from "@/lib/auth/session";
import { councilConversations, toClientMessages } from "@/lib/chat/queries";
import { ConversationList } from "@/components/ConversationList";
import { allConversationMessages, getOwnedConversation } from "@/lib/chat/service";
import { agentsForArea } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { canSendMessage, planState } from "@/lib/domain/plans";

export async function generateMetadata({ params }: PageProps<"/conselho/[area]">): Promise<Metadata> {
  const { area } = await params;
  return { title: `Conselho · ${getArea(area)?.name ?? ""}` };
}

export default async function CouncilPage({ params, searchParams }: PageProps<"/conselho/[area]">) {
  const { area: areaSlug } = await params;
  const { c } = (await searchParams) as { c?: string };
  const area = getArea(areaSlug);
  if (!area) notFound();
  const { user } = await requireUser();

  const conversation = c ? await getOwnedConversation(user.id, c) : null;
  const valid = conversation && conversation.kind === "council" && conversation.areaSlug === area.slug;
  const [messages, history] = await Promise.all([
    valid ? allConversationMessages(conversation.id) : Promise.resolve([]),
    councilConversations(user.id, area.slug),
  ]);
  const access = canSendMessage(planState(user), { capsuleSlug: null, council: true, messagesToday: 0 });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
      <section className="min-w-0">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-gold">Conselho</p>
            <h1 className="font-serif text-4xl leading-tight text-ink">{area.name}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Escolha até 4 mentes, conte sua situação e receba a perspectiva de cada uma — e uma síntese do Maestro com
              próximos passos.
            </p>
          </div>
          <Link
            href={`/conselho/${area.slug}`}
            className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-gold"
            title="Novo Conselho"
            aria-label="Novo Conselho"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
        <CouncilView
          key={valid ? conversation.id : "novo"}
          areaSlug={area.slug}
          areaName={area.name}
          minds={agentsForArea(area.slug).map((a) => ({ slug: a.slug, name: a.name, focus: a.focus }))}
          conversationId={valid ? conversation.id : undefined}
          initialMessages={toClientMessages(messages)}
          lockedMessage={access.ok ? null : access.message}
        />
      </section>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <h2 className="mb-3 px-3 text-xs uppercase tracking-wider text-faint">Conselhos anteriores</h2>
          <ConversationList
            conversations={history}
            activeId={valid ? conversation.id : undefined}
            hrefFor={(conv) => `/conselho/${area.slug}?c=${conv.id}`}
          />
        </div>
      </aside>
    </div>
  );
}
