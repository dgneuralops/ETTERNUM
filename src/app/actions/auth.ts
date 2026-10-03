"use server";

import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { fieldErrorsOf, loginSchema, signupSchema, type FormState } from "@/lib/domain/forms";
import { trialEndFrom } from "@/lib/domain/plans";

/** Só aceita caminhos internos para evitar redirecionamento aberto. */
function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : fallback;
}

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = signupSchema.safeParse(raw);
  const values = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    cpf: String(raw.cpf ?? ""),
    birthDate: String(raw.birthDate ?? ""),
    zodiacSign: String(raw.zodiacSign ?? ""),
  };
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const data = parsed.data;
  const existing = await db
    .select({ email: schema.users.email, cpf: schema.users.cpf })
    .from(schema.users)
    .where(or(eq(schema.users.email, data.email), eq(schema.users.cpf, data.cpf)))
    .limit(1);
  if (existing.length > 0) {
    const field = existing[0].email === data.email ? "email" : "cpf";
    return {
      fieldErrors: {
        [field]: [field === "email" ? "Este e-mail já tem cadastro. Tente entrar." : "Este CPF já tem cadastro."],
      },
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
        trialEndsAt: trialEndFrom(now),
        consentAt: now,
      })
      .returning({ id: schema.users.id });
    userId = user.id;
  } catch (error) {
    // Dois cadastros simultâneos com o mesmo e-mail ou CPF: o banco garante a unicidade.
    if ((error as { cause?: { code?: string } }).cause?.code === "23505") {
      return { message: "Este e-mail ou CPF já tem cadastro. Tente entrar.", values };
    }
    throw error;
  }

  await createSession(userId);
  redirect("/triagem");
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  const values = { email: String(formData.get("email") ?? "") };
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const [user] = await db
    .select({ id: schema.users.id, passwordHash: schema.users.passwordHash })
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);
  const ok = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !ok) return { message: "E-mail ou senha incorretos.", values };

  await createSession(user.id);
  redirect(safeNext(formData.get("voltar"), "/inicio"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
