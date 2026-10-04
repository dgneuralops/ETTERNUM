"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n/client";

/** Carrossel horizontal com rolagem por arrasto/toque e setas no desktop. */
export function MindCarousel({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div role="region" aria-label={label}>
      <div className="mb-3 hidden justify-end gap-2 sm:flex">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="btn-ghost rounded-full p-2 text-muted hover:text-gold"
          aria-label={t.common.previous}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="btn-ghost rounded-full p-2 text-muted hover:text-gold"
          aria-label={t.common.next}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {children}
      </div>
    </div>
  );
}
