/** Tipos comuns a todos os provedores de IA. */

export type Effort = "low" | "medium" | "high";

/** Uma mensagem do histórico enviada ao modelo (o prompt de sistema vai à parte). */
export type ChatTurn = { role: "user" | "assistant"; content: string };

/** refused=true quando o provedor recusou responder (filtro de conteúdo ou segurança). */
export type StreamResult = { text: string; refused: boolean };

export type StreamOptions = {
  system: string;
  messages: ChatTurn[];
  effort: Effort;
  maxTokens?: number;
  onText: (delta: string) => void;
  signal?: AbortSignal;
};

export type CompleteOptions = {
  system: string;
  messages: ChatTurn[];
  effort: Effort;
  maxTokens?: number;
};
