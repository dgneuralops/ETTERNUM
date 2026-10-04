import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";
import { TRIAL_DAYS } from "@/lib/domain/plans";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.meta.signup };
}

export default async function SignupPage() {
  const { t } = await getI18n();
  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl text-ink">{t.auth.signupTitle}</h1>
      <p className="mt-2 text-muted">{t.auth.signupSubtitle(TRIAL_DAYS)}</p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {t.auth.haveAccount}{" "}
        <Link href="/entrar" className="text-gold hover:underline">
          {t.auth.loginLink}
        </Link>
      </p>
    </div>
  );
}
