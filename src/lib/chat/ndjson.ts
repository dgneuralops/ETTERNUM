/** Eventos enviados pelas rotas de conversa, um JSON por linha. */
export type ChatEvent =
  | { type: "meta"; conversationId: string; risk: boolean }
  | { type: "start"; agent: string }
  | { type: "delta"; agent: string; text: string }
  | { type: "replace"; agent: string; text: string }
  | { type: "end"; agent: string; messageId: string }
  | { type: "error"; message: string; reason?: string }
  | { type: "done" };

export function ndjsonResponse(run: (send: (event: ChatEvent) => void) => Promise<void>): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let open = true;
      const send = (event: ChatEvent) => {
        if (!open) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          open = false;
        }
      };
      try {
        await run(send);
      } catch (error) {
        console.error(error);
        send({ type: "error", message: "Algo deu errado ao gerar a resposta. Tente novamente em instantes." });
      } finally {
        send({ type: "done" });
        open = false;
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

/** Lê um stream NDJSON no navegador, chamando onEvent para cada linha. */
export async function readNdjson(response: Response, onEvent: (event: ChatEvent) => void): Promise<void> {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) onEvent(JSON.parse(line) as ChatEvent);
      newline = buffer.indexOf("\n");
    }
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer) as ChatEvent);
}
