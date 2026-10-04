import type { Metadata } from "next";
import { FREE_DAILY_MESSAGES, TRIAL_DAYS } from "@/lib/domain/plans";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.terms };
}

export default async function TermsPage() {
  const { t } = await getI18n();
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-4 py-14 leading-relaxed text-muted sm:px-6">
      <p className="rounded-xl border border-line-strong p-3 text-sm text-gold">{t.legal.draft}</p>
      <h1 className="font-serif text-4xl text-ink">{t.legal.terms.title}</h1>
      {t.legal.terms.sections(TRIAL_DAYS, FREE_DAILY_MESSAGES).map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-serif text-2xl text-ink">{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </article>
  );
}
