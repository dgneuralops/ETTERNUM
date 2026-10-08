import { describe, expect, it } from "vitest";
import { AGENTS, CAROUSEL_SLUGS, FEATURED_SLUGS, getAgent } from "@/lib/domain/agents";
import { AREAS, isAreaSlug } from "@/lib/domain/areas";
import { formatCpf, isValidCpf, maskCpf } from "@/lib/domain/cpf";
import {
  FREE_DAILY_MESSAGES,
  canSendMessage,
  hourIn,
  isValidTimeZone,
  planState,
  startOfTodayIn,
  trialEndFrom,
} from "@/lib/domain/plans";
import { detectRisk } from "@/lib/domain/safety";
import { ageOn, parseIsoDate, zodiacFromBirthDate } from "@/lib/domain/zodiac";

describe("CPF", () => {
  it("aceita CPFs válidos com ou sem máscara", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });
  it("rejeita dígitos verificadores errados, sequências repetidas e tamanhos inválidos", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("1234567890")).toBe(false);
  });
  it("formata e mascara", () => {
    expect(formatCpf("52998224725")).toBe("529.982.247-25");
    expect(formatCpf("5299")).toBe("529.9");
    expect(maskCpf("52998224725")).toBe("***.982.247-**");
  });
});

describe("Signos", () => {
  it.each([
    ["1990-03-21", "aries"],
    ["1990-04-19", "aries"],
    ["1990-04-20", "touro"],
    ["1990-06-21", "cancer"],
    ["1990-11-22", "sagitario"],
    ["1990-12-21", "sagitario"],
    ["1990-12-22", "capricornio"],
    ["1991-01-01", "capricornio"],
    ["1991-01-19", "capricornio"],
    ["1991-01-20", "aquario"],
    ["1991-02-19", "peixes"],
    ["1991-03-20", "peixes"],
  ])("%s → %s", (date, sign) => {
    expect(zodiacFromBirthDate(date)).toBe(sign);
  });
  it("rejeita datas inválidas", () => {
    expect(parseIsoDate("2023-02-30")).toBeNull();
    expect(zodiacFromBirthDate("31/12/1990")).toBeNull();
  });
  it("calcula a idade", () => {
    const today = new Date(2026, 9, 3); // 3 de outubro de 2026
    expect(ageOn("2000-10-03", today)).toBe(26);
    expect(ageOn("2000-10-04", today)).toBe(25);
  });
});

describe("Detecção de risco (quatro idiomas)", () => {
  it.each([
    "Às vezes penso em suicídio",
    "eu QUERO MORRER",
    "não aguento mais viver assim",
    "tenho vontade de me cortar",
    "I've been thinking about killing myself",
    "Honestly I just want to die",
    "I don’t want to live anymore",
    "everyone would be better off without me",
    "a veces quiero morir",
    "tengo ganas de morirme",
    "pienso en quitarme la vida",
    "j'ai envie de mourir",
    "je pense à me tuer",
    "je veux en finir",
  ])("detecta: %s", (text) => expect(detectRisk(text)).toBe(true));
  it.each([
    "Estou morrendo de rir",
    "quero matar a saudade da minha mãe",
    "meu negócio está difícil",
    "this traffic is killing me",
    "I'm dying to see the new movie",
    "me muero de risa",
    "voy a cortarme el pelo mañana",
    "ce travail va me tuer",
    "je meurs de faim",
  ])("não dispara em: %s", (text) => expect(detectRisk(text)).toBe(false));
});

