import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { PLAN_LABELS, type EffectivePlan } from "@/lib/domain/plans";
import { Logo } from "./Logo";
import { BottomNav, SideNav } from "./NavLinks";

export function AppShell({
  userName,
  plan,
  trialDaysLeft,
  children,
}: {
  userName: string;
  plan: EffectivePlan;
  trialDaysLeft: number;
  children: React.ReactNode;
}) {
  const firstName = userName.split(" ")[0];
  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-graphite/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <Logo href="/inicio" className="px-2" />
        <SideNav />
        <form action={logout} className="mt-auto px-2">
          <button type="submit" className="text-sm text-faint hover:text-ink">
            Sair
          </button>
        </form>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="lg:hidden">
            <Logo href="/inicio" />
          </div>
          <p className="hidden text-sm text-muted lg:block">
            Olá, <span className="text-ink">{firstName}</span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/plano"
              className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-line-strong"
              title="Ver meu plano"
            >
              {PLAN_LABELS[plan]}
              {plan === "trial" && ` · ${trialDaysLeft} ${trialDaysLeft === 1 ? "dia" : "dias"}`}
            </Link>
            {plan !== "premium" && (
              <Link
                href="/plano"
                className="btn-gold hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold sm:inline-block"
              >
                Fazer upgrade
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">{children}</main>
      <BottomNav />
    </div>
  );
}
