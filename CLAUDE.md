# Etternum — notas para agentes de código

- Toda a interface e todos os textos para o usuário são em português do Brasil.
- O visual vem de `design/project` (exportado do Claude Design). As telas em `src/screens` reproduzem esses protótipos; mantenha os estilos fiéis a eles.
- IA só no servidor (`server/`), nunca no bundle do app. A chave fica em `OPENROUTER_API_KEY`.
- Jev (`server/jev.js`) é um modelo de decisão: só responde perguntas `noul`/`choice`/`score` via `/api/alpha/decisions`. Nunca o use para gerar texto nem pelo `/chat/completions`. Limiares ficam no código, não nas perguntas.
- Mantenha o protocolo de segurança (CVV 188) nos prompts e a detecção de risco antes de cada resposta. Não envie CPF/e-mail aos modelos.
- Pessoas vivas e figuras religiosas são `inspired` em `src/data.js`: a cápsula fala sobre a pessoa, nunca como ela.
- Antes de concluir: `npm run build`.
