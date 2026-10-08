"use client";

import { Compass, CreditCard, Home, Infinity as InfinityIcon, MessageSquareText, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";
import type { Messages } from "@/lib/i18n/messages";

type NavKey = keyof Messages["app"]["nav"];

const LINKS: { href: string; key: NavKey; short?: NavKey; icon: typeof Home; match?: string[] }[] = [
  { href: "/inicio", key: "home", icon: Home },
  { href: "/maestro", key: "maestro", icon: InfinityIcon },
  { href: "/areas", key: "areas", short: "areasShort", icon: Compass, match: ["/areas", "/area/", "/conselho/"] },
  { href: "/mentes", key: "minds", icon: Users, match: ["/mentes", "/mente/"] },
  { href: "/conversas", key: "conversations", short: "conversationsShort", icon: MessageSquareText },
  { href: "/perfil", key: "profile", icon: User },
  { href: "/plano", key: "plan", icon: CreditCard },
];

const MOBILE = ["/inicio", "/maestro", "/areas", "/conversas", "/perfil"];

function isActive(pathname: string, link: (typeof LINKS)[number]) {
  const prefixes = link.match ?? [link.href];
  return prefixes.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`));
}

export function SideNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <nav className="mt-10 flex flex-col gap-1">
      {LINKS.map((link) => {
        const active = isActive(pathname, link);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              active ? "bg-gold/10 text-gold" : "text-muted hover:bg-white/5 hover:text-ink"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t.app.nav[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {LINKS.filter((l) => MOBILE.includes(l.href)).map((link) => {
          const active = isActive(pathname, link);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${active ? "text-gold" : "text-muted"}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="max-w-full truncate px-1">{t.app.nav[link.short ?? link.key]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
