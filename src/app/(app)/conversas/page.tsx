import { Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { deleteConversation } from "@/app/actions/account";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { conversationHref, conversationLabel } from "@/lib/chat/links";
import { recentConversations } from "@/lib/chat/queries";
import { MAESTRO, getSpeaker } from "@/lib/domain/agents";

export const metadata: Metadata = { title: "Minhas conversas" };

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export default async function ConversationsPage() {
  const { user } = await requireUser();
  const conversations = await recentConversations(user.id, 200);

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Minhas conversas</h1>
      <p className="mt-2 text-muted">Tudo o que você conversou fica guardado aqui. Continue de onde parou.</p>
      {conversations.length === 0 ? (
        <div className="glass mt-8 rounded-3xl p-6 text-muted">
          Você ainda não conversou com ninguém.{" "}
          <Link href="/maestro" className="text-gold hover:underline">
            Comece pelo Maestro
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {conversations.map((c) => {
            const speaker = c.kind === "council" ? MAESTRO : (getSpeaker(c.agentSlug ?? "") ?? MAESTRO);
            return (
              <li key={c.id} className="glass flex items-center gap-4 rounded-3xl p-4">
                <MindAvatar agent={speaker} size="md" />
                <Link href={conversationHref(c)} className="min-w-0 flex-1">
                  <span className="block text-xs uppercase tracking-wider text-gold">{conversationLabel(c)}</span>
                  <span className="block truncate text-ink">{c.title}</span>
                  <span className="block text-xs text-faint">{dateFormat.format(c.updatedAt)}</span>
                </Link>
                <form action={deleteConversation.bind(null, c.id)}>
                  <button
                    type="submit"
                    className="rounded-full p-2 text-faint hover:bg-white/5 hover:text-danger"
                    aria-label={`Excluir conversa "${c.title}"`}
                    title="Excluir conversa"
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
