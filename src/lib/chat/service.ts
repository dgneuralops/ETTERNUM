import "server-only";
import { and, asc, count, desc, eq, gte, sql } from "drizzle-orm";
import { completeText, type ChatTurn } from "@/lib/ai/claude";
import { MEMORY_SYSTEM, memoryUserPrompt, type UserContext } from "@/lib/ai/prompts";
import { db, schema } from "@/lib/db";
import type { Conversation, Message, Profile, User } from "@/lib/db/schema";
import { getSpeaker } from "@/lib/domain/agents";
import { planState, startOfTodayInSaoPaulo, type PlanState } from "@/lib/domain/plans";

/** Quantas mensagens anteriores entram no contexto de cada resposta. */
const HISTORY_LIMIT = 40;
/** A memória é atualizada a cada N mensagens da pessoa numa conversa. */
const MEMORY_EVERY = 3;

export function toUserContext(user: User, profile: Profile | null): UserContext {
  return {
    name: user.name,
    birthDate: user.birthDate,
    zodiacSign: user.zodiacSign,
    memory: user.memory,
    profile: profile && {
      occupation: profile.occupation,
      likesToDo: profile.likesToDo,
      dislikesToDo: profile.dislikesToDo,
      difficulties: profile.difficulties,
      dailyStressors: profile.dailyStressors,
      biggestDrain: profile.biggestDrain,
      likesToEat: profile.likesToEat,
      dislikesToEat: profile.dislikesToEat,
      goals: profile.goals,
      interestAreas: profile.interestAreas,
    },
  };
}

export async function loadUser(
  userId: string,
): Promise<{ user: User; profile: Profile | null; plan: PlanState } | null> {
  const [row] = await db
    .select({ user: schema.users, profile: schema.profiles })
    .from(schema.users)
    .leftJoin(schema.profiles, eq(schema.profiles.userId, schema.users.id))
    .where(eq(schema.users.id, userId))
    .limit(1);
  if (!row) return null;
  return { ...row, plan: planState(row.user) };
}

/** Mensagens enviadas pela pessoa hoje (fuso de São Paulo), sem contar encaminhamentos. */
export async function messagesToday(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(schema.messages)
    .where(
      and(
        eq(schema.messages.userId, userId),
        eq(schema.messages.role, "user"),
        eq(schema.messages.forwarded, false),
        gte(schema.messages.createdAt, startOfTodayInSaoPaulo()),
      ),
    );
  return row?.n ?? 0;
}

export async function getOwnedConversation(userId: string, conversationId: string): Promise<Conversation | null> {
  if (!/^[0-9a-f-]{36}$/i.test(conversationId)) return null;
  const [conv] = await db
    .select()
    .from(schema.conversations)
    .where(and(eq(schema.conversations.id, conversationId), eq(schema.conversations.userId, userId)))
    .limit(1);
  return conv ?? null;
}

export function titleFrom(message: string): string {
  const clean = message.replace(/\s+/g, " ").trim();
  return clean.length > 70 ? `${clean.slice(0, 67)}…` : clean || "Nova conversa";
}

export async function createConversation(values: {
  userId: string;
  kind: "chat" | "council";
  agentSlug?: string | null;
  areaSlug?: string | null;
  title: string;
}): Promise<Conversation> {
  const [conv] = await db.insert(schema.conversations).values(values).returning();
  return conv;
}

export async function addMessage(values: {
  conversationId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  agentSlug?: string | null;
  riskFlag?: boolean;
  forwarded?: boolean;
}): Promise<Message> {
  const [message] = await db.insert(schema.messages).values(values).returning();
  await db
    .update(schema.conversations)
    .set({
      updatedAt: new Date(),
      ...(values.role === "user" && !values.forwarded
        ? { turnsSinceMemory: sql`${schema.conversations.turnsSinceMemory} + 1` }
        : {}),
    })
    .where(eq(schema.conversations.id, values.conversationId));
  return message;
}

export async function conversationMessages(conversationId: string, limit = HISTORY_LIMIT): Promise<Message[]> {
  const rows = await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(desc(schema.messages.createdAt))
    .limit(limit);
  return rows.reverse();
}

export async function allConversationMessages(conversationId: string): Promise<Message[]> {
  return db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(asc(schema.messages.createdAt));
}

/** Histórico no formato da API: sempre começando por uma mensagem da pessoa. */
export function toChatTurns(history: Message[]): ChatTurn[] {
  const turns: ChatTurn[] = history.map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.content,
  }));
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns;
}

export function speakerName(slug: string | null): string {
  if (!slug) return "Pessoa";
  return getSpeaker(slug)?.name ?? slug;
}

/** Busca trechos dos livros da cápsula relacionados à mensagem (texto completo, em português). */
export async function searchKnowledge(agentSlug: string, query: string, limit = 4) {
  const terms = [...new Set(query.toLowerCase().match(/[\p{L}]{4,}/gu) ?? [])].slice(0, 30);
  if (terms.length === 0) return [];
  const tsquery = terms.join(" | ");
  const rows = await db.execute<{ source: string; content: string }>(sql`
    select source, content
    from ${schema.knowledgeChunks}, to_tsquery('portuguese', ${tsquery}) as q
    where agent_slug = ${agentSlug} and search_vector @@ q
    order by ts_rank_cd(search_vector, q) desc
    limit ${limit}
  `);
  return rows.rows;
}

/** Atualiza a memória de longo prazo quando a conversa acumulou mensagens suficientes. */
export async function maybeUpdateMemory(userId: string, conversationId: string, opts: { force?: boolean } = {}) {
  const [row] = await db
    .select({ memory: schema.users.memory, turns: schema.conversations.turnsSinceMemory })
    .from(schema.conversations)
    .innerJoin(schema.users, eq(schema.users.id, schema.conversations.userId))
    .where(and(eq(schema.conversations.id, conversationId), eq(schema.conversations.userId, userId)))
    .limit(1);
  if (!row) return;
  const due = opts.force || row.turns >= MEMORY_EVERY || (row.memory.trim() === "" && row.turns >= 1);
  if (!due) return;

  const recent = await conversationMessages(conversationId, 12);
  const transcript = recent
    .map((m) => `${m.role === "user" ? "Pessoa" : speakerName(m.agentSlug)}: ${m.content}`)
    .join("\n\n");
  try {
    const updated = await completeText({
      system: MEMORY_SYSTEM,
      messages: [{ role: "user", content: memoryUserPrompt(row.memory, transcript) }],
      effort: "low",
      maxTokens: 4000,
    });
    if (!updated?.trim()) return;
    await db
      .update(schema.users)
      .set({ memory: updated.trim(), memoryUpdatedAt: new Date() })
      .where(eq(schema.users.id, userId));
    await db
      .update(schema.conversations)
      .set({ turnsSinceMemory: 0 })
      .where(eq(schema.conversations.id, conversationId));
  } catch (error) {
    console.error("Falha ao atualizar a memória", error);
  }
}
