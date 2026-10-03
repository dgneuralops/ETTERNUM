import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ voltar?: string }> }) {
  const { voltar } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl text-ink">Bem-vindo de volta</h1>
      <p className="mt-2 text-muted">Suas mentes e o Maestro estão esperando por você.</p>
      <div className="mt-8">
        <LoginForm next={voltar} />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-gold hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  );
}
