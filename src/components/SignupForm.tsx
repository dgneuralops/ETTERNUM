"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import { formatCpf } from "@/lib/domain/cpf";
import type { FormState } from "@/lib/domain/forms";
import { ZODIAC_SIGNS, zodiacFromBirthDate } from "@/lib/domain/zodiac";
import { FieldError, Label, SubmitButton } from "./Forms";

export function SignupForm() {
  const [state, action] = useActionState<FormState, FormData>(signup, {});
  const v = state.values ?? {};
  const [cpf, setCpf] = useState(v.cpf ?? "");
  const [sign, setSign] = useState(v.zodiacSign ?? "");
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="glass space-y-5 rounded-3xl p-6 sm:p-8" noValidate>
      <div>
        <Label htmlFor="name">Nome</Label>
        <input
          id="name"
          name="name"
          defaultValue={v.name}
          autoComplete="name"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={e.name} />
      </div>
      <div>
        <Label htmlFor="email">E-mail</Label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={v.email}
          autoComplete="email"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={e.email} />
      </div>
      <div>
        <Label htmlFor="password" hint="Pelo menos 8 caracteres.">
          Senha
        </Label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={e.password} />
      </div>
      <div>
        <Label htmlFor="cpf">CPF</Label>
        <input
          id="cpf"
          name="cpf"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(ev) => setCpf(formatCpf(ev.target.value))}
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={e.cpf} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={v.birthDate}
            onChange={(ev) => {
              const auto = zodiacFromBirthDate(ev.target.value);
              if (auto) setSign(auto);
            }}
            className="field w-full rounded-xl px-4 py-3 [color-scheme:dark]"
          />
          <FieldError errors={e.birthDate} />
        </div>
        <div>
          <Label htmlFor="zodiacSign">Signo</Label>
          <select
            id="zodiacSign"
            name="zodiacSign"
            value={sign}
            onChange={(ev) => setSign(ev.target.value)}
            className="field w-full rounded-xl px-4 py-3"
          >
            <option value="">Escolha…</option>
            {ZODIAC_SIGNS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.symbol} {s.name}
              </option>
            ))}
          </select>
          <FieldError errors={e.zodiacSign} />
        </div>
      </div>
      <p className="-mt-2 text-xs text-faint">O signo é preenchido pela data de nascimento; ajuste se preferir.</p>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[#e0c78e]" />
          <span>
            Tenho 18 anos ou mais, li e aceito os{" "}
            <Link href="/termos" target="_blank" className="text-gold hover:underline">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link href="/privacidade" target="_blank" className="text-gold hover:underline">
              Política de Privacidade
            </Link>
            , e autorizo o tratamento dos meus dados — inclusive informações sobre meu bem-estar emocional — para
            personalizar minhas conversas.
          </span>
        </label>
        <FieldError errors={e.consent} />
      </div>

      {state.message && <p className="text-sm text-danger">{state.message}</p>}
      <SubmitButton pendingText="Criando sua conta…">Criar conta e começar a triagem</SubmitButton>
    </form>
  );
}
