import { z } from "zod";
import { isAreaSlug } from "./areas";
import { isValidCpf, onlyDigits } from "./cpf";
import { DEFAULT_TIME_ZONE, isValidTimeZone } from "./plans";
import { ageOn, isZodiacSlug, parseIsoDate } from "./zodiac";
import type { Messages } from "@/lib/i18n/messages";

export const MIN_AGE = 18;

/** Mensagens de validação no idioma da pessoa (`messages.validation` do dicionário). */
export type ValidationMessages = Messages["validation"];

const text = (v: ValidationMessages, max: number) => z.string().trim().max(max, v.maxLength(max));
const email = (v: ValidationMessages) => z.string().trim().toLowerCase().pipe(z.email(v.email));

/**
 * Cadastro. O CPF só é pedido no Brasil (cadastro em português); nos outros idiomas ele é ignorado.
 * O fuso horário vem do navegador e define o "dia" do limite diário.
 */
export function signupSchema(v: ValidationMessages, opts: { requireCpf: boolean }) {
  return z.object({
    name: z.string().trim().min(2, v.name).max(120),
    email: email(v),
    password: z.string().min(8, v.password).max(200),
    cpf: z
      .string()
      .optional()
      .transform((value) => (opts.requireCpf ? onlyDigits(value ?? "") : null))
      .refine((value) => value === null || isValidCpf(value), v.cpf),
    birthDate: z
      .string()
      .refine((value) => parseIsoDate(value) !== null, v.birthDate)
      .refine((value) => (ageOn(value) ?? 0) >= MIN_AGE, v.minAge(MIN_AGE))
      .refine((value) => (ageOn(value) ?? 200) < 120, v.birthDateRange),
    zodiacSign: z.string().refine(isZodiacSlug, v.sign),
    timeZone: z
      .string()
      .optional()
      .transform((value) => (isValidTimeZone(value) ? value : DEFAULT_TIME_ZONE)),
    consent: z.literal("on", { error: v.consent }),
  });
}

export function loginSchema(v: ValidationMessages) {
  return z.object({ email: email(v), password: z.string().min(1, v.passwordRequired) });
}

export function triageSchema(v: ValidationMessages) {
  return z.object({
    occupation: text(v, 500).min(1, v.occupation),
    likesToDo: text(v, 1000).min(1, v.likesToDo),
    dislikesToDo: text(v, 1000),
    difficulties: text(v, 2000).min(1, v.difficulties),
    dailyStressors: text(v, 2000),
    biggestDrain: text(v, 2000),
    likesToEat: text(v, 1000),
    dislikesToEat: text(v, 1000),
    goals: text(v, 1000),
    interestAreas: z.array(z.string().refine(isAreaSlug)).max(10),
  });
}

export function waitlistSchema(v: ValidationMessages) {
  return z.object({ name: z.string().trim().min(2, v.name).max(120), email: email(v) });
}

export type FormState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Valores enviados, para repreencher o formulário em caso de erro. */
  values?: Record<string, string>;
};

export function fieldErrorsOf(error: z.ZodError): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
