import { eq } from "drizzle-orm";
import { after } from "next/server";
import { z } from "zod";
import { AiNotConfiguredError, REFUSAL_TEXT, streamReply } from "@/lib/ai/claude";
import { agentSystemPrompt, maestroSystemPrompt, withKnowledge } from "@/lib/ai/prompts";
import { getSessionUserId } from "@/lib/auth/session";
import { ndjsonResponse } from "@/lib/chat/ndjson";
import {
  addMessage,
  conversationMessages,
  createConversation,
  getOwnedConversation,
  loadUser,
  maybeUpdateMemory,
  messagesToday,
  searchKnowledge,
  titleFrom,
  toChatTurns,
  toUserContext,
} from "@/lib/chat/service";
import { db, schema } from "@/lib/db";
import { MAESTRO, getSpeaker } from "@/lib/domain/agents";
import { isAreaSlug } from "@/lib/domain/areas";
import { canSendMessage } from "@/lib/domain/plans";
import { detectRisk } from "@/lib/domain/safety";

export const maxDuration = 300;

const bodySchema = z.object({
  agentSlug: z.string().min(1),
  conversationId: z.string().optional(),
  /** Ausente: responder à última mensagem da pessoa (ex.: após encaminhamento do Maestro). */
  message: z.string().trim().min(1).max(8000).optional(),
  areaSlug: z.string().optional(),
});

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: "Faça login para continuar." }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Requisição inválida." }, { status: 400 });
  const { agentSlug, conversationId, message, areaSlug } = parsed.data;

  const agent = getSpeaker(agentSlug);
  if (!agent) return Response.json({ error: "Mente não encontrada." }, { status: 404 });
  const isMaestro = agent.slug === MAESTRO.slug;

  const loaded = await loadUser(userId);
  if (!loaded) return Response.json({ error: "Faça login para continuar." }, { status: 401 });
  const { user, profile, plan } = loaded;

  let conversation = conversationId ? await getOwnedConversation(userId, conversationId) : null;
  if (conversationId && (!conversation || conversation.agentSlug !== agent.slug || conversation.kind !== "chat")) {
    return Response.json({ error: "Conversa não encontrada." }, { status: 404 });
  }

  if (message) {
    const access = canSendMessage(plan, {
      capsuleSlug: isMaestro ? null : agent.slug,
      messagesToday: await messagesToday(userId),
    });
    if (!access.ok) return Response.json({ error: access.message, reason: access.reason }, { status: 402 });
  } else if (!conversation) {
    return Response.json({ error: "Escreva uma mensagem." }, { status: 400 });
  }

  if (!conversation) {
    conversation = await createConversation({
      userId,
      kind: "chat",
      agentSlug: agent.slug,
      areaSlug: isMaestro && areaSlug && isAreaSlug(areaSlug) ? areaSlug : null,
      title: titleFrom(message!),
    });
  }
  const conv = conversation;

  if (message) {
    await addMessage({
      conversationId: conv.id,
      userId,
      role: "user",
      content: message,
      riskFlag: detectRisk(message),
    });
    // Plano gratuito: a primeira cápsula usada passa a ser a cápsula liberada.
    if (plan.plan === "free" && !plan.freeCapsuleSlug && !isMaestro) {
      await db.update(schema.users).set({ freeCapsuleSlug: agent.slug }).where(eq(schema.users.id, userId));
    }
  }

  const history = await conversationMessages(conv.id);
  const last = history[history.length - 1];
  if (!last || last.role !== "user") return Response.json({ error: "Nada para responder." }, { status: 400 });

  const risk = detectRisk(last.content);
  const context = toUserContext(user, profile);
  const system = isMaestro
    ? maestroSystemPrompt(context, { risk, areaSlug: conv.areaSlug ?? undefined })
    : agentSystemPrompt(agent, context, { risk });

  const turns = toChatTurns(history);
  if (!isMaestro) {
    const passages = await searchKnowledge(agent.slug, last.content);
    turns[turns.length - 1] = { role: "user", content: withKnowledge(last.content, agent, passages) };
  }

  after(() => maybeUpdateMemory(userId, conv.id));

  return ndjsonResponse(async (send) => {
    send({ type: "meta", conversationId: conv.id, risk });
    send({ type: "start", agent: agent.slug });
    try {
      const result = await streamReply({
        system,
        messages: turns,
        effort: "medium",
        signal: request.signal,
        onText: (text) => send({ type: "delta", agent: agent.slug, text }),
      });
      if (result.refused) send({ type: "replace", agent: agent.slug, text: REFUSAL_TEXT });
      const saved = await addMessage({
        conversationId: conv.id,
        userId,
        role: "assistant",
        agentSlug: agent.slug,
        content: result.text,
      });
      send({ type: "end", agent: agent.slug, messageId: saved.id });
    } catch (error) {
      if (request.signal.aborted) return;
      if (error instanceof AiNotConfiguredError) {
        send({ type: "error", message: error.message });
        return;
      }
      throw error;
    }
  });
}
