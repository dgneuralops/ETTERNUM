import { eq } from "drizzle-orm";
import { z } from "zod";
import { getSessionUserId } from "@/lib/auth/session";
import {
  addMessage,
  conversationMessages,
  createConversation,
  getOwnedConversation,
  loadUser,
  titleFrom,
} from "@/lib/chat/service";
import { db, schema } from "@/lib/db";
import { getAgent } from "@/lib/domain/agents";
import { canSendMessage } from "@/lib/domain/plans";
import { accessMessage } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";

const bodySchema = z.object({ fromConversationId: z.string(), agentSlug: z.string() });

/**
 * Encaminhamento do Maestro: abre uma conversa com a mente recomendada,
 * levando a última mensagem da pessoa para que ela não precise repetir.
 */
export async function POST(request: Request) {
  const { t } = await getI18n();
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: t.api.loginRequired }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: t.api.invalidRequest }, { status: 400 });
  const agent = getAgent(parsed.data.agentSlug);
  const source = await getOwnedConversation(userId, parsed.data.fromConversationId);
  if (!agent || !source) return Response.json({ error: t.api.conversationNotFound }, { status: 404 });

  const loaded = await loadUser(userId);
  if (!loaded) return Response.json({ error: t.api.loginRequired }, { status: 401 });
  const access = canSendMessage(loaded.plan, { capsuleSlug: agent.slug, messagesToday: 0 });
  if (!access.ok) {
    return Response.json({ error: accessMessage(t, access.reason), reason: access.reason }, { status: 402 });
  }

  if (loaded.plan.plan === "free" && !loaded.plan.freeCapsuleSlug) {
    await db.update(schema.users).set({ freeCapsuleSlug: agent.slug }).where(eq(schema.users.id, userId));
  }

  const history = await conversationMessages(source.id, 20);
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) return Response.json({ error: t.api.nothingToForward }, { status: 400 });

  const conv = await createConversation({
    userId,
    kind: "chat",
    agentSlug: agent.slug,
    title: titleFrom(lastUser.content, t.common.newConversation),
  });
  await addMessage({
    conversationId: conv.id,
    userId,
    role: "user",
    content: lastUser.content,
    riskFlag: lastUser.riskFlag,
    forwarded: true,
  });
  return Response.json({ conversationId: conv.id, agentSlug: agent.slug });
}
