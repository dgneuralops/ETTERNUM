import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";
import { TRIAL_DAYS } from "@/lib/domain/plans";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <h1 className="font-serif text-4xl text-ink">Crie sua conta</h1>
      <p className="mt-2 text-muted">
        {TRIAL_DAYS} dias grátis com acesso a todas as mentes. Depois, você continua no plano gratuito ou assina o
        Premium.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-gold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
