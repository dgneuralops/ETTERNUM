"use client";

import { ArrowUp, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { readNdjson } from "@/lib/chat/ndjson";
import type { ClientMessage } from "@/lib/chat/queries";
import { CrisisBanner } from "./CrisisBanner";
import { Markdown } from "./Markdown";
import { MindAvatar } from "./MindAvatar";

export type MindSummary = { slug: string; name: string; focus: string };

type Props = {
  mind: MindSummary;
  conversationId?: string;
  initialMessages: ClientMessage[];
  /** Conversa do Maestro aberta a partir de uma área. */
  areaSlug?: string;
  /** Texto inicial da caixa de mensagem. */
  initialDraft?: string;
  /** Envia o rascunho inicial automaticamente (vindo da página inicial). */
  autoSend?: boolean;
  /** Gera a resposta para a última mensagem pendente (após encaminhamento). */
  autoRespond?: boolean;
  /** Bloqueio do plano gratuito. */
  lockedMessage?: string | null;
  /** Para o Maestro: nomes das mentes que ele pode recomendar. */
  minds?: Record<string, MindSummary>;
  suggestions?: string[];
  placeholder?: string;
};

const TAG = /\[\[mente:([a-z0-9-]+)\]\]/g;

function splitTags(text: string): { text: string; slugs: string[] } {
  const slugs = [...new Set([...text.matchAll(TAG)].map((m) => m[1]))];
  // Esconde também uma marcação ainda incompleta no fim do streaming.
  const clean = text
    .replace(TAG, "")
    .replace(/\[\[[^\]]*$/, "")
    .trim();
  return { text: clean, slugs };
}

export function ChatView({
  mind,
  conversationId: initialConversationId,
  initialMessages,
  areaSlug,
  initialDraft = "",
  autoSend = false,
  autoRespond = false,
  lockedMessage = null,
  minds,
  suggestions = [],
  placeholder,
}: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [draft, setDraft] = useState(initialDraft);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(lockedMessage);
  const [risk, setRisk] = useState(initialMessages.some((m) => m.riskFlag));
  const [handingOff, setHandingOff] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const started = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text?: string) => {
      const message = text?.trim();
      if (streaming || (text !== undefined && !message)) return;
      setError(null);
      setStreaming(true);
      const pendingId = `pending-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        ...(message
          ? [{ id: `user-${Date.now()}`, role: "user" as const, agentSlug: null, content: message, riskFlag: false }]
          : []),
        { id: pendingId, role: "assistant", agentSlug: mind.slug, content: "", riskFlag: false },
      ]);
      if (message) setDraft("");

      const controller = new AbortController();
      abortRef.current = controller;
      let createdConversation = false;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentSlug: mind.slug, conversationId, message, areaSlug }),
          signal: controller.signal,
        });
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { error?: string; reason?: string };
          setMessages((prev) => prev.filter((m) => m.id !== pendingId));
          if (response.status === 402) setLocked(data.error ?? "Recurso do plano Premium.");
          else setError(data.error ?? "Não foi possível enviar sua mensagem.");
          if (message) setDraft(message);
          return;
        }
        await readNdjson(response, (event) => {
          switch (event.type) {
            case "meta": {
              if (!conversationId) {
                createdConversation = true;
                setConversationId(event.conversationId);
              }
              // Remove parâmetros de uso único para que recarregar a página não reenvie nada.
              const url = new URL(window.location.href);
              url.searchParams.set("c", event.conversationId);
              ["texto", "de", "responder", "area"].forEach((p) => url.searchParams.delete(p));
              window.history.replaceState(null, "", url);
              if (event.risk) setRisk(true);
              break;
            }
            case "delta":
              setMessages((prev) =>
                prev.map((m) => (m.id === pendingId ? { ...m, content: m.content + event.text } : m)),
              );
              break;
            case "replace":
              setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, content: event.text } : m)));
              break;
            case "end":
              setMessages((prev) => prev.map((m) => (m.id === pendingId ? { ...m, id: event.messageId } : m)));
              break;
            case "error":
              setError(event.message);
              setMessages((prev) => prev.filter((m) => !(m.id === pendingId && !m.content)));
              break;
          }
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError("A conexão caiu. Tente enviar de novo.");
        setMessages((prev) => prev.filter((m) => !(m.id === pendingId && !m.content)));
      } finally {
        setStreaming(false);
        abortRef.current = null;
        if (createdConversation) router.refresh();
      }
    },
    [areaSlug, conversationId, mind.slug, router, streaming],
  );

  // Envio automático (texto vindo da página inicial) ou resposta pendente (encaminhamento).
  useEffect(() => {
    if (!autoRespond && !(autoSend && initialDraft.trim())) return;
    const timer = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      void (autoRespond ? send() : send(initialDraft));
    }, 0);
    return () => clearTimeout(timer);
  }, [autoRespond, autoSend, initialDraft, send]);

  async function handoff(slug: string) {
    if (!conversationId) return;
    setHandingOff(slug);
    setError(null);
    const response = await fetch("/api/handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromConversationId: conversationId, agentSlug: slug }),
    });
    const data = (await response.json().catch(() => ({}))) as { conversationId?: string; error?: string };
    if (!response.ok || !data.conversationId) {
      setHandingOff(null);
      setError(data.error ?? "Não foi possível encaminhar agora.");
      return;
    }
    router.push(`/mente/${slug}?c=${data.conversationId}&responder=1`);
  }

  const lastMessage = messages[messages.length - 1];
  const waiting = streaming && lastMessage?.role === "assistant" && lastMessage.content === "";

  return (
    <div className="flex min-h-[calc(100dvh-13rem)] flex-col lg:min-h-[calc(100dvh-9rem)]">
      <div className="flex-1 space-y-6 pb-6">
        {risk && <CrisisBanner />}

        {messages.length === 0 && (
          <div className="glass rounded-3xl p-6 text-center">
            <div className="flex justify-center">
              <MindAvatar agent={mind} size="lg" />
            </div>
            <p className="mt-4 font-serif text-2xl text-ink">Sobre o que você quer conversar?</p>
            <p className="mt-1 text-sm text-muted">{mind.focus}</p>
            {suggestions.length > 0 && !locked && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="btn-ghost rounded-full px-4 py-2 text-sm text-muted hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((m) => {
          if (m.role === "user") {
            return (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-gold/12 px-4 py-3 text-[15px] leading-relaxed text-ink">
                  {m.content}
                </p>
              </div>
            );
          }
          const { text, slugs } = splitTags(m.content);
          const recommended = minds ? slugs.map((s) => minds[s]).filter(Boolean) : [];
          return (
            <div key={m.id} className="flex gap-3">
              <MindAvatar agent={mind} size="sm" />
              <div className="min-w-0 flex-1 pt-1">
                {text ? <Markdown>{text}</Markdown> : null}
                {m.id.startsWith("pending") && !m.content && (
                  <span className="typing inline-flex gap-1 text-2xl leading-none text-gold" aria-label="Pensando">
                    <span>·</span>
                    <span>·</span>
                    <span>·</span>
                  </span>
                )}
                {recommended.length > 0 && !m.id.startsWith("pending") && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommended.map((r) => (
                      <button
                        key={r.slug}
                        type="button"
                        disabled={handingOff !== null || !conversationId}
                        onClick={() => void handoff(r.slug)}
                        className="glass flex items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:border-line-strong disabled:opacity-60"
                      >
                        <MindAvatar agent={r} size="sm" />
                        <span>
                          <span className="block text-sm font-semibold text-ink">
                            {handingOff === r.slug ? "Encaminhando…" : `Continuar com ${r.name}`}
                          </span>
                          <span className="block text-xs text-muted">{r.focus}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {waiting && <span className="sr-only">Gerando resposta…</span>}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-20 z-10 lg:bottom-4">
        {error && <p className="mb-2 rounded-xl bg-danger/10 px-4 py-2 text-sm text-danger">{error}</p>}
        {locked ? (
          <div className="glass rounded-3xl p-4 text-sm text-muted">
            <p>{locked}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/plano" className="btn-gold rounded-full px-4 py-2 text-sm font-semibold">
                Conhecer o Premium
              </Link>
              <Link href="/maestro" className="btn-ghost rounded-full px-4 py-2 text-sm text-ink">
                Falar com o Maestro
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="glass flex items-end gap-2 rounded-3xl p-2 pl-4"
          >
            <label htmlFor="chat-input" className="sr-only">
              Sua mensagem
            </label>
            <textarea
              id="chat-input"
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void send(draft);
                }
              }}
              rows={1}
              placeholder={placeholder ?? `Escreva para ${mind.name}…`}
              className="max-h-48 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-faint"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            {streaming ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="btn-ghost rounded-full p-3 text-ink"
                aria-label="Parar"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button type="submit" disabled={!draft.trim()} className="btn-gold rounded-full p-3" aria-label="Enviar">
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </form>
        )}
        <p className="mt-2 text-center text-[11px] text-faint">
          Cápsulas de IA podem errar. Não substituem profissionais de saúde. Em crise, ligue 188.
        </p>
      </div>
    </div>
  );
}
