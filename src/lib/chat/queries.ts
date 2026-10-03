import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Message } from "@/lib/db/schema";

export async function favoriteSlugs(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ slug: schema.favorites.agentSlug })
    .from(schema.favorites)
    .where(eq(schema.favorites.userId, userId))
    .orderBy(desc(schema.favorites.createdAt));
  return new Set(rows.map((r) => r.slug));
}

export async function recentConversations(userId: string, limit = 50) {
  return db
    .select()
    .from(schema.conversations)
    .where(eq(schema.conversations.userId, userId))
    .orderBy(desc(schema.conversations.updatedAt))
    .limit(limit);
}

export async function conversationsWith(userId: string, agentSlug: string, limit = 20) {
  return db
    .select()
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.userId, userId),
        eq(schema.conversations.agentSlug, agentSlug),
        eq(schema.conversations.kind, "chat"),
      ),
    )
    .orderBy(desc(schema.conversations.updatedAt))
    .limit(limit);
}

export async function councilConversations(userId: string, areaSlug: string, limit = 20) {
  return db
    .select()
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.userId, userId),
        eq(schema.conversations.areaSlug, areaSlug),
        eq(schema.conversations.kind, "council"),
      ),
    )
    .orderBy(desc(schema.conversations.updatedAt))
    .limit(limit);
}

/** Formato serializável enviado aos componentes de cliente. */
export type ClientMessage = {
  id: string;
  role: "user" | "assistant";
  agentSlug: string | null;
  content: string;
  riskFlag: boolean;
};

export function toClientMessages(rows: Message[]): ClientMessage[] {
  return rows.map((m) => ({
    id: m.id,
    role: m.role === "user" ? "user" : "assistant",
    agentSlug: m.agentSlug,
    content: m.content,
    riskFlag: m.riskFlag,
  }));
}
