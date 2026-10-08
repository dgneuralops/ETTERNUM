"use client";

import { LifeBuoy } from "lucide-react";
import { useI18n } from "@/lib/i18n/client";
import { HELP_RESOURCES } from "@/lib/i18n/content/crisis";

export function CrisisBanner() {
  const { locale, t } = useI18n();
  return (
    <aside className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm" role="note">
      <p className="flex items-center gap-2 font-semibold text-ink">
        <LifeBuoy className="h-4 w-4 shrink-0 text-danger" /> {t.crisis.heading}
      </p>
      <ul className="mt-2 grid gap-1 text-muted sm:grid-cols-2">
        {HELP_RESOURCES[locale].map((r) => (
          <li key={r.name}>
            <span className="font-semibold text-ink">{r.contact}</span> — {r.name}. {r.detail}
          </li>
        ))}
      </ul>
    </aside>
  );
}
