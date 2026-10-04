import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { getI18n } from "@/lib/i18n/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getI18n();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <Link href="/#mentes" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink md:inline">
              {t.site.nav.minds}
            </Link>
            <Link href="/#como-funciona" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink lg:inline">
              {t.site.nav.how}
            </Link>
            <LanguageSwitcher />
            <Link href="/entrar" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink sm:inline">
              {t.site.nav.login}
            </Link>
            <Link href="/cadastro" className="btn-gold whitespace-nowrap rounded-full px-4 py-2 font-semibold">
              {t.site.nav.start}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/#sobre" className="hover:text-gold">
              {t.site.footer.about}
            </Link>
            <Link href="/entrar" className="hover:text-gold sm:hidden">
              {t.site.nav.login}
            </Link>
            <Link href="/termos" className="hover:text-gold">
              {t.site.footer.terms}
            </Link>
            <Link href="/privacidade" className="hover:text-gold">
              {t.site.footer.privacy}
            </Link>
          </nav>
          <p>{t.site.footer.rights(new Date().getFullYear())}</p>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-relaxed text-faint sm:px-6">
          {t.site.footer.disclaimer} {t.crisis.footer}
        </p>
      </footer>
    </div>
  );
}
