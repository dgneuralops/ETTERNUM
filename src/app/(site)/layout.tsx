import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <Link href="/#mentes" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink sm:inline">
              Mentes
            </Link>
            <Link href="/#como-funciona" className="hidden rounded-full px-3 py-2 text-muted hover:text-ink md:inline">
              Como funciona
            </Link>
            <Link href="/entrar" className="rounded-full px-3 py-2 text-muted hover:text-ink">
              Entrar
            </Link>
            <Link href="/cadastro" className="btn-gold rounded-full px-4 py-2 font-semibold">
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/#sobre" className="hover:text-gold">
              Sobre o Etternum
            </Link>
            <Link href="/termos" className="hover:text-gold">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-gold">
              Política de Privacidade
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} Etternum. Todos os direitos reservados.</p>
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-relaxed text-faint sm:px-6">
          O Etternum não substitui psicólogos, médicos ou outros profissionais. As cápsulas são recriações feitas por
          inteligência artificial a partir de ideias públicas e não representam as pessoas reais. Em crise, ligue 188
          (CVV, 24 horas, gratuito).
        </p>
      </footer>
    </div>
  );
}
