"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions/account";
import type { FormState } from "@/lib/domain/forms";
import { useI18n } from "@/lib/i18n/client";
import { FieldError, SubmitButton } from "./Forms";

export function WaitlistForm() {
  const [state, action] = useActionState<FormState, FormData>(joinWaitlist, {});
  const { t } = useI18n();
  const w = t.waitlist;
  if (state.ok) {
    return <p className="glass rounded-2xl p-5 text-center text-gold">{state.message}</p>;
  }
  return (
    <form action={action} className="glass space-y-4 rounded-3xl p-6" noValidate>
      <div>
        <label htmlFor="wl-name" className="sr-only">
          {w.name}
        </label>
        <input
          id="wl-name"
          name="name"
          placeholder={w.namePlaceholder}
          defaultValue={state.values?.name}
          autoComplete="name"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>
      <div>
        <label htmlFor="wl-email" className="sr-only">
          {w.email}
        </label>
        <input
          id="wl-email"
          name="email"
          type="email"
          placeholder={w.emailPlaceholder}
          defaultValue={state.values?.email}
          autoComplete="email"
          className="field w-full rounded-xl px-4 py-3"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <SubmitButton pendingText={w.pending}>{w.submit}</SubmitButton>
    </form>
  );
}
