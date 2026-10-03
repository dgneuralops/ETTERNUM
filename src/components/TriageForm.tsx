"use client";

import { useActionState, useEffect, useState } from "react";
import { saveTriage } from "@/app/actions/account";
import { AREAS } from "@/lib/domain/areas";
import type { FormState } from "@/lib/domain/forms";
import { AreaIcon } from "./AreaIcon";
import { FieldError, Label, SubmitButton } from "./Forms";

type Question = { name: string; label: string; hint?: string; placeholder: string; required?: boolean };

const STEPS: { title: string; questions: Question[] }[] = [
  {
    title: "Sua rotina",
    questions: [
      {
        name: "occupation",
        label: "Com o que você trabalha?",
        hint: "Se estiver estudando, procurando trabalho ou cuidando da casa, conte também.",
        placeholder: "Ex.: sou enfermeira num hospital público e faço plantões noturnos",
        required: true,
      },
      {
        name: "likesToDo",
        label: "O que você gosta de fazer?",
        placeholder: "Ex.: cozinhar, correr, ler, estar com amigos",
        required: true,
      },
      {
        name: "dislikesToDo",
        label: "E o que você não gosta de fazer?",
        placeholder: "Ex.: reuniões longas, lidar com burocracia",
      },
    ],
  },
  {
    title: "O que pesa",
    questions: [
      {
        name: "difficulties",
        label: "Quais são as suas maiores dificuldades hoje?",
        placeholder: "Ex.: me sinto sozinho, não consigo dormir, meu negócio não decola",
        required: true,
      },
      {
        name: "dailyStressors",
        label: "O que mais deixa você estressado(a) num dia?",
        placeholder: "Ex.: trânsito, cobranças do chefe, as contas",
      },
      {
        name: "biggestDrain",
        label: "Qual é a maior causa do seu desgaste?",
        placeholder: "Ex.: cuidar de tudo sozinho, um relacionamento difícil",
      },
    ],
  },
  {
    title: "Sabores",
    questions: [
      {
        name: "likesToEat",
        label: "O que você gosta de comer?",
        placeholder: "Ex.: comida japonesa, feijoada, frutas",
      },
      { name: "dislikesToEat", label: "E o que você não gosta de comer?", placeholder: "Ex.: fígado, coentro" },
    ],
  },
  {
    title: "Seu caminho",
    questions: [
      {
        name: "goals",
        label: "O que você espera encontrar no Etternum?",
        placeholder: "Ex.: um lugar para desabafar, clareza para decidir sobre minha carreira",
      },
    ],
  },
];

const FIELD_STEP: Record<string, number> = Object.fromEntries(
  STEPS.flatMap((s, i) => s.questions.map((q) => [q.name, i])),
);

export function TriageForm({ initial }: { initial: Record<string, string> }) {
  const [state, action] = useActionState<FormState, FormData>(saveTriage, {});
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
    <form action={action} className="glass rounded-3xl p-6 sm:p-8" noValidate>
      <ol className="mb-8 flex gap-2" aria-label="Etapas">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`h-1.5 w-full rounded-full ${i <= step ? "bg-gold" : "bg-white/10"}`}
              aria-label={`Etapa ${i + 1}: ${s.title}`}
              aria-current={i === step ? "step" : undefined}
            />
          </li>
        ))}
      </ol>

      {STEPS.map((s, i) => (
        <fieldset key={s.title} hidden={i !== step} className="space-y-6">
          <legend className="mb-2 font-serif text-2xl text-gold">{s.title}</legend>
          {s.questions.map((q) => (
            <div key={q.name}>
              <Label htmlFor={q.name} hint={q.hint}>
                {q.label} {!q.required && <span className="text-faint">(opcional)</span>}
              </Label>
              <textarea
                id={q.name}
                name={q.name}
                rows={3}
                defaultValue={values[q.name]}
                placeholder={q.placeholder}
                className="field w-full resize-y rounded-xl px-4 py-3 leading-relaxed placeholder:text-faint"
              />
              <FieldError errors={state.fieldErrors?.[q.name]} />
            </div>
          ))}
          {i === STEPS.length - 1 && (
            <div>
              <p className="mb-3 text-sm font-medium text-ink">
                Quais áreas da vida mais importam para você agora? <span className="text-faint">(opcional)</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {AREAS.map((area) => {
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
            Voltar
          </button>
        ) : (
          <span />
        )}
        {last ? (
          <div className="sm:w-64">
            <SubmitButton pendingText="Salvando…">Concluir triagem</SubmitButton>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="btn-gold rounded-full px-8 py-3 font-semibold"
          >
            Continuar
          </button>
        )}
      </div>
    </form>
  );
}
