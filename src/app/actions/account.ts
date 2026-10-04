"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, getSessionUserId } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { getAgent } from "@/lib/domain/agents";
import { fieldErrorsOf, triageSchema, waitlistSchema, type FormState } from "@/lib/domain/forms";
import { planState } from "@/lib/domain/plans";
import { getI18n } from "@/lib/i18n/server";

async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) redirect("/entrar");
  return userId;
}

export async function saveTriage(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const raw = {
    occupation: String(formData.get("occupation") ?? ""),
    likesToDo: String(formData.get("likesToDo") ?? ""),
    dislikesToDo: String(formData.get("dislikesToDo") ?? ""),
    difficulties: String(formData.get("difficulties") ?? ""),
    dailyStressors: String(formData.get("dailyStressors") ?? ""),
    biggestDrain: String(formData.get("biggestDrain") ?? ""),
    likesToEat: String(formData.get("likesToEat") ?? ""),
    dislikesToEat: String(formData.get("dislikesToEat") ?? ""),
    goals: String(formData.get("goals") ?? ""),
    interestAreas: formData.getAll("interestAreas").map(String),
  };
  const { t } = await getI18n();
  const parsed = triageSchema(t.validation).safeParse(raw);
  if (!parsed.success) {
    const { interestAreas, ...rest } = raw;
    return { fieldErrors: fieldErrorsOf(parsed.error), values: { ...rest, interestAreas: interestAreas.join(",") } };
  }

  const values = { ...parsed.data, updatedAt: new Date() };
  await db
    .insert(schema.profiles)
    .values({ userId, ...values })
    .onConflictDoUpdate({ target: schema.profiles.userId, set: values });

  revalidatePath("/", "layout");
  redirect("/inicio");
}

export async function toggleFavorite(agentSlug: string): Promise<boolean> {
  const userId = await requireUserId();
  if (!getAgent(agentSlug)) return false;
  const where = and(eq(schema.favorites.userId, userId), eq(schema.favorites.agentSlug, agentSlug));
  const deleted = await db.delete(schema.favorites).where(where).returning();
  if (deleted.length === 0) {
    await db.insert(schema.favorites).values({ userId, agentSlug }).onConflictDoNothing();
  }
  revalidatePath("/", "layout");
  return deleted.length === 0;
}

export async function clearMemory() {
  const userId = await requireUserId();
  await db.update(schema.users).set({ memory: "", memoryUpdatedAt: new Date() }).where(eq(schema.users.id, userId));
  revalidatePath("/perfil");
}

export async function deleteConversation(conversationId: string) {
  const userId = await requireUserId();
  await db
    .delete(schema.conversations)
    .where(and(eq(schema.conversations.id, conversationId), eq(schema.conversations.userId, userId)));
  revalidatePath("/conversas");
}

/** Exclusão definitiva da conta e de todos os dados (direito previsto na LGPD). */
export async function deleteAccount(formData: FormData) {
  const userId = await requireUserId();
  const { t } = await getI18n();
  const typed = String(formData.get("confirm") ?? "")
    .trim()
    .toUpperCase();
  if (typed !== t.profile.confirmWord) return;
  await db.delete(schema.users).where(eq(schema.users.id, userId));
  await destroySession();
  redirect("/?conta=excluida");
}

/** Plano gratuito: escolher a cápsula liberada (só enquanto nenhuma foi escolhida). */
export async function chooseFreeCapsule(agentSlug: string) {
  const userId = await requireUserId();
  if (!getAgent(agentSlug)) return;
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1);
  const state = planState(user);
  if (state.plan === "free" && state.freeCapsuleSlug) return;
  await db.update(schema.users).set({ freeCapsuleSlug: agentSlug }).where(eq(schema.users.id, userId));
  revalidatePath("/", "layout");
}

export async function joinWaitlist(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getI18n();
  const parsed = waitlistSchema(t.validation).safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: fieldErrorsOf(parsed.error),
      values: { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") },
    };
  }
  await db.insert(schema.waitlist).values(parsed.data).onConflictDoNothing();
  return { ok: true, message: t.waitlist.success };
}
