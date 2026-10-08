import { ArrowRight, BookOpenText, MessagesSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { AreaCard } from "@/components/AreaCard";
import { MindAvatar } from "@/components/MindAvatar";
import { MindCard } from "@/components/MindCard";
import { MindCarousel } from "@/components/MindCarousel";
import { WaitlistForm } from "@/components/WaitlistForm";
import { AGENTS, MAESTRO, agentsForArea, carouselAgents } from "@/lib/domain/agents";
import { FREE_DAILY_MESSAGES, TRIAL_DAYS } from "@/lib/domain/plans";
import { localizeAgents } from "@/lib/i18n/content/agents";
import { localizedAreas } from "@/lib/i18n/content/areas";
import { getI18n } from "@/lib/i18n/server";

const PILLAR_ICONS = [BookOpenText, MessagesSquare, Sparkles];

export default async function LandingPage() {
  const { locale, t } = await getI18n();
  const l = t.landing;
  const carousel = localizeAgents(carouselAgents(), locale);
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">{l.eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl leading-[1.05] text-ink sm:text-7xl">
          {l.title} <span className="gold-text italic">{l.titleHighlight}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{l.subtitle}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/cadastro"
            className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold"
          >
            {l.ctaTrial(TRIAL_DAYS)} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#lista-de-espera"
            className="btn-ghost inline-flex items-center justify-center rounded-full px-7 py-3.5 text-ink"
          >
            {l.ctaWaitlist}
          </Link>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {l.pillars.map(({ title, text }, i) => {
            const Icon = PILLAR_ICONS[i] ?? Sparkles;
            return (
              <div key={title} className="glass rounded-3xl p-6">
                <Icon className="h-6 w-6 text-gold" aria-hidden />
                <h2 className="mt-4 font-serif text-xl text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Carrossel */}
      <section id="mentes" className="scroll-mt-20 border-y border-line bg-graphite/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-4xl text-ink">{l.capsulesTitle}</h2>
              <p className="mt-2 max-w-xl text-muted">{l.capsulesText(AGENTS.length)}</p>
            </div>
          </div>
          <MindCarousel label={l.carouselLabel}>
            {carousel.map((agent) => (
              <MindCard key={agent.slug} agent={agent} className="w-[82%] shrink-0 snap-start sm:w-[320px]" />
            ))}
          </MindCarousel>
        </div>
      </section>

      {/* Maestro */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="glass flex flex-col items-start gap-6 rounded-[2rem] p-8 sm:flex-row sm:items-center sm:p-10">
          <MindAvatar agent={MAESTRO} size="xl" />
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gold">{l.maestroEyebrow}</p>
            <h2 className="mt-2 font-serif text-4xl text-ink">{l.maestroTitle}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{l.maestroText}</p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-20 mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-4xl text-ink">{l.howTitle}</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {l.steps.map((step, i) => (
            <li key={step.title} className="glass rounded-3xl p-6">
              <span className="font-serif text-3xl text-gold">{i + 1}</span>
              <h3 className="mt-2 font-serif text-xl text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Áreas */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-4xl text-ink">{l.areasTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {localizedAreas(locale).map((area) => (
            <AreaCard key={area.slug} area={area} count={agentsForArea(area.slug).length} />
          ))}
        </div>
      </section>

      {/* Planos */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="font-serif text-4xl text-ink">{l.plansTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-3xl p-7">
            <h3 className="font-serif text-2xl text-ink">{l.trialTitle}</h3>
            <p className="mt-1 text-muted">{l.trialSubtitle(TRIAL_DAYS)}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {l.trialItems(FREE_DAILY_MESSAGES).map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-3xl border-line-strong p-7">
            <h3 className="font-serif text-2xl text-gold">{l.premiumTitle}</h3>
            <p className="mt-1 text-muted">{l.premiumSubtitle}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {l.premiumItems.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="scroll-mt-20 mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <h2 className="font-serif text-4xl text-ink">{l.aboutTitle}</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">{l.aboutText}</p>
        <p className="mt-4 leading-relaxed text-muted">
          {l.aboutFutureBefore} <span className="text-gold">{l.aboutFutureHighlight}</span> {l.aboutFutureAfter}
        </p>
      </section>

      {/* Lista de espera */}
      <section id="lista-de-espera" className="scroll-mt-20 border-t border-line bg-graphite/40 py-20">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-4xl text-ink">{l.waitlistTitle}</h2>
          <p className="mt-3 text-muted">{l.waitlistText}</p>
          <div className="mt-8 text-left">
            <WaitlistForm />
          </div>
        </div>
      </section>
    </>
  );
}
