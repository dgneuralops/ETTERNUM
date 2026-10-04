import { AGENTS, MAESTRO, type Agent } from "@/lib/domain/agents";
import type { Locale } from "../config";
import en from "./agents.en";
import es from "./agents.es";
import fr from "./agents.fr";

/**
 * Textos de vitrine de cada mente (nome, título, foco, frase e época) nos outros idiomas.
 * A `persona` continua em português: ela orienta o modelo, que responde no idioma da pessoa.
 */
export type AgentText = Pick<Agent, "title" | "focus" | "tagline"> & { name?: string; era?: string };

const TRANSLATIONS: Record<Exclude<Locale, "pt-BR">, Record<string, AgentText>> = { en, es, fr };

/** Converte as datas em português ("c. 470–399 a.C.", "nascido em 1958") para o idioma escolhido. */
export function localizeEra(era: string, locale: Locale): string {
  switch (locale) {
    case "en":
      return era
        .replace(/\ba\.C\./g, "BC")
        .replace(/\bd\.C\./g, "AD")
        .replace(/\bnascid[oa] em\b/g, "born");
    case "es":
      return era
        .replace(/\ba\.C\./g, "a. C.")
        .replace(/\bd\.C\./g, "d. C.")
        .replace(/\bnascido em\b/g, "nacido en")
        .replace(/\bnascida em\b/g, "nacida en");
    case "fr":
      return era
        .replace(/\bc\. /g, "v. ")
        .replace(/\ba\.C\./g, "av. J.-C.")
        .replace(/\bd\.C\./g, "apr. J.-C.")
        .replace(/\bnascido em\b/g, "né en")
        .replace(/\bnascida em\b/g, "née en");
    default:
      return era;
  }
}

export function localizeAgent(agent: Agent, locale: Locale): Agent {
  if (locale === "pt-BR") return agent;
  const text = TRANSLATIONS[locale][agent.slug];
  if (!text) return agent;
  return {
    ...agent,
    name: text.name ?? agent.name,
    title: text.title,
    focus: text.focus,
    tagline: text.tagline,
    era: text.era ?? localizeEra(agent.era, locale),
  };
}

export function localizeAgents(agents: Agent[], locale: Locale): Agent[] {
  return agents.map((a) => localizeAgent(a, locale));
}

/** Para testes: lista as mentes sem tradução e as traduções que sobraram. */
export function agentTranslationProblems(): string[] {
  const problems: string[] = [];
  const slugs = new Set([...AGENTS, MAESTRO].map((a) => a.slug));
  for (const [locale, table] of Object.entries(TRANSLATIONS)) {
    for (const slug of slugs) if (!table[slug]?.title) problems.push(`${locale}: falta ${slug}`);
    for (const slug of Object.keys(table)) if (!slugs.has(slug)) problems.push(`${locale}: sobra ${slug}`);
  }
  return problems;
}
