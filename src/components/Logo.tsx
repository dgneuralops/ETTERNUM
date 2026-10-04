import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden>
      <path
        d="M6 16c0-5 3.6-8.5 8-8.5 6.5 0 13.5 17 20 17 4.4 0 8-3.5 8-8.5s-3.6-8.5-8-8.5c-6.5 0-13.5 17-20 17-4.4 0-8-3.5-8-8.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export async function Logo({ href = "/", className = "" }: { href?: string; className?: string }) {
  const { t } = await getI18n();
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-gold ${className}`}
      aria-label={t.common.logoLabel}
    >
      <LogoMark />
      <span className="font-serif text-2xl font-semibold tracking-wide text-ink">Etternum</span>
    </Link>
  );
}
