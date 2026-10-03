import { LifeBuoy } from "lucide-react";
import { HELP_RESOURCES } from "@/lib/domain/safety";

export function CrisisBanner() {
  return (
    <aside className="rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm" role="note">
      <p className="flex items-center gap-2 font-semibold text-ink">
        <LifeBuoy className="h-4 w-4 text-danger" /> Você não está sozinho(a). Se precisar de ajuda agora:
      </p>
      <ul className="mt-2 grid gap-1 text-muted sm:grid-cols-2">
        {HELP_RESOURCES.map((r) => (
          <li key={r.name}>
            <span className="font-semibold text-ink">{r.contact}</span> — {r.name}. {r.detail}
          </li>
        ))}
      </ul>
    </aside>
  );
}
