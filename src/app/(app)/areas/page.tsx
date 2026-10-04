import type { Metadata } from "next";
import { AreaCard } from "@/components/AreaCard";
import { agentsForArea } from "@/lib/domain/agents";
import { localizedAreas } from "@/lib/i18n/content/areas";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.areas };
}

export default async function AreasPage() {
  const { locale, t } = await getI18n();
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">{t.areasPage.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{t.areasPage.intro}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {localizedAreas(locale).map((area) => (
          <AreaCard key={area.slug} area={area} count={agentsForArea(area.slug).length} />
        ))}
      </div>
    </div>
  );
}
