import type { Agent } from "@/lib/domain/agents";

function initials(name: string): string {
  const words = name
    .replace(/^(Sri|Santo|São)\s+/i, "")
    .split(/\s+/)
    .filter((w) => !/^(de|da|do|dos|das|von|van)$/i.test(w));
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const SIZES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-lg",
  lg: "h-20 w-20 text-3xl",
  xl: "h-28 w-28 text-5xl",
};

/**
 * Retrato em estilo sépia com monograma. Fotos de pessoas exigem licença de uso;
 * quando houver imagens licenciadas, este é o lugar para exibi-las.
 */
export function MindAvatar({ agent, size = "md" }: { agent: Pick<Agent, "name" | "slug">; size?: keyof typeof SIZES }) {
  const isMaestro = agent.slug === "maestro";
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong font-serif font-semibold ${SIZES[size]}`}
      style={{
        background: isMaestro
          ? "radial-gradient(circle at 30% 25%, #f3e2b6, #cfae64 45%, #5a4724)"
          : "radial-gradient(circle at 30% 25%, #6b5a40, #3a2f22 55%, #17130e)",
        color: isMaestro ? "#1a160d" : "#ead6a6",
      }}
      aria-hidden
    >
      <span className="relative z-10">{isMaestro ? "∞" : initials(agent.name)}</span>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.55),transparent_60%)]" />
    </span>
  );
}
