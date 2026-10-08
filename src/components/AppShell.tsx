import Link from "next/link";
import { logout } from "@/app/actions/auth";
import type { EffectivePlan } from "@/lib/domain/plans";
import { getI18n } from "@/lib/i18n/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { BottomNav, SideNav } from "./NavLinks";

export async function AppShell({
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
  const { t } = await getI18n();
  const firstName = userName.split(" ")[0];
  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-graphite/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <Logo href="/inicio" className="px-2" />
        <SideNav />
        <form action={logout} className="mt-auto px-2">
          <button type="submit" className="text-sm text-faint hover:text-ink">
            {t.common.logout}
          </button>
        </form>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="lg:hidden">
            <Logo href="/inicio" />
          </div>
          <p className="hidden text-sm text-muted lg:block">{t.app.hello(firstName)}</p>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <Link
              href="/plano"
              className="whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-line-strong"
              title={t.app.seePlan}
            >
              {t.plans.labels[plan]}
              {plan === "trial" && ` · ${t.app.trialDays(trialDaysLeft)}`}
            </Link>
            {plan !== "premium" && (
              <Link
                href="/plano"
                className="btn-gold hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold sm:inline-block"
              >
                {t.app.upgrade}
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
