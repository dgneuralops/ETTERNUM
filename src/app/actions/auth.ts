"use server";

import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { fieldErrorsOf, loginSchema, signupSchema, type FormState } from "@/lib/domain/forms";
import { trialEndFrom } from "@/lib/domain/plans";
import { isLocale } from "@/lib/i18n/config";
import { getChosenLocale, getI18n, setLocaleCookie } from "@/lib/i18n/server";

/** Só aceita caminhos internos para evitar redirecionamento aberto. */
function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : fallback;
}

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const { locale, t } = await getI18n();
  const raw = Object.fromEntries(formData);
  // CPF só no cadastro em português (Brasil).
  const parsed = signupSchema(t.validation, { requireCpf: locale === "pt-BR" }).safeParse(raw);
  const values = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    cpf: String(raw.cpf ?? ""),
    birthDate: String(raw.birthDate ?? ""),
    zodiacSign: String(raw.zodiacSign ?? ""),
  };
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const data = parsed.data;
  const sameEmail = eq(schema.users.email, data.email);
  const existing = await db
    .select({ email: schema.users.email })
    .from(schema.users)
    .where(data.cpf ? or(sameEmail, eq(schema.users.cpf, data.cpf)) : sameEmail)
    .limit(1);
  if (existing.length > 0) {
    const field = existing[0].email === data.email ? "email" : "cpf";
    return {
      fieldErrors: { [field]: [field === "email" ? t.validation.emailTaken : t.validation.cpfTaken] },
      values,
    };
  }

  const now = new Date();
  let userId: string;
  try {
    const [user] = await db
      .insert(schema.users)
      .values({
        name: data.name,
        email: data.email,
        passwordHash: await bcrypt.hash(data.password, 10),
        cpf: data.cpf,
        birthDate: data.birthDate,
        zodiacSign: data.zodiacSign,
        locale,
        timeZone: data.timeZone,
        trialEndsAt: trialEndFrom(now),
        consentAt: now,
      })
      .returning({ id: schema.users.id });
    userId = user.id;
  } catch (error) {
    // Dois cadastros simultâneos com o mesmo e-mail ou CPF: o banco garante a unicidade.
    if ((error as { cause?: { code?: string } }).cause?.code === "23505") {
      return { message: t.validation.accountTaken, values };
    }
    throw error;
  }

  await createSession(userId);
  await setLocaleCookie(locale);
  redirect("/triagem");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getI18n();
  const parsed = loginSchema(t.validation).safeParse(Object.fromEntries(formData));
  const values = { email: String(formData.get("email") ?? "") };
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const [user] = await db
    .select({ id: schema.users.id, passwordHash: schema.users.passwordHash, locale: schema.users.locale })
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);
  const ok = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) return { message: t.auth.invalidLogin, values };

  await createSession(user.id);
  // Se a pessoa escolheu um idioma nesta visita, ele vira a preferência da conta;
  // senão, a preferência da conta vale também neste aparelho.
  const chosen = await getChosenLocale();
  if (chosen && chosen !== user.locale) {
    await db.update(schema.users).set({ locale: chosen }).where(eq(schema.users.id, user.id));
  } else if (!chosen && isLocale(user.locale)) {
    await setLocaleCookie(user.locale);
  }
  redirect(safeNext(formData.get("voltar"), "/inicio"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
