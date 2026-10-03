import { z } from "zod";
import { isAreaSlug } from "./areas";
import { isValidCpf, onlyDigits } from "./cpf";
import { ageOn, isZodiacSlug, parseIsoDate } from "./zodiac";

export const MIN_AGE = 18;

const text = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres.`);

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Digite seu nome.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Digite um e-mail válido.")),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(200),
  cpf: z.string().transform(onlyDigits).refine(isValidCpf, "CPF inválido. Confira os números."),
  birthDate: z
    .string()
    .refine((v) => parseIsoDate(v) !== null, "Informe sua data de nascimento.")
    .refine((v) => (ageOn(v) ?? 0) >= MIN_AGE, `O Etternum é para maiores de ${MIN_AGE} anos.`)
    .refine((v) => (ageOn(v) ?? 200) < 120, "Confira a data de nascimento."),
  zodiacSign: z.string().refine(isZodiacSlug, "Escolha seu signo."),
  consent: z.literal("on", { error: "Para continuar, aceite os termos e a política de privacidade." }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Digite um e-mail válido.")),
  password: z.string().min(1, "Digite sua senha."),
});

export const triageSchema = z.object({
  occupation: text(500).min(1, "Conte com o que você trabalha (ou se está estudando, buscando trabalho...)."),
  likesToDo: text(1000).min(1, "Conte o que você gosta de fazer."),
  dislikesToDo: text(1000),
  difficulties: text(2000).min(1, "Conte suas maiores dificuldades — isso ajuda muito as mentes a orientar você."),
  dailyStressors: text(2000),
  biggestDrain: text(2000),
  likesToEat: text(1000),
  dislikesToEat: text(1000),
  goals: text(1000),
  interestAreas: z.array(z.string().refine(isAreaSlug)).max(10),
});

export const waitlistSchema = z.object({
  name: z.string().trim().min(2, "Digite seu nome.").max(120),
  email: z.string().trim().toLowerCase().pipe(z.email("Digite um e-mail válido.")),
});

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
