"use client";

import { Star } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toggleFavorite } from "@/app/actions/account";
import { useI18n } from "@/lib/i18n/client";

export function FavoriteButton({ agentSlug, initial }: { agentSlug: string; initial: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [favorite, setFavorite] = useOptimistic(initial);
  const { t } = useI18n();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          setFavorite(!favorite);
          await toggleFavorite(agentSlug);
        })
      }
      className="rounded-full p-2 text-muted transition hover:bg-white/5 hover:text-gold"
      aria-pressed={favorite}
      aria-label={favorite ? t.common.removeFromBoard : t.common.addToBoard}
      title={favorite ? t.common.onBoard : t.common.addToBoard}
    >
      <Star className={`h-5 w-5 ${favorite ? "fill-gold text-gold" : ""}`} />
    </button>
  );
}
