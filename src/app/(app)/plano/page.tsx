import type { Metadata } from "next";
import { chooseFreeCapsule } from "@/app/actions/account";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { messagesToday } from "@/lib/chat/service";
import { AGENTS, getAgent } from "@/lib/domain/agents";
import { FREE_DAILY_MESSAGES, TRIAL_DAYS, planState } from "@/lib/domain/plans";
import { localizeAgent, localizeAgents } from "@/lib/i18n/content/agents";
import { formatLongDate } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.plan };
}

export default async function PlanPage() {
  const { user } = await requireUser();
  const { locale, t } = await getI18n();
  const p = t.planPage;
  const plan = planState(user);
  const usedToday = await messagesToday(user.id, user.timeZone);
  const freeAgent = plan.freeCapsuleSlug ? getAgent(plan.freeCapsuleSlug) : undefined;
  const freeCapsule = freeAgent ? localizeAgent(freeAgent, locale) : undefined;
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL;
  const canChoose = !(plan.plan === "free" && freeCapsule);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-ink">{p.title}</h1>

      <section className="glass rounded-3xl p-6">
        <p className="text-xs uppercase tracking-wider text-gold">{p.current}</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">{t.plans.labels[plan.plan]}</h2>
        {plan.plan === "trial" && (
          <p className="mt-2 text-muted">
            {p.trialText(formatLongDate(plan.trialEndsAt, locale, user.timeZone), plan.trialDaysLeft, TRIAL_DAYS)}
          </p>
        )}
        {plan.plan === "free" && (
          <p className="mt-2 text-muted">
            {p.freeUsage(Math.min(usedToday, FREE_DAILY_MESSAGES), FREE_DAILY_MESSAGES)}{" "}
            {freeCapsule ? p.freeCapsule(freeCapsule.name) : p.freeChoose} {p.maestroAlways}
          </p>
        )}
        {plan.plan === "premium" && <p className="mt-2 text-muted">{p.premiumText}</p>}
      </section>

      {plan.plan !== "premium" && (
        <section className="glass rounded-3xl border-line-strong p-6">
          <h2 className="font-serif text-3xl text-gold">{p.premiumTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {p.benefits(AGENTS.length).map((item) => (
              <li key={item}>✓ {item}</li>
            ))}
          </ul>
          {checkoutUrl ? (
            <a href={checkoutUrl} className="btn-gold mt-6 inline-block rounded-full px-6 py-3 font-semibold">
              {p.subscribe}
            </a>
          ) : (
            <p className="mt-6 text-sm text-faint">{p.checkoutSoon}</p>
          )}
        </section>
      )}

      {plan.plan !== "premium" && (
        <section>
          <h2 className="font-serif text-2xl text-ink">{p.freeCapsuleTitle}</h2>
          <p className="mt-1 text-sm text-muted">
            {p.freeCapsuleText(FREE_DAILY_MESSAGES)} {canChoose ? p.canChoose : p.chosenDone}
          </p>
          {canChoose && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {localizeAgents(AGENTS, locale).map((a) => {
                const chosen = a.slug === plan.freeCapsuleSlug;
                return (
                  <form key={a.slug} action={chooseFreeCapsule.bind(null, a.slug)}>
                    <button
                      type="submit"
                      className={`flex w-full items-center gap-3 rounded-2xl border p-2 pr-4 text-left text-sm transition ${
                        chosen ? "border-line-strong bg-gold/10 text-gold" : "border-line text-muted hover:text-ink"
                      }`}
                      aria-pressed={chosen}
                    >
                      <MindAvatar agent={a} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-ink">{a.name}</span>
                        <span className="block truncate text-xs">{chosen ? p.chosen : a.focus}</span>
                      </span>
                    </button>
                  </form>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
