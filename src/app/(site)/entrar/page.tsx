import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.login };
}

export default async function LoginPage({ searchParams }: PageProps<"/entrar">) {
  const { t } = await getI18n();
  const { voltar } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl text-ink">{t.auth.loginTitle}</h1>
      <p className="mt-2 text-muted">{t.auth.loginSubtitle}</p>
      <div className="mt-8">
        <LoginForm next={typeof voltar === "string" ? voltar : undefined} />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {t.auth.noAccount}{" "}
        <Link href="/cadastro" className="text-gold hover:underline">
          {t.auth.signupLink}
        </Link>
      </p>
    </div>
  );
}
