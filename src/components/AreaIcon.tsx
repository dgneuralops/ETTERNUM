import {
  BookOpen,
  Brain,
  Briefcase,
  Heart,
  Infinity as InfinityIcon,
  Landmark,
  Leaf,
  Moon,
  ScrollText,
  Sparkles,
} from "lucide-react";
import type { AreaIcon as AreaIconName } from "@/lib/domain/areas";

const ICONS = {
  Brain,
  Infinity: InfinityIcon,
  Heart,
  Briefcase,
  Landmark,
  Sparkles,
  BookOpen,
  ScrollText,
  Moon,
  Leaf,
} satisfies Record<AreaIconName, unknown>;

export function AreaIcon({ name, className = "h-5 w-5" }: { name: AreaIconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
