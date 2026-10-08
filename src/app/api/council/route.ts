import { after } from "next/server";
import { z } from "zod";
import { AiNotConfiguredError, streamReply } from "@/lib/ai/model";
import { councilSystemPrompt, synthesisSystemPrompt, withKnowledge } from "@/lib/ai/prompts";
import { getSessionUserId } from "@/lib/auth/session";
import { ndjsonResponse } from "@/lib/chat/ndjson";
import {
  addMessage,
  allConversationMessages,
  createConversation,
  getOwnedConversation,
  loadUser,
  maybeUpdateMemory,
  messagesToday,
  searchKnowledge,
  speakerName,
  titleFrom,
  toUserContext,
} from "@/lib/chat/service";
import type { Message } from "@/lib/db/schema";
import { MAESTRO, MAX_COUNCIL_AGENTS, getAgent, type Agent } from "@/lib/domain/agents";
import { getArea } from "@/lib/domain/areas";
import { canSendMessage } from "@/lib/domain/plans";
import { detectRisk } from "@/lib/domain/safety";
import { localizeArea } from "@/lib/i18n/content/areas";
import { accessMessage } from "@/lib/i18n/format";
import { getI18n } from "@/lib/i18n/server";

export const maxDuration = 300;

const bodySchema = z.object({
  areaSlug: z.string(),
  agentSlugs: z.array(z.string()).min(1).max(MAX_COUNCIL_AGENTS),
  message: z.string().trim().min(1).max(8000),
  conversationId: z.string().optional(),
});

/** Rodadas anteriores do Conselho, em texto, para dar contexto a cada conselheiro. */
function transcriptOf(history: Message[]): string {
  return history.map((m) => `[${m.role === "user" ? "Pessoa" : speakerName(m.agentSlug)}]: ${m.content}`).join("\n\n");
}

export async function POST(request: Request) {
  const { locale, t } = await getI18n();
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: t.api.loginRequired }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: t.api.invalidRequest }, { status: 400 });
  const { areaSlug, agentSlugs, message, conversationId } = parsed.data;

  const area = getArea(areaSlug);
  const council = [...new Set(agentSlugs)]
    .map((slug) => getAgent(slug))
    .filter((a): a is Agent => Boolean(a && area && a.areas.includes(area.slug)));
  if (!area || council.length === 0) return Response.json({ error: t.api.invalidCouncil }, { status: 400 });

  const loaded = await loadUser(userId);
  if (!loaded) return Response.json({ error: t.api.loginRequired }, { status: 401 });
  const { user, profile, plan } = loaded;

  const access = canSendMessage(plan, {
    capsuleSlug: null,
    council: true,
    messagesToday: await messagesToday(userId, user.timeZone),
  });
  if (!access.ok) {
    return Response.json({ error: accessMessage(t, access.reason), reason: access.reason }, { status: 402 });
  }

  let conversation = conversationId ? await getOwnedConversation(userId, conversationId) : null;
  if (conversationId && (!conversation || conversation.kind !== "council" || conversation.areaSlug !== area.slug)) {
    return Response.json({ error: t.api.conversationNotFound }, { status: 404 });
  }
  conversation ??= await createConversation({
    userId,
    kind: "council",
    areaSlug: area.slug,
    title: titleFrom(message, t.common.newConversation),
  });
  const conv = conversation;

  const previous = await allConversationMessages(conv.id);
  const risk = detectRisk(message);
  await addMessage({ conversationId: conv.id, userId, role: "user", content: message, riskFlag: risk });

  const context = toUserContext(user, profile);
  const earlier = previous.length
    ? `Rodadas anteriores deste Conselho:\n\n${transcriptOf(previous.slice(-30))}\n\n`
    : "";

  after(() => maybeUpdateMemory(userId, conv.id, { force: true, locale }));

  const areaName = localizeArea(area, locale).name;

  return ndjsonResponse(t.api.generic, async (send) => {
    send({ type: "meta", conversationId: conv.id, risk });
    try {
      const answers = await Promise.all(
        council.map(async (agent) => {
          send({ type: "start", agent: agent.slug });
          const passages = await searchKnowledge(agent.slug, message, 3);
          const prompt = `${earlier}Nova mensagem da pessoa para o Conselho:\n${message}`;
          const result = await streamReply({
            system: councilSystemPrompt(agent, context, areaName, council, { risk, locale }),
            messages: [{ role: "user", content: withKnowledge(prompt, agent, passages) }],
            effort: "low",
            maxTokens: 16000,
            signal: request.signal,
            locale,
            onText: (text) => send({ type: "delta", agent: agent.slug, text }),
          });
          if (result.refused) send({ type: "replace", agent: agent.slug, text: result.text });
          const saved = await addMessage({
            conversationId: conv.id,
            userId,
            role: "assistant",
            agentSlug: agent.slug,
            content: result.text,
          });
          send({ type: "end", agent: agent.slug, messageId: saved.id });
          return { agent, text: result.text };
        }),
      );

      send({ type: "start", agent: MAESTRO.slug });
      const round = answers.map((a) => `[${a.agent.name}]: ${a.text}`).join("\n\n");
      const synthesis = await streamReply({
        system: synthesisSystemPrompt(context, { risk, locale }),
        messages: [
          {
            role: "user",
            content: `${earlier}Mensagem da pessoa:\n${message}\n\nRespostas do Conselho nesta rodada:\n\n${round}`,
          },
        ],
        effort: "medium",
        maxTokens: 16000,
        signal: request.signal,
        locale,
        onText: (text) => send({ type: "delta", agent: MAESTRO.slug, text }),
      });
      if (synthesis.refused) send({ type: "replace", agent: MAESTRO.slug, text: synthesis.text });
      const saved = await addMessage({
        conversationId: conv.id,
        userId,
        role: "assistant",
        agentSlug: MAESTRO.slug,
        content: synthesis.text,
      });
      send({ type: "end", agent: MAESTRO.slug, messageId: saved.id });
    } catch (error) {
      if (request.signal.aborted) return;
      if (error instanceof AiNotConfiguredError) {
        console.error(error.message);
        send({ type: "error", message: t.api.aiNotConfigured });
        return;
      }
      throw error;
    }
  });
}
