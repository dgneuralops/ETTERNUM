import type { Metadata } from "next";
import { AreaCard } from "@/components/AreaCard";
import { agentsForArea } from "@/lib/domain/agents";
import { AREAS } from "@/lib/domain/areas";

export const metadata: Metadata = { title: "Áreas da vida" };

export default function AreasPage() {
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Áreas da vida</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Escolha a área do que você está vivendo. Em cada uma, você pode conversar com uma mente, abrir o Conselho ou
        pedir ao Maestro que escolha por você.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map((area) => (
          <AreaCard key={area.slug} area={area} count={agentsForArea(area.slug).length} />
        ))}
      </div>
    </div>
  );
}