describe("Planos", () => {
  const created = new Date("2026-10-01T12:00:00Z");
  const base = { plan: "trial", trialEndsAt: trialEndFrom(created), freeCapsuleSlug: null as string | null };

  it("teste dura 14 dias", () => {
    expect(planState(base, new Date("2026-10-02T12:00:00Z"))).toMatchObject({ plan: "trial", trialDaysLeft: 13 });
    expect(planState(base, new Date("2026-10-16T12:00:01Z"))).toMatchObject({ plan: "free", trialDaysLeft: 0 });
  });
  it("premium nunca expira", () => {
    expect(planState({ ...base, plan: "premium" }, new Date("2030-01-01")).plan).toBe("premium");
  });
  it("gratuito: uma cápsula, limite diário e sem Conselho", () => {
    const free = planState({ ...base, freeCapsuleSlug: "seneca" }, new Date("2026-11-01"));
    expect(canSendMessage(free, { capsuleSlug: "seneca", messagesToday: 0 }).ok).toBe(true);
    expect(canSendMessage(free, { capsuleSlug: "carl-jung", messagesToday: 0 })).toMatchObject({
      reason: "capsule_locked",
    });
    expect(canSendMessage(free, { capsuleSlug: "seneca", messagesToday: FREE_DAILY_MESSAGES })).toMatchObject({
      reason: "daily_limit",
    });
    expect(canSendMessage(free, { capsuleSlug: null, council: true, messagesToday: 0 })).toMatchObject({
      reason: "premium_only",
    });
    // Sem cápsula escolhida ainda: a primeira conversa define a cápsula gratuita.
    const fresh = planState(base, new Date("2026-11-01"));
    expect(canSendMessage(fresh, { capsuleSlug: "carl-jung", messagesToday: 0 }).ok).toBe(true);
  });
  it("o dia começa à meia-noite no fuso da pessoa", () => {
    // 02:30 UTC de 3/10 ainda é 23:30 de 2/10 em São Paulo (UTC-3).
    const sp = "America/Sao_Paulo";
    expect(startOfTodayIn(sp, new Date("2026-10-03T02:30:00Z")).toISOString()).toBe("2026-10-02T03:00:00.000Z");
    expect(startOfTodayIn(sp, new Date("2026-10-03T15:00:00Z")).toISOString()).toBe("2026-10-03T03:00:00.000Z");
    // Paris em outubro está em UTC+2: 23:30 UTC de 2/10 já é 3/10.
    expect(startOfTodayIn("Europe/Paris", new Date("2026-10-02T23:30:00Z")).toISOString()).toBe(
      "2026-10-02T22:00:00.000Z",
    );
    // Fuso inválido cai no padrão (São Paulo).
    expect(startOfTodayIn("Lua/Crateras", new Date("2026-10-03T15:00:00Z")).toISOString()).toBe(
      "2026-10-03T03:00:00.000Z",
    );
  });
  it("valida fusos e calcula a hora local para a saudação", () => {
    expect(isValidTimeZone("America/New_York")).toBe(true);
    expect(isValidTimeZone("Lua/Crateras")).toBe(false);
    expect(isValidTimeZone(undefined)).toBe(false);
    expect(hourIn("America/New_York", new Date("2026-10-03T15:00:00Z"))).toBe(11);
    expect(hourIn("Asia/Tokyo", new Date("2026-10-03T15:00:00Z"))).toBe(0);
  });
});

describe("Catálogo", () => {
  it("slugs únicos e áreas válidas", () => {
    const slugs = AGENTS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const agent of AGENTS) {
      expect(agent.areas.length, agent.slug).toBeGreaterThan(0);
      for (const area of agent.areas) expect(isAreaSlug(area), `${agent.slug}: ${area}`).toBe(true);
    }
  });
  it("todo item do carrossel existe e os destaques são as 5 cápsulas do MVP", () => {
    for (const slug of CAROUSEL_SLUGS) expect(getAgent(slug), slug).toBeDefined();
    expect(CAROUSEL_SLUGS).toHaveLength(25);
    expect(FEATURED_SLUGS).toEqual(["carl-jung", "peter-drucker", "seneca", "hannah-arendt", "rumi"]);
  });
  it("toda área tem pelo menos três mentes", () => {
    for (const area of AREAS) {
      expect(AGENTS.filter((a) => a.areas.includes(area.slug)).length, area.slug).toBeGreaterThanOrEqual(3);
    }
  });
  it("pessoas vivas são cápsulas 'inspiradas', nunca recriações em primeira pessoa", () => {
    const living = AGENTS.filter((a) => /^nascid[oa] em|, nascido em/.test(a.era));
    expect(living.length).toBeGreaterThanOrEqual(9);
    for (const agent of living) expect(agent.kind, agent.slug).toBe("inspired");
  });
});

describe("Divisão de textos para a base de conhecimento", async () => {
  const { chunkText } = await import("@/lib/knowledge/chunk");
  it("respeita o limite e não perde conteúdo", () => {
    const text = Array.from(
      { length: 30 },
      (_, i) => `Parágrafo ${i}. ${"Frase longa sobre a vida. ".repeat(10)}`,
    ).join("\n\n");
    const chunks = chunkText(text, 600);
    expect(chunks.every((c) => c.length <= 600)).toBe(true);
    expect(chunks.join(" ")).toContain("Parágrafo 29.");
  });
  it("junta parágrafos curtos", () => {
    expect(chunkText("um\n\ndois\n\ntrês", 100)).toEqual(["um\n\ndois\n\ntrês"]);
  });
  it("quebra parágrafos gigantes", () => {
    expect(chunkText("a".repeat(2500), 1000).length).toBe(3);
  });
});
