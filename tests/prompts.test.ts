import { describe, expect, it } from "vitest";
import {
  agentSystemPrompt,
  extractMindTags,
  maestroSystemPrompt,
  personaBlock,
  withKnowledge,
  type UserContext,
} from "@/lib/ai/prompts";
import { getAgent } from "@/lib/domain/agents";

const user: UserContext = {
  name: "Ana",
  birthDate: "1992-12-05",
  zodiacSign: "sagitario",
  memory: "",
  profile: {
    occupation: "Designer",
    likesToDo: "Dançar",
    dislikesToDo: "Planilhas",
    difficulties: "Ansiedade",
    dailyStressors: "Trânsito",
    biggestDrain: "Chefe exigente",
    likesToEat: "Açaí",
    dislikesToEat: "Fígado",
    goals: "Clareza",
    interestAreas: ["mente", "negocios"],
  },
};

describe("prompts", () => {
  it("cápsula histórica fala em primeira pessoa", () => {
    expect(personaBlock(getAgent("seneca")!)).toContain("Fale em primeira pessoa");
  });
  it("cápsula inspirada nunca fala como a pessoa", () => {
    const block = personaBlock(getAgent("gabor-mate")!);
    expect(block).toContain("Inspirada em Gabor Maté");
    expect(block).toContain("Você NÃO é Gabor Maté");
  });
  it("o contexto inclui perfil e signo, mas nunca CPF ou e-mail", () => {
    const prompt = agentSystemPrompt(getAgent("carl-jung")!, user);
    expect(prompt).toContain("Sagitário");
    expect(prompt).toContain("Designer");
    expect(prompt).toContain("Vida Interior & Autoconhecimento");
    expect(prompt).not.toMatch(/cpf|e-mail:/i);
    expect(prompt).toContain("CVV");
  });
  it("trechos das obras vão junto da mensagem do usuário", () => {
    const text = withKnowledge("Como lidar com a raiva?", getAgent("seneca")!, [
      { source: "Sobre a Ira, livro I", content: "texto" },
    ]);
    expect(text).toContain("<trechos_das_obras>");
    expect(text.endsWith("Como lidar com a raiva?")).toBe(true);
    expect(withKnowledge("oi", getAgent("seneca")!, [])).toBe("oi");
  });
  it("o Maestro conhece o catálogo e a área de origem", () => {
    const prompt = maestroSystemPrompt(user, { areaSlug: "negocios" });
    expect(prompt).toContain("amigo pessoal eterno");
    expect(prompt).toContain("peter-drucker: Peter Drucker");
    expect(prompt).toContain('a partir da área "Negócios & Liderança"');
  });
  it("extrai as recomendações do Maestro", () => {
    const out = extractMindTags("Converse com Frankl.\n\n[[mente:viktor-frankl]]\n[[mente:seneca]]\n[[mente:seneca]]");
    expect(out.text).toBe("Converse com Frankl.");
    expect(out.slugs).toEqual(["viktor-frankl", "seneca"]);
  });
});
