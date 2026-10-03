import Link from "next/link";
import type { Area } from "@/lib/domain/areas";
import { AreaIcon } from "./AreaIcon";

export function AreaCard({ area, count }: { area: Area; count?: number }) {
  return (
    <Link
      href={`/area/${area.slug}`}
      className="glass group flex flex-col rounded-3xl p-5 transition hover:border-line-strong"
    >
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line"
        style={{ color: area.color, background: `${area.color}14` }}
      >
        <AreaIcon name={area.icon} />
      </span>
      <h3 className="mt-4 font-serif text-xl leading-tight text-ink group-hover:text-gold">{area.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{area.short}</p>
      {count !== undefined && <p className="mt-3 text-xs text-faint">{count} mentes</p>}
    </Link>
  );
}
