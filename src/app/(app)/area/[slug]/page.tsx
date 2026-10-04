import { Infinity as InfinityIcon, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AreaIcon } from "@/components/AreaIcon";
import { MindCard } from "@/components/MindCard";
import { requireUser } from "@/lib/auth/session";
import { favoriteSlugs } from "@/lib/chat/queries";
import { agentsForArea } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { planState } from "@/lib/domain/plans";
import { localizeAgents } from "@/lib/i18n/content/agents";
import { localizeArea } from "@/lib/i18n/content/areas";
import { getLocalizedSign } from "@/lib/i18n/content/zodiac";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata({ params }: PageProps<"/area/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const area = getArea(slug);
  return { title: area ? localizeArea(area, locale).name : t.meta.area };
}

export default async function AreaPage({ params }: PageProps<"/area/[slug]">) {
  const { slug } = await params;
  const found = getArea(slug);
  if (!found) notFound();
  const { user } = await requireUser();
  const { locale, t } = await getI18n();
  const area = localizeArea(found, locale);
  const a = t.areaPage;
  const favorites = await favoriteSlugs(user.id);
  const plan = planState(user);
  const minds = localizeAgents(agentsForArea(area.slug), locale);
  const sign = area.slug === "astrologia" ? getLocalizedSign(user.zodiacSign, locale) : undefined;

  return (
    <div>
      <header className="flex items-start gap-4">
        <span
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line"
          style={{ color: area.color, background: `${area.color}14` }}
        >
          <AreaIcon name={area.icon} className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-serif text-4xl leading-tight text-ink">{area.name}</h1>
          <p className="mt-2 max-w-2xl text-muted">{area.description}</p>
        </div>
      </header>

      {sign && (
        <section className="glass mt-8 rounded-3xl p-6">
          <p className="text-xs uppercase tracking-wider text-gold">{a.signEyebrow}</p>
          <h2 className="mt-1 font-serif text-3xl text-ink">
            {sign.symbol} {sign.name}
          </h2>
          <p className="mt-1 text-sm text-faint">{a.signMeta(sign.element, sign.modality, sign.ruler)}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink">{a.strengths}</dt>
              <dd className="text-muted">{sign.strengths}</dd>
            </div>
            <div>
              <dt className="text-ink">{a.challenges}</dt>
              <dd className="text-muted">{sign.challenges}</dd>
            </div>
            <div>
              <dt className="text-ink">{a.underStress}</dt>
              <dd className="text-muted">{sign.underStress}</dd>
            </div>
            <div>
              <dt className="text-ink">{a.whatHelps}</dt>
              <dd className="text-muted">{sign.whatHelps}</dd>
            </div>
          </dl>
        </section>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/conselho/${area.slug}`}
          className="glass flex items-center gap-4 rounded-3xl p-5 transition hover:border-line-strong"
        >
          <Users className="h-6 w-6 shrink-0 text-gold" aria-hidden />
          <span>
            <span className="block font-serif text-xl text-ink">{a.councilTitle}</span>
            <span className="block text-sm text-muted">{a.councilText}</span>
          </span>
        </Link>
        <Link
          href={`/maestro?area=${area.slug}`}
          className="glass flex items-center gap-4 rounded-3xl p-5 transition hover:border-line-strong"
        >
          <InfinityIcon className="h-6 w-6 shrink-0 text-gold" aria-hidden />
          <span>
            <span className="block font-serif text-xl text-ink">{a.maestroTitle}</span>
            <span className="block text-sm text-muted">{a.maestroText}</span>
          </span>
        </Link>
      </div>

      <h2 className="mb-4 mt-12 font-serif text-3xl text-ink">{a.mindsTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
