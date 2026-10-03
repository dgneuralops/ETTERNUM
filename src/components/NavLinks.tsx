"use client";

import { Compass, CreditCard, Home, Infinity as InfinityIcon, MessageSquareText, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/inicio", label: "Início", icon: Home },
  { href: "/maestro", label: "Maestro", icon: InfinityIcon },
  { href: "/areas", label: "Áreas da vida", icon: Compass, match: ["/areas", "/area/", "/conselho/"] },
  { href: "/mentes", label: "Todas as mentes", icon: Users, match: ["/mentes", "/mente/"] },
  { href: "/conversas", label: "Minhas conversas", icon: MessageSquareText },
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/plano", label: "Plano", icon: CreditCard },
];

const MOBILE = ["/inicio", "/maestro", "/areas", "/conversas", "/perfil"];

function isActive(pathname: string, link: (typeof LINKS)[number]) {
  const prefixes = link.match ?? [link.href];
  return prefixes.some((p) => pathname === p || pathname.startsWith(p.endsWith("/") ? p : `${p}/`));
}

export function SideNav() {
  const pathname = usePathname();
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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  const pathname = usePathname();
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
              {link.label === "Áreas da vida" ? "Áreas" : link.label === "Minhas conversas" ? "Conversas" : link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
