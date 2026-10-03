"use client";

import { ArrowUp, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { readNdjson } from "@/lib/chat/ndjson";
import type { ClientMessage } from "@/lib/chat/queries";
import { CrisisBanner } from "./CrisisBanner";
import { Markdown } from "./Markdown";
import { MindAvatar } from "./MindAvatar";

export type CouncilMind = { slug: string; name: string; focus: string };

type Answer = { slug: string; text: string; done: boolean };
type Round = { id: string; question: string; answers: Answer[]; synthesis: Answer | null };

const MAESTRO_SLUG = "maestro";
const MAX = 4;

function toRounds(messages: ClientMessage[]): Round[] {
  const rounds: Round[] = [];
  for (const m of messages) {
    if (m.role === "user") {
      rounds.push({ id: m.id, question: m.content, answers: [], synthesis: null });
      continue;
    }
    const round = rounds[rounds.length - 1];
    if (!round) continue;
    const answer = { slug: m.agentSlug ?? "", text: m.content, done: true };
    if (m.agentSlug === MAESTRO_SLUG) round.synthesis = answer;
    else round.answers.push(answer);
  }
  return rounds;
}

export function CouncilView({
  areaSlug,
  areaName,
  minds,
  conversationId: initialConversationId,
  initialMessages,
  lockedMessage,
}: {
  areaSlug: string;
  areaName: string;
  minds: CouncilMind[];
  conversationId?: string;
  initialMessages: ClientMessage[];
  lockedMessage: string | null;
}) {
  const router = useRouter();
  const byslug = Object.fromEntries(minds.map((m) => [m.slug, m]));
  const [selected, setSelected] = useState<string[]>(() => {
    const used = [...new Set(initialMessages.map((m) => m.agentSlug).filter((s): s is string => !!s && s in byslug))];
    return used.length ? used.slice(0, MAX) : minds.slice(0, 3).map((m) => m.slug);
  });
  const [rounds, setRounds] = useState<Round[]>(() => toRounds(initialMessages));
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [draft, setDraft] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(lockedMessage);
  const [risk, setRisk] = useState(initialMessages.some((m) => m.riskFlag));
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [rounds.length]);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length >= MAX ? prev : [...prev, slug],
    );
  }

  function update(roundId: string, slug: string, fn: (a: Answer) => Answer) {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        if (slug === MAESTRO_SLUG) return { ...r, synthesis: fn(r.synthesis ?? { slug, text: "", done: false }) };
        return { ...r, answers: r.answers.map((a) => (a.slug === slug ? fn(a) : a)) };
      }),
    );
  }

  async function submit() {
    const message = draft.trim();
    if (!message || running || selected.length === 0) return;
    setError(null);
    setRunning(true);
    const roundId = `round-${Date.now()}`;
    setRounds((prev) => [
      ...prev,
      {
        id: roundId,
        question: message,
        answers: selected.map((slug) => ({ slug, text: "", done: false })),
        synthesis: null,
      },
    ]);
    setDraft("");
    let created = false;
    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ areaSlug, agentSlugs: selected, message, conversationId }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setRounds((prev) => prev.filter((r) => r.id !== roundId));
        setDraft(message);
        if (response.status === 402) setLocked(data.error ?? "Recurso do plano Premium.");
        else setError(data.error ?? "Não foi possível consultar o Conselho.");
        return;
      }
      await readNdjson(response, (event) => {
        switch (event.type) {
          case "meta":
            if (!conversationId) {
              created = true;
              setConversationId(event.conversationId);
              const url = new URL(window.location.href);
              url.searchParams.set("c", event.conversationId);
              window.history.replaceState(null, "", url);
            }
            if (event.risk) setRisk(true);
            break;
          case "delta":
            update(roundId, event.agent, (a) => ({ ...a, text: a.text + event.text }));
            break;
          case "replace":
            update(roundId, event.agent, (a) => ({ ...a, text: event.text }));
            break;
          case "end":
            update(roundId, event.agent, (a) => ({ ...a, done: true }));
            break;
          case "error":
            setError(event.message);
            break;
        }
      });
    } catch {
      setError("A conexão caiu. Tente novamente.");
    } finally {
      setRunning(false);
      if (created) router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      {risk && <CrisisBanner />}

      {rounds.map((round) => (
        <section key={round.id} className="space-y-4">
          <p className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-gold/12 px-4 py-3 text-[15px] leading-relaxed text-ink">
            {round.question}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {round.answers.map((a) => {
              const mind = byslug[a.slug] ?? { slug: a.slug, name: a.slug, focus: "" };
              return (
                <article key={a.slug} className="glass rounded-3xl p-5">
                  <header className="mb-3 flex items-center gap-3">
                    <MindAvatar agent={mind} size="sm" />
                    <div>
                      <Link
                        href={`/mente/${mind.slug}`}
                        className="font-serif text-lg leading-tight text-ink hover:text-gold"
                      >
                        {mind.name}
                      </Link>
                      <p className="text-xs text-muted">{mind.focus}</p>
                    </div>
                  </header>
                  {a.text ? (
                    <Markdown>{a.text}</Markdown>
                  ) : (
                    <span className="typing inline-flex gap-1 text-2xl leading-none text-gold" aria-label="Pensando">
                      <span>·</span>
                      <span>·</span>
                      <span>·</span>
                    </span>
                  )}
                </article>
              );
            })}
          </div>
          {(round.synthesis ||
            (running && round.id === rounds[rounds.length - 1]?.id && round.answers.every((a) => a.done))) && (
            <article className="glass rounded-3xl border-line-strong p-6">
              <header className="mb-3 flex items-center gap-3">
                <MindAvatar agent={{ slug: MAESTRO_SLUG, name: "Maestro" }} size="sm" />
                <p className="font-serif text-xl text-gold">Síntese do Maestro</p>
              </header>
              {round.synthesis?.text ? (
                <Markdown>{round.synthesis.text}</Markdown>
              ) : (
                <span className="typing inline-flex gap-1 text-2xl leading-none text-gold" aria-label="Sintetizando">
                  <span>·</span>
                  <span>·</span>
                  <span>·</span>
                </span>
              )}
            </article>
          )}
        </section>
      ))}
      <div ref={endRef} />

      {locked ? (
        <div className="glass rounded-3xl p-5 text-sm text-muted">
          <p>{locked}</p>
          <Link href="/plano" className="btn-gold mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold">
            Conhecer o Premium
          </Link>
        </div>
      ) : (
        <div className="glass rounded-3xl p-5">
          <p className="text-sm text-ink">
            Conselheiros{" "}
            <span className="text-faint">
              ({selected.length}/{MAX})
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {minds.map((m) => {
              const on = selected.includes(m.slug);
              return (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => toggle(m.slug)}
                  disabled={running || (!on && selected.length >= MAX)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition disabled:opacity-40 ${
                    on ? "border-line-strong bg-gold/10 text-gold" : "border-line text-muted hover:text-ink"
                  }`}
                >
                  {on && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {m.name}
                </button>
              );
            })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="mt-4 flex items-end gap-2"
          >
            <label htmlFor="council-input" className="sr-only">
              Sua situação
            </label>
            <textarea
              id="council-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder={`Conte ao Conselho de ${areaName} o que está acontecendo…`}
              className="field flex-1 resize-y rounded-2xl px-4 py-3 text-[15px] leading-relaxed placeholder:text-faint"
            />
            <button
              type="submit"
              disabled={running || !draft.trim() || selected.length === 0}
              className="btn-gold rounded-full p-3"
              aria-label="Enviar ao Conselho"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
}
