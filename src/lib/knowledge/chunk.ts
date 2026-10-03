/** Divide um texto em trechos de até `max` caracteres, respeitando parágrafos e frases. */
export function chunkText(text: string, max = 1500): string[] {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const pieces: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.length <= max) {
      pieces.push(paragraph);
      continue;
    }
    // Parágrafo grande: quebra por frases (e, em último caso, por tamanho).
    let current = "";
    for (const sentence of paragraph.match(/[^.!?…]+[.!?…]+["”»)]*\s*|[^.!?…]+$/g) ?? [paragraph]) {
      if ((current + sentence).length > max && current) {
        pieces.push(current.trim());
        current = "";
      }
      if (sentence.length > max) {
        for (let i = 0; i < sentence.length; i += max) pieces.push(sentence.slice(i, i + max).trim());
      } else {
        current += sentence;
      }
    }
    if (current.trim()) pieces.push(current.trim());
  }

  // Junta pedaços pequenos vizinhos até o limite.
  const chunks: string[] = [];
  for (const piece of pieces) {
    const last = chunks[chunks.length - 1];
    if (last && last.length + piece.length + 2 <= max) chunks[chunks.length - 1] = `${last}\n\n${piece}`;
    else chunks.push(piece);
  }
  return chunks;
}
