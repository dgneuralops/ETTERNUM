import type { Metadata } from "next";
import Link from "next/link";
import { MindCard } from "@/components/MindCard";
import { requireUser } from "@/lib/auth/session";
import { favoriteSlugs } from "@/lib/chat/queries";
import { AGENTS } from "@/lib/domain/agents";
import { AREAS, getArea } from "@/lib/domain/areas";
import { planState } from "@/lib/domain/plans";

export const metadata: Metadata = { title: "Todas as mentes" };

export default async function MindsPage({ searchParams }: PageProps<"/mentes">) {
  const { area } = (await searchParams) as { area?: string };
  const selected = area ? getArea(area) : undefined;
  const { user } = await requireUser();
  const favorites = await favoriteSlugs(user.id);
  const plan = planState(user);
  const minds = selected ? AGENTS.filter((a) => a.areas.includes(selected.slug)) : AGENTS;

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Todas as mentes</h1>
      <p className="mt-2 text-muted">{AGENTS.length} cápsulas de grandes mentes da humanidade.</p>
      <nav
        className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6"
        aria-label="Filtrar por área"
      >
        <Link
          href="/mentes"
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${!selected ? "border-line-strong bg-gold/10 text-gold" : "border-line text-muted hover:text-ink"}`}
        >
          Todas
        </Link>
        {AREAS.map((a) => (
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
