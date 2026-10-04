"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/app/actions/auth";
import { formatCpf } from "@/lib/domain/cpf";
import type { FormState } from "@/lib/domain/forms";
import { zodiacFromBirthDate } from "@/lib/domain/zodiac";
import { useI18n } from "@/lib/i18n/client";
import { localizedSigns } from "@/lib/i18n/content/zodiac";
import { FieldError, Label, SubmitButton, submitWithoutReset } from "./Forms";

/** Fuso horário do navegador (define o "dia" do limite diário e a saudação). */
function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

export function SignupForm() {
  const { locale, t } = useI18n();
  const a = t.auth;
  // O CPF é pedido só no Brasil (cadastro em português).
  const askCpf = locale === "pt-BR";
  const [state, action, pending] = useActionState<FormState, FormData>(signup, {});
  const v = state.values ?? {};
  const [cpf, setCpf] = useState(v.cpf ?? "");
  const [sign, setSign] = useState(v.zodiacSign ?? "");
  const e = state.fieldErrors ?? {};

  return (
    <form
      action={action}
      onSubmit={submitWithoutReset(action)}
      className="glass space-y-5 rounded-3xl p-6 sm:p-8"
      noValidate
    >
      <input type="hidden" name="timeZone" value={browserTimeZone()} suppressHydrationWarning />
      <div>
        <Label htmlFor="name">{a.name}</Label>
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
        <Label htmlFor="email">{a.email}</Label>
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
        <Label htmlFor="password" hint={a.passwordHint}>
          {a.password}
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
      {askCpf && (
        <div>
          <Label htmlFor="cpf">{a.cpf}</Label>
          <input
            id="cpf"
            name="cpf"
            inputMode="numeric"
            placeholder={a.cpfPlaceholder}
            value={cpf}
            onChange={(ev) => setCpf(formatCpf(ev.target.value))}
            className="field w-full rounded-xl px-4 py-3"
          />
          <FieldError errors={e.cpf} />
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="birthDate">{a.birthDate}</Label>
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
          <Label htmlFor="zodiacSign">{a.sign}</Label>
          <select
            id="zodiacSign"
            name="zodiacSign"
            value={sign}
            onChange={(ev) => setSign(ev.target.value)}
            className="field w-full rounded-xl px-4 py-3"
          >
            <option value="">{a.signPlaceholder}</option>
            {localizedSigns(locale).map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.symbol} {s.name}
              </option>
            ))}
          </select>
          <FieldError errors={e.zodiacSign} />
        </div>
      </div>
      <p className="-mt-2 text-xs text-faint">{a.signHint}</p>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[#e0c78e]" />
          <span>
            {a.consentBefore}{" "}
            <Link href="/termos" target="_blank" className="text-gold hover:underline">
              {a.consentTerms}
            </Link>{" "}
            {a.consentAnd}{" "}
            <Link href="/privacidade" target="_blank" className="text-gold hover:underline">
              {a.consentPrivacy}
            </Link>
            {a.consentAfter}
          </span>
        </label>
        <FieldError errors={e.consent} />
      </div>

      {state.message && <p className="text-sm text-danger">{state.message}</p>}
      <SubmitButton pending={pending} pendingText={a.signupPending}>
        {a.signupSubmit}
      </SubmitButton>
    </form>
  );
}
