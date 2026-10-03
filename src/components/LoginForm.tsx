"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import type { FormState } from "@/lib/domain/forms";
import { FieldError, Label, SubmitButton } from "./Forms";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="glass space-y-5 rounded-3xl p-6 sm:p-8" noValidate>
      <input type="hidden" name="voltar" value={next ?? ""} />
      <div>
        <Label htmlFor="email">E-mail</Label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email}
          autoComplete="email"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      {state.message && <p className="text-sm text-danger">{state.message}</p>}
      <SubmitButton pendingText="Entrando…">Entrar</SubmitButton>
    </form>
  );
}
