import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.privacy };
}

export default async function PrivacyPage() {
  const { t } = await getI18n();
  const privacy = t.legal.privacy;
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-4 py-14 leading-relaxed text-muted sm:px-6">
      <p className="rounded-xl border border-line-strong p-3 text-sm text-gold">{t.legal.draft}</p>
      <h1 className="font-serif text-4xl text-ink">{privacy.title}</h1>
      <p>{privacy.intro}</p>
      {privacy.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="font-serif text-2xl text-ink">{section.heading}</h2>
          {"items" in section && section.items ? (
            <ul className="list-disc space-y-1 pl-6">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>{"body" in section ? section.body : null}</p>
          )}
        </section>
      ))}
    </article>
  );
}
