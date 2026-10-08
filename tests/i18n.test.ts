import { describe, expect, it } from "vitest";
import { agentSystemPrompt, maestroSystemPrompt, memorySystem, synthesisSystemPrompt } from "@/lib/ai/prompts";
import { mockReply } from "@/lib/ai/mock";
import { AGENTS, MAESTRO, getAgent } from "@/lib/domain/agents";
import { ZODIAC_SIGNS } from "@/lib/domain/zodiac";
import { signupSchema } from "@/lib/domain/forms";
import { LOCALES, isLocale, localeFromTag, negotiateLocale } from "@/lib/i18n/config";
import { agentTranslationProblems, localizeAgent, localizeEra } from "@/lib/i18n/content/agents";
import { missingAreaTranslations } from "@/lib/i18n/content/areas";
import { HELP_RESOURCES, crisisLinesForPrompt } from "@/lib/i18n/content/crisis";
import { getLocalizedSign } from "@/lib/i18n/content/zodiac";
import { accessMessage, formatBirthDate } from "@/lib/i18n/format";
import { MESSAGES, messagesFor } from "@/lib/i18n/messages";

/** Lista todas as folhas (strings e funções) do dicionário, com o caminho. */
function leaves(value: unknown, path = ""): [string, unknown][] {
  if (typeof value === "string" || typeof value === "function") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [[path, value]];
}

const user = {
  name: "Alex",
  birthDate: "1990-04-10",
  zodiacSign: "aries",
  memory: "",
  profile: null,
};

describe("Negociação de idioma", () => {
  it("reconhece os quatro idiomas e variantes regionais", () => {
    expect(LOCALES).toEqual(["pt-BR", "en", "es", "fr"]);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(localeFromTag("pt-PT")).toBe("pt-BR");
    expect(localeFromTag("en-GB")).toBe("en");
    expect(localeFromTag("es_MX")).toBe("es");
    expect(localeFromTag("fr-CA")).toBe("fr");
    expect(localeFromTag("de-DE")).toBeNull();
  });
  it("respeita a ordem e os pesos do Accept-Language", () => {
    expect(negotiateLocale("fr-CH, fr;q=0.9, en;q=0.8")).toBe("fr");
    expect(negotiateLocale("de-DE,de;q=0.9,es;q=0.8,en;q=0.7")).toBe("es");
    expect(negotiateLocale("en;q=0.5, pt-BR;q=0.9")).toBe("pt-BR");
    expect(negotiateLocale("ja, en;q=0")).toBe("pt-BR");
    expect(negotiateLocale(undefined)).toBe("pt-BR");
  });
});

describe("Dicionários", () => {
  const base = leaves(MESSAGES["pt-BR"]);
  it.each(LOCALES.filter((l) => l !== "pt-BR"))("%s tem a mesma estrutura do português", (locale) => {
    const other = leaves(MESSAGES[locale]);
    expect(other.map(([path]) => path)).toEqual(base.map(([path]) => path));
  });
  it.each(LOCALES)("%s não tem textos vazios e as funções devolvem texto", (locale) => {
    for (const [path, value] of leaves(MESSAGES[locale])) {
      if (typeof value === "string") expect(value.trim(), `${locale}:${path}`).not.toBe("");
      else expect(typeof value, `${locale}:${path}`).toBe("function");
    }
    const t = messagesFor(locale);
    expect(t.landing.ctaTrial(14)).toContain("14");
    expect(t.plans.errors.daily_limit(5)).toContain("5");
    expect(t.legal.terms.sections(14, 5).length).toBeGreaterThan(0);
  });
  it("traduções diferentes do português nos textos principais", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      const t = messagesFor(locale);
      expect(t.landing.title).not.toBe(MESSAGES["pt-BR"].landing.title);
      expect(t.chat.emptyTitle).not.toBe(MESSAGES["pt-BR"].chat.emptyTitle);
      expect(t.profile.confirmWord).toMatch(/^[A-Z]+$/);
    }
  });
});

