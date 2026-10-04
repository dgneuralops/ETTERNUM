import { ArrowRight, Hourglass, Infinity as InfinityIcon, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AreaCard } from "@/components/AreaCard";
import { MindAvatar } from "@/components/MindAvatar";
import { MindCard } from "@/components/MindCard";
import { MindCarousel } from "@/components/MindCarousel";
import { requireUser } from "@/lib/auth/session";
import { favoriteSlugs, recentConversations } from "@/lib/chat/queries";
import { conversationHref, conversationLabel } from "@/lib/chat/links";
import { MAESTRO, agentsForArea, carouselAgents, getAgent } from "@/lib/domain/agents";
import { hourIn, planState } from "@/lib/domain/plans";
import { localizeAgent, localizeAgents } from "@/lib/i18n/content/agents";
import { localizedAreas } from "@/lib/i18n/content/areas";
import { getLocalizedSign } from "@/lib/i18n/content/zodiac";
import type { Messages } from "@/lib/i18n/messages";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.home };
}

/** Saudação conforme a hora no fuso horário da pessoa. */
function greeting(t: Messages, name: string, timeZone: string): string {
  const hour = hourIn(timeZone);
  if (hour >= 5 && hour < 12) return t.home.greetingMorning(name);
  if (hour >= 12 && hour < 18) return t.home.greetingAfternoon(name);
  return t.home.greetingEvening(name);
}

export default async function HomePage() {
  const { user, profile } = await requireUser();
  const { locale, t } = await getI18n();
  const [favorites, recent] = await Promise.all([favoriteSlugs(user.id), recentConversations(user.id, 4)]);
  const plan = planState(user);
  const sign = getLocalizedSign(user.zodiacSign, locale);
  const firstName = user.name.split(" ")[0];
  const lastConversation = recent[0];
  const board = [...favorites]
    .map((slug) => getAgent(slug))
    .filter((a) => a !== undefined)
    .map((a) => localizeAgent(a, locale));
  const interests = profile?.interestAreas ?? [];
  const areas = localizedAreas(locale).sort(
    (a, b) => Number(interests.includes(b.slug)) - Number(interests.includes(a.slug)),
  );

  return (
    <div className="space-y-12">
      <section>
        <p className="text-sm text-muted">
          {greeting(t, firstName, user.timeZone)}
          {sign && (
            <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-xs text-gold">
              {sign.symbol} {sign.name}
            </span>
          )}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">{t.home.title}</h1>

        <form action="/maestro" className="glass mt-6 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <MindAvatar agent={MAESTRO} size="sm" />
            <p className="text-sm text-muted">{t.home.maestroListening}</p>
          </div>
          <label htmlFor="texto" className="sr-only">
            {t.home.maestroLabel}
          </label>
          <textarea
            id="texto"
            name="texto"
            rows={3}
            required
            placeholder={t.home.maestroPlaceholder}
            className="mt-3 w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-faint"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/maestro" className="text-sm text-muted hover:text-gold">
              {t.home.maestroHistory}
            </Link>
            <button
              type="submit"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              {t.home.talk} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {lastConversation && (
          <Link
            href={conversationHref(lastConversation)}
            className="glass mt-4 flex items-center gap-4 rounded-3xl p-4 transition hover:border-line-strong"
          >
            <Hourglass className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block text-xs uppercase tracking-wider text-faint">{t.home.continueTitle}</span>
              <span className="block truncate text-ink">
                {conversationLabel(lastConversation, locale)} — {lastConversation.title}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted" aria-hidden />
          </Link>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <h2 className="flex items-center gap-2 font-serif text-3xl text-ink">
            <Star className="h-5 w-5 text-gold" aria-hidden /> {t.home.boardTitle}
          </h2>
          <Link href="/mentes" className="text-sm text-muted hover:text-gold">
            {t.home.exploreMinds}
          </Link>
        </div>
        {board.length === 0 ? (
          <p className="glass rounded-3xl p-6 text-sm text-muted">{t.home.boardEmpty}</p>
        ) : (
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
            {board.map((agent) => (
              <Link
                key={agent.slug}
                href={`/mente/${agent.slug}`}
                className="glass flex w-40 shrink-0 flex-col items-center rounded-3xl p-4 text-center transition hover:border-line-strong"
              >
                <MindAvatar agent={agent} size="lg" />
                <span className="mt-3 font-serif text-lg leading-tight text-ink">{agent.name}</span>
                <span className="mt-1 text-xs text-muted">{agent.focus}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <h2 className="font-serif text-3xl text-ink">{t.home.areasTitle}</h2>
          <Link href="/areas" className="text-sm text-muted hover:text-gold">
            {t.common.seeAll}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.slice(0, 6).map((area) => (
            <AreaCard key={area.slug} area={area} count={agentsForArea(area.slug).length} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-3xl text-ink">{t.home.mindsTitle}</h2>
        <MindCarousel label={t.home.mindsTitle}>
          {localizeAgents(carouselAgents(), locale).map((agent) => (
            <MindCard
              key={agent.slug}
              agent={agent}
              favorite={favorites.has(agent.slug)}
              locked={plan.plan === "free" && plan.freeCapsuleSlug !== null && plan.freeCapsuleSlug !== agent.slug}
              className="w-[82%] shrink-0 snap-start sm:w-[300px]"
            />
          ))}
        </MindCarousel>
      </section>

      <section className="glass flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
        <InfinityIcon className="h-8 w-8 shrink-0 text-gold" aria-hidden />
        <div>
          <p className="text-xs uppercase tracking-wider text-gold">{t.home.memoryCapsuleEyebrow}</p>
          <h2 className="font-serif text-2xl text-ink">{t.home.memoryCapsuleTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.home.memoryCapsuleText}</p>
        </div>
      </section>
    </div>
  );
}
