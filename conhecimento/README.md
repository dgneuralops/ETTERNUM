# Base de conhecimento das cápsulas

Cada cápsula pode ser alimentada com textos das obras do pensador. Antes de responder, o Etternum busca os
trechos mais relevantes para a mensagem da pessoa (busca em texto completo, em português) e os entrega à
cápsula junto com a pergunta. Assim, as respostas se apoiam no que o autor de fato escreveu.

## Como importar

1. Coloque os textos em `conhecimento/<slug-da-cápsula>/`, em `.txt` ou `.md` (esta pasta não vai para o git).
   Os slugs estão em `src/lib/domain/agents.ts` (ex.: `seneca`, `carl-jung`, `peter-drucker`, `rumi`).
2. PDF? Converta antes: `pdftotext -layout livro.pdf livro.txt` (pacote `poppler-utils`).
3. Importe, informando a obra, a edição e a licença:

```bash
npm run conhecimento:importar -- --mente seneca \
  --arquivo conhecimento/seneca/cartas-a-lucilio.txt \
  --fonte "Cartas a Lucílio — tradução de X (domínio público)"
```

Para reimportar a mesma obra sem duplicar, acrescente `--substituir`.

## Direitos autorais — leia antes de importar

Usar livros como base de um produto comercial exige direito de uso do texto:

- **Domínio público**: no Brasil, a obra entra em domínio público 70 anos após a morte do autor (contados a
  partir de 1º de janeiro do ano seguinte). Sêneca, Marco Aurélio, Epicteto, Platão, Aristóteles, Rumi,
  Agostinho e outros autores antigos estão em domínio público, **mas muitas traduções não estão** — a
  tradução tem direitos próprios. Prefira traduções antigas em domínio público ou licenciadas.
- **Autores do século XX** (Jung, Drucker, Arendt, Frankl, Fromm, Rogers, Beauvoir, Freire, Bauman e todos os
  vivos) ainda têm obras protegidas. Use edições licenciadas com as editoras ou espólios, ou escreva
  resumos e fichamentos próprios das ideias (ideias não têm direito autoral; o texto tem).
- Não use PDFs baixados sem licença.

Sempre registre em `--fonte` a obra, a edição e a licença: isso facilita auditorias e remoções.
