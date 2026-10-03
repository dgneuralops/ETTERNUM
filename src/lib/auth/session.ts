import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, schema } from "@/lib/db";
import { SESSION_COOKIE, SESSION_DAYS, signSession, verifySession } from "./token";

export async function createSession(userId: string) {
  const token = await signSession({ userId });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export const getSessionUserId = cache(async (): Promise<string | null> => {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  return session?.userId ?? null;
});

/** Usuário logado (com a triagem), ou null. Deduplicado por requisição. */
export const getCurrentUser = cache(async () => {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const [row] = await db
    .select({ user: schema.users, profile: schema.profiles })
    .from(schema.users)
    .leftJoin(schema.profiles, eq(schema.profiles.userId, schema.users.id))
    .where(eq(schema.users.id, userId))
    .limit(1);
  return row ?? null;
});

/** Para páginas: exige login e, por padrão, a triagem concluída. */
export async function requireUser(opts: { allowMissingTriage?: boolean } = {}) {
  const current = await getCurrentUser();
  if (!current) redirect("/entrar");
  if (!current.profile && !opts.allowMissingTriage) redirect("/triagem");
  return current;
}
