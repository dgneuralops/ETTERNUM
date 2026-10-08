import Link from "next/link";
import type { Agent } from "@/lib/domain/agents";
import { getI18n } from "@/lib/i18n/server";
import { FavoriteButton } from "./FavoriteButton";
import { MindAvatar } from "./MindAvatar";

export async function KindBadge({ agent }: { agent: Agent }) {
  if (agent.kind !== "inspired") return null;
  const { t } = await getI18n();
  return (
    <span
      className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted"
      title={t.common.inspiredTooltip}
    >
      {t.common.inspiredBadge}
    </span>
  );
}

/** Recebe a mente já traduzida (`localizeAgent`). */
export async function MindCard({
  agent,
  favorite,
  locked = false,
  className = "",
}: {
  agent: Agent;
  /** undefined: sem botão de favorito (ex.: landing page). */
  favorite?: boolean;
  locked?: boolean;
  className?: string;
}) {
  const { t } = await getI18n();
  return (
    <article className={`glass group relative flex flex-col rounded-3xl p-5 ${className}`}>
      {favorite !== undefined && (
        <div className="absolute right-3 top-3">
          <FavoriteButton agentSlug={agent.slug} initial={favorite} />
        </div>
      )}
      <div className="flex items-center gap-4">
        <MindAvatar agent={agent} size="lg" />
        <div className="min-w-0 pr-6">
          <KindBadge agent={agent} />
          <h3 className="mt-1 font-serif text-2xl leading-tight text-ink">{agent.name}</h3>
          <p className="text-xs text-faint">{agent.era}</p>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gold">{agent.focus}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{agent.tagline}</p>
      <Link
        href={`/mente/${agent.slug}`}
        className={`mt-5 inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ${
          locked ? "btn-ghost text-muted" : "btn-gold"
        }`}
      >
        {locked ? t.common.premiumOnly : t.common.accessMind}
      </Link>
    </article>
  );
}
