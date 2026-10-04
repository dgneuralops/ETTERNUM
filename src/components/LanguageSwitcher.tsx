"use client";

import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/locale";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";

/** Seletor de idioma: guarda a escolha num cookie (e na conta, se houver login) e recarrega a página. */
export function LanguageSwitcher({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const select = (
    <select
      value={locale}
      disabled={pending}
      aria-label={t.common.language}
      onChange={(event) => {
        const next = event.target.value;
        startTransition(async () => {
          await setLocale(next);
          router.refresh();
        });
      }}
      className={
        variant === "full"
          ? "w-full rounded-xl border border-line bg-white/5 px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none sm:w-64"
          : "cursor-pointer appearance-none bg-transparent pr-1 text-sm text-muted hover:text-ink focus:outline-none disabled:opacity-60"
      }
    >
      {LOCALES.map((code) => (
        <option key={code} value={code} className="bg-graphite text-ink">
          {LOCALE_LABELS[code]}
        </option>
      ))}
    </select>
  );

  if (variant === "full") return select;
  return (
    <label className="inline-flex items-center gap-1.5 rounded-full px-2 py-2 text-muted hover:text-ink">
      <Globe className="h-4 w-4 shrink-0" aria-hidden />
      {select}
    </label>
  );
}
