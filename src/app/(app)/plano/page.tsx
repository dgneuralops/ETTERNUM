import type { Metadata } from "next";
import { chooseFreeCapsule } from "@/app/actions/account";
import { MindAvatar } from "@/components/MindAvatar";
import { requireUser } from "@/lib/auth/session";
import { messagesToday } from "@/lib/chat/service";
import { AGENTS, getAgent } from "@/lib/domain/agents";
import { FREE_DAILY_MESSAGES, PLAN_LABELS, TRIAL_DAYS, planState } from "@/lib/domain/plans";

export const metadata: Metadata = { title: "Plano" };

const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", timeZone: "America/Sao_Paulo" });

export default async function PlanPage() {
  const { user } = await requireUser();
  const plan = planState(user);
  const usedToday = await messagesToday(user.id);
  const freeCapsule = plan.freeCapsuleSlug ? getAgent(plan.freeCapsuleSlug) : undefined;
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL;
  const canChoose = !(plan.plan === "free" && freeCapsule);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl text-ink">Seu plano</h1>

      <section className="glass rounded-3xl p-6">
        <p className="text-xs uppercase tracking-wider text-gold">Plano atual</p>
        <h2 className="mt-1 font-serif text-3xl text-ink">{PLAN_LABELS[plan.plan]}</h2>
        {plan.plan === "trial" && (
          <p className="mt-2 text-muted">
            Seu teste de {TRIAL_DAYS} dias termina em {dateFormat.format(plan.trialEndsAt)} ({plan.trialDaysLeft}{" "}
            {plan.trialDaysLeft === 1 ? "dia restante" : "dias restantes"}). Até lá, tudo está liberado.
          </p>
        )}
        {plan.plan === "free" && (
          <p className="mt-2 text-muted">
            Você usou {Math.min(usedToday, FREE_DAILY_MESSAGES)} de {FREE_DAILY_MESSAGES} mensagens hoje.{" "}
            {freeCapsule
              ? `Sua cápsula do plano gratuito é ${freeCapsule.name}.`
              : "Escolha abaixo a cápsula do seu plano gratuito (ou ela será a primeira com quem você conversar)."}{" "}
            O Maestro está sempre disponível.
          </p>
        )}
        {plan.plan === "premium" && <p className="mt-2 text-muted">Acesso ilimitado a todas as mentes. Obrigado!</p>}
      </section>

      {plan.plan !== "premium" && (
        <section className="glass rounded-3xl border-line-strong p-6">
          <h2 className="font-serif text-3xl text-gold">Premium</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>✓ Todas as {AGENTS.length} mentes, sem limite diário</li>
            <li>✓ Conselho com várias mentes ao mesmo tempo</li>
            <li>✓ Memória completa e histórico ilimitado</li>
            <li>✓ Acesso antecipado à Cápsula de Memória Viva</li>
          </ul>
          {checkoutUrl ? (
            <a href={checkoutUrl} className="btn-gold mt-6 inline-block rounded-full px-6 py-3 font-semibold">
              Assinar o Premium
            </a>
          ) : (
            <p className="mt-6 text-sm text-faint">
              O checkout do Premium será conectado em breve (configure NEXT_PUBLIC_CHECKOUT_URL).
            </p>
          )}
        </section>
      )}

      {plan.plan !== "premium" && (
        <section>
          <h2 className="font-serif text-2xl text-ink">Cápsula do plano gratuito</h2>
          <p className="mt-1 text-sm text-muted">
            Depois do teste, o plano gratuito inclui uma cápsula e {FREE_DAILY_MESSAGES} mensagens por dia.
            {canChoose ? " Você pode escolher agora:" : " Sua escolha está feita."}
          </p>
          {canChoose && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {AGENTS.map((a) => {
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
                        <span className="block truncate text-xs">{chosen ? "Escolhida" : a.focus}</span>
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
