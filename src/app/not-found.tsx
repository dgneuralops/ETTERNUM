import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getI18n();
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-6 px-4 sm:px-6">
      <Logo />
      <h1 className="font-serif text-4xl text-ink">{t.notFound.title}</h1>
      <p className="text-muted">{t.notFound.text}</p>
      <Link href="/" className="btn-gold rounded-full px-6 py-3 font-semibold">
        {t.notFound.home}
      </Link>
    </div>
  );
}
