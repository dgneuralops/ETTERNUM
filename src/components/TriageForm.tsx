"use client";

import { useActionState, useEffect, useState } from "react";
import { saveTriage } from "@/app/actions/account";
import type { FormState } from "@/lib/domain/forms";
import { useI18n } from "@/lib/i18n/client";
import { localizedAreas } from "@/lib/i18n/content/areas";
import type { Messages } from "@/lib/i18n/messages";
import { AreaIcon } from "./AreaIcon";
import { FieldError, Label, SubmitButton, submitWithoutReset } from "./Forms";

type QuestionKey = keyof Messages["triage"]["questions"];
type StepKey = keyof Messages["triage"]["steps"];

const STEPS: { key: StepKey; questions: { name: QuestionKey; required?: boolean }[] }[] = [
  {
    key: "routine",
    questions: [
      { name: "occupation", required: true },
      { name: "likesToDo", required: true },
      { name: "dislikesToDo" },
    ],
  },
  {
    key: "weight",
    questions: [{ name: "difficulties", required: true }, { name: "dailyStressors" }, { name: "biggestDrain" }],
  },
  { key: "food", questions: [{ name: "likesToEat" }, { name: "dislikesToEat" }] },
  { key: "path", questions: [{ name: "goals" }] },
];

const FIELD_STEP: Record<string, number> = Object.fromEntries(
  STEPS.flatMap((s, i) => s.questions.map((q) => [q.name, i])),
);

export function TriageForm({ initial }: { initial: Record<string, string> }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveTriage, {});
  const { locale, t } = useI18n();
  const tr = t.triage;
  const values = state.values ?? initial;
  const [step, setStep] = useState(0);
  const [areas, setAreas] = useState<string[]>(() => (values.interestAreas ? values.interestAreas.split(",") : []));
  const last = step === STEPS.length - 1;

  // Ao voltar com erro, abre a primeira etapa que tem problema.
  useEffect(() => {
    const firstError = Object.keys(state.fieldErrors ?? {})
      .map((field) => FIELD_STEP[field] ?? STEPS.length - 1)
      .sort((a, b) => a - b)[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza a etapa com o resultado do servidor
    if (firstError !== undefined) setStep(firstError);
  }, [state.fieldErrors]);

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="glass rounded-3xl p-6 sm:p-8" noValidate>
      <ol className="mb-8 flex gap-2" aria-label={tr.stepsLabel}>
        {STEPS.map((s, i) => (
          <li key={s.key} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`h-1.5 w-full rounded-full ${i <= step ? "bg-gold" : "bg-white/10"}`}
              aria-label={tr.stepAria(i + 1, tr.steps[s.key])}
              aria-current={i === step ? "step" : undefined}
            />
          </li>
        ))}
      </ol>

      {STEPS.map((s, i) => (
        <fieldset key={s.key} hidden={i !== step} className="space-y-6">
          <legend className="mb-2 font-serif text-2xl text-gold">{tr.steps[s.key]}</legend>
          {s.questions.map((q) => {
            const text: { label: string; placeholder: string; hint?: string } = tr.questions[q.name];
            return (
              <div key={q.name}>
                <Label htmlFor={q.name} hint={text.hint}>
                  {text.label} {!q.required && <span className="text-faint">({t.common.optional})</span>}
                </Label>
                <textarea
                  id={q.name}
                  name={q.name}
                  rows={3}
                  defaultValue={values[q.name]}
                  placeholder={text.placeholder}
                  className="field w-full resize-y rounded-xl px-4 py-3 leading-relaxed placeholder:text-faint"
                />
                <FieldError errors={state.fieldErrors?.[q.name]} />
              </div>
            );
          })}
          {i === STEPS.length - 1 && (
            <div>
              <p className="mb-3 text-sm font-medium text-ink">
                {tr.interestQuestion} <span className="text-faint">({t.common.optional})</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {localizedAreas(locale).map((area) => {
                  const checked = areas.includes(area.slug);
                  return (
                    <label
                      key={area.slug}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                        checked ? "border-line-strong bg-gold/10 text-ink" : "border-line text-muted hover:text-ink"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="interestAreas"
                        value={area.slug}
                        checked={checked}
                        onChange={() =>
                          setAreas((prev) => (checked ? prev.filter((a) => a !== area.slug) : [...prev, area.slug]))
                        }
                        className="sr-only"
                      />
                      <span style={{ color: area.color }}>
                        <AreaIcon name={area.icon} className="h-4 w-4" />
                      </span>
                      {area.name}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </fieldset>
      ))}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost rounded-full px-6 py-3 text-ink">
            {t.common.back}
          </button>
        ) : (
          <span />
        )}
        {last ? (
          <div className="sm:w-64">
            <SubmitButton pending={pending} pendingText={tr.pending}>
              {tr.finish}
            </SubmitButton>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="btn-gold rounded-full px-8 py-3 font-semibold"
          >
            {tr.continue}
          </button>
        )}
      </div>
    </form>
  );
}