describe("Conteúdo traduzido", () => {
  it("todas as mentes, o Maestro e as áreas têm tradução", () => {
    expect(agentTranslationProblems()).toEqual([]);
    expect(missingAreaTranslations()).toEqual([]);
  });
  it("nomes consagrados e datas no idioma certo", () => {
    const seneca = getAgent("seneca")!;
    expect(localizeAgent(seneca, "pt-BR").name).toBe("Sêneca");
    expect(localizeAgent(seneca, "en").name).toBe("Seneca");
    expect(localizeAgent(seneca, "es").name).toBe("Séneca");
    expect(localizeAgent(seneca, "fr").name).toBe("Sénèque");
    expect(localizeAgent(getAgent("socrates")!, "fr").era).toBe("v. 470–399 av. J.-C.");
    expect(localizeAgent(getAgent("socrates")!, "en").era).toBe("c. 470–399 BC");
    expect(localizeAgent(getAgent("jim-collins")!, "es").era).toBe("nacido en 1958");
    expect(localizeEra("nascida em 1970", "fr")).toBe("née en 1970");
  });
  it("nenhuma época traduzida fica em português", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      for (const agent of [...AGENTS, MAESTRO]) {
        const era = localizeAgent(agent, locale).era;
        expect(era, `${locale}:${agent.slug}`).not.toMatch(/a\.C\.|d\.C\.|nascid|séc\.|Sempre|Inspirada na/);
      }
    }
  });
  it("todos os signos existem em todos os idiomas", () => {
    for (const locale of LOCALES) {
      for (const sign of ZODIAC_SIGNS) {
        const s = getLocalizedSign(sign.slug, locale)!;
        expect(s.name, `${locale}:${sign.slug}`).toBeTruthy();
        expect(s.strengths, `${locale}:${sign.slug}`).toBeTruthy();
      }
    }
    expect(getLocalizedSign("aries", "en")?.name).toBe("Aries");
    expect(getLocalizedSign("gemeos", "fr")?.name).toBe("Gémeaux");
  });
  it("linhas de ajuda em crise para cada idioma", () => {
    expect(HELP_RESOURCES["pt-BR"].some((r) => r.contact.includes("188"))).toBe(true);
    expect(HELP_RESOURCES.en.some((r) => r.contact.includes("988"))).toBe(true);
    expect(HELP_RESOURCES.es.some((r) => r.contact.includes("024"))).toBe(true);
    expect(HELP_RESOURCES.fr.some((r) => r.contact.includes("3114"))).toBe(true);
    for (const locale of LOCALES) expect(crisisLinesForPrompt(locale).length).toBeGreaterThan(20);
  });
  it("datas por extenso no idioma da pessoa", () => {
    expect(formatBirthDate("1990-04-10", "pt-BR")).toBe("10 de abril de 1990");
    expect(formatBirthDate("1990-04-10", "en")).toBe("April 10, 1990");
    expect(formatBirthDate("1990-04-10", "fr")).toBe("10 avril 1990");
    expect(accessMessage(messagesFor("en"), "daily_limit")).toContain("5");
  });
});

describe("Prompts no idioma da pessoa", () => {
  it("o português mantém o protocolo do CVV", () => {
    const prompt = agentSystemPrompt(getAgent("seneca")!, user, { locale: "pt-BR" });
    expect(prompt).toContain("português do Brasil");
    expect(prompt).toContain("CVV (ligue 188");
  });
  it("cada idioma pede a resposta no idioma certo e traz as linhas de ajuda dele", () => {
    const en = agentSystemPrompt(getAgent("seneca")!, user, { locale: "en", risk: true });
    expect(en).toContain("responda sempre em inglês (English)");
    expect(en).toContain("988");
    expect(en).toContain("Quem você é nesta conversa: Seneca");
    const fr = maestroSystemPrompt(user, { locale: "fr", areaSlug: "negocios" });
    expect(fr).toContain("francês (français)");
    expect(fr).toContain("3114");
    expect(fr).toContain("seneca: Sénèque");
    const es = synthesisSystemPrompt(user, { locale: "es" });
    expect(es).toContain("**Dónde coinciden**");
    expect(memorySystem("en")).toContain("## Who they are");
  });
  it("as respostas simuladas seguem o idioma", () => {
    const system = agentSystemPrompt(getAgent("seneca")!, user, { locale: "en" });
    expect(mockReply(system, [{ role: "user", content: "hello" }], "en")).toContain("Simulated reply from Seneca");
  });
});

describe("Cadastro por idioma", () => {
  const base = {
    name: "Alex Doe",
    email: "alex@example.com",
    password: "12345678",
    birthDate: "1990-04-10",
    zodiacSign: "aries",
    consent: "on",
  };
  it("no Brasil o CPF é obrigatório", () => {
    const schema = signupSchema(messagesFor("pt-BR").validation, { requireCpf: true });
    const missing = schema.safeParse(base);
    expect(missing.success).toBe(false);
    expect(missing.error?.issues[0].message).toBe("CPF inválido. Confira os números.");
    const ok = schema.safeParse({ ...base, cpf: "529.982.247-25", timeZone: "America/Sao_Paulo" });
    expect(ok.success && ok.data.cpf).toBe("52998224725");
  });
  it("nos outros idiomas o CPF é ignorado e as mensagens vêm traduzidas", () => {
    const schema = signupSchema(messagesFor("en").validation, { requireCpf: false });
    const ok = schema.safeParse({ ...base, cpf: "123", timeZone: "Europe/London" });
    expect(ok.success && ok.data).toMatchObject({ cpf: null, timeZone: "Europe/London" });
    const bad = schema.safeParse({ ...base, email: "nope", timeZone: "Lua/Crateras" });
    expect(bad.error?.issues[0].message).toBe(messagesFor("en").validation.email);
    const tz = schema.safeParse({ ...base, timeZone: "Lua/Crateras" });
    expect(tz.success && tz.data.timeZone).toBe("America/Sao_Paulo");
  });
});
