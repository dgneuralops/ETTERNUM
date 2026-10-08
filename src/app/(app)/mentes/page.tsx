import type { Metadata } from "next";
import Link from "next/link";
import { MindCard } from "@/components/MindCard";
import { requireUser } from "@/lib/auth/session";
import { favoriteSlugs } from "@/lib/chat/queries";
import { AGENTS } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { planState } from "@/lib/domain/plans";
import { localizeAgents } from "@/lib/i18n/content/agents";
import { localizedAreas } from "@/lib/i18n/content/areas";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.minds };
}

export default async function MindsPage({ searchParams }: PageProps<"/mentes">) {
  const { area } = (await searchParams) as { area?: string };
  const selected = area ? getArea(area) : undefined;
  const { user } = await requireUser();
  const { locale, t } = await getI18n();
  const favorites = await favoriteSlugs(user.id);
  const plan = planState(user);
  const minds = localizeAgents(selected ? AGENTS.filter((a) => a.areas.includes(selected.slug)) : AGENTS, locale);

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">{t.mindsPage.title}</h1>
      <p className="mt-2 text-muted">{t.mindsPage.subtitle(AGENTS.length)}</p>
      <nav
        className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
        aria-label={t.mindsPage.filterLabel}
      >
        <Link
          href="/mentes"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${!selected ? "border-line-strong bg-gold/10 text-gold" : "border-line text-muted hover:text-ink"}`}
        >
          {t.mindsPage.all}
        </Link>
        {localizedAreas(locale).map((a) => (
          <Link
            key={a.slug}
            href={`/mentes?area=${a.slug}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${selected?.slug === a.slug ? "border-line-strong bg-gold/10 text-gold" : "border-line text-muted hover:text-ink"}`}
          >
            {a.name}
          </Link>
        ))}
      </nav>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {minds.map((agent) => (
          <MindCard
            key={agent.slug}
            agent={agent}
            favorite={favorites.has(agent.slug)}
            locked={plan.plan === "free" && plan.freeCapsuleSlug !== null && plan.freeCapsuleSlug !== agent.slug}
          />
        ))}
      </div>
    </div>
  );
}
