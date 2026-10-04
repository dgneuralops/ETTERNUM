"use client";

import { startTransition } from "react";
import { useFormStatus } from "react-dom";
import { useI18n } from "@/lib/i18n/client";

/**
 * Envia o formulário pela action sem o reset automático do React 19, que limparia
 * campos controlados (signo, CPF, áreas marcadas) quando o servidor devolve erros.
 * Use junto com o `pending` de `useActionState` no SubmitButton.
 */
export function submitWithoutReset(dispatch: (data: FormData) => void) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };
}

export function SubmitButton({
  children,
  pendingText,
  pending: pendingProp,
}: {
  children: React.ReactNode;
  pendingText?: string;
  /** Estado de envio vindo de `useActionState` (quando o envio é feito por `submitWithoutReset`). */
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  const { t } = useI18n();
  return (
    <button type="submit" disabled={pending} className="btn-gold w-full rounded-full px-6 py-3 font-semibold">
      {pending ? (pendingText ?? t.common.sending) : children}
    </button>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1.5 text-sm text-danger">{errors[0]}</p>;
}

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: React.ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
      {children}
      {hint && <span className="mt-0.5 block text-xs font-normal text-faint">{hint}</span>}
    </label>
  );
}
