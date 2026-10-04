"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSessionUserId } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";
import { isLocale } from "@/lib/i18n/config";
import { setLocaleCookie } from "@/lib/i18n/server";

/** Troca o idioma da interface (e das respostas) e guarda a preferência na conta, se houver login. */
export async function setLocale(locale: string) {
  if (!isLocale(locale)) return;
  await setLocaleCookie(locale);
  const userId = await getSessionUserId();
  if (userId) await db.update(schema.users).set({ locale }).where(eq(schema.users.id, userId));
  revalidatePath("/", "layout");
}
