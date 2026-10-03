# Etternum — arquitetura

## Decisão: um único código em vez de Cursor + Lovable + n8n/Flowise

A ideia inicial era montar as telas no Cursor/Lovable, os fluxos dos agentes no n8n ou Flowise e o banco no
Supabase. Para este MVP, tudo ficou num único projeto Next.js, usando Supabase (ou qualquer Postgres) como banco:

| Ponto                                  | Ferramentas separadas                         | Um único código (escolhido)             |
| -------------------------------------- | --------------------------------------------- | --------------------------------------- |
| Maestro, Conselho, limites de plano    | fluxos visuais + chamadas HTTP entre serviços | funções TypeScript testadas (`src/lib`) |
| Streaming das respostas                | difícil atravessar n8n/Flowise                | nativo (NDJSON)                         |
| Dados sensíveis (saúde emocional, CPF) | passam por mais serviços                      | ficam no app e no banco                 |
| Custo e latência                       | um serviço a mais por mensagem                | uma chamada ao modelo                   |
| Versionamento e testes                 | fluxos fora do git                            | tudo no git, com testes                 |

O **Cursor** continua sendo uma ótima forma de editar este repositório (ele lê o `AGENTS.md`). O **Lovable**
não é necessário: as telas já existem aqui. O **n8n** pode entrar depois para automações de marketing (e-mails,
CRM, WhatsApp), lendo do mesmo banco.

## Visão geral

```
Navegador / app ──► Next.js (Vercel)
                     ├─ páginas (React Server Components)
                     ├─ server actions: cadastro, login, triagem, favoritos, conta, lista de espera
                     └─ rotas de API com streaming:
                          /api/chat      uma mente ou o Maestro
                          /api/council   várias mentes + síntese do Maestro
                          /api/handoff   Maestro encaminha a conversa para uma mente
                                │
                ┌───────────────┼──────────────────────┐
                ▼               ▼                      ▼
        Postgres (Supabase)   Claude (Anthropic)   Busca nos livros
        usuários, triagem,    respostas das         (texto completo em
        conversas, memória,   cápsulas, síntese,    português no próprio
        favoritos, livros     memória               Postgres)
```

## Fluxo de uma mensagem (`/api/chat`)

1. Valida a sessão (cookie HttpOnly assinado) e a mente.
2. Verifica o plano: teste → liberado; gratuito → 1 cápsula e 5 mensagens/dia (no fuso de Brasília);
   Premium → liberado. No plano gratuito, a primeira cápsula usada vira a cápsula liberada.
3. Salva a mensagem, marcando sinais de risco (suicídio, autolesão, violência).
4. Monta o prompt de sistema (ordem pensada para o cache de prompt):
   regras do Etternum (inclui o protocolo de segurança com CVV 188) → persona da mente → perfil da triagem +
   signo + memória → aviso de risco, quando houver.
5. Para cápsulas, busca até 4 trechos dos livros daquela mente e os anexa à última mensagem.
6. Faz streaming da resposta do Claude para o navegador e salva a resposta.
7. Depois da resposta, atualiza a memória de longo prazo a cada 3 mensagens (ou na primeira conversa).

O Maestro recebe o catálogo de mentes e, quando recomenda alguém, escreve `[[mente:slug]]`; a interface
transforma isso no botão "Continuar com …", que chama `/api/handoff` e abre a conversa com a mente já
respondendo à última mensagem da pessoa.

## Modelo de IA

- Claude, via SDK oficial `@anthropic-ai/sdk`. Modelo padrão `claude-opus-5-5`, configurável por
  `ETTERNUM_MODEL`. Esforço `medium` nas conversas, `low` nos conselheiros e na memória.
- `fallbacks: "default"`: se um classificador de segurança recusar uma mensagem, a API tenta automaticamente o
  modelo recomendado; se tudo recusar, a pessoa recebe uma resposta gentil.
- Cache de prompt automático para baratear conversas longas.
- Todo o acesso ao modelo fica em `src/lib/ai/claude.ts`; trocar de modelo ou provedor é mudar um arquivo.
- `ETTERNUM_AI_MOCK=1` gera respostas simuladas para desenvolvimento e testes.

## Dados (Postgres)

| Tabela             | Conteúdo                                                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `users`            | nome, e-mail, hash da senha, CPF (único), nascimento, signo, plano, fim do teste, cápsula gratuita, memória, consentimento |
| `profiles`         | respostas da triagem e áreas de interesse                                                                                  |
| `favorites`        | Quadro Eterno                                                                                                              |
| `conversations`    | conversa com uma mente, com o Maestro ou Conselho de uma área                                                              |
| `messages`         | mensagens (quem falou, sinal de risco, se foi encaminhada)                                                                 |
| `knowledge_chunks` | trechos dos livros por cápsula, com índice de busca em português                                                           |
| `waitlist`         | lista de espera da landing page                                                                                            |

Equivalências com o plano anterior: `onboarding_responses` → `profiles`; `capsule_interactions` →
`conversations` + `messages` (permite continuar de onde parou e montar o histórico); `personal_capsules` fica
para a fase das Cápsulas de Memória Viva.

As cápsulas e áreas estão em código (`src/lib/domain`), versionadas no git. Quando houver cápsulas pessoais
criadas por usuários, elas irão para uma tabela própria.

## Segurança e LGPD

- Senhas com bcrypt; sessão em cookie HttpOnly, `SameSite=Lax`, assinado (JWT HS256).
- Todas as consultas filtram pelo dono da conversa; as rotas revalidam sessão e plano no servidor.
- Consentimento específico para dados sensíveis no cadastro; idade mínima de 18 anos.
- CPF e e-mail **não** são enviados ao modelo; o CPF aparece mascarado no perfil.
- A pessoa pode apagar a memória, excluir conversas e excluir a conta (exclusão em cascata).

## Caminho para os apps nativos

As rotas `/api/chat`, `/api/council` e `/api/handoff` já recebem e devolvem JSON/NDJSON. Um app React Native
(Expo) pode reutilizá-las; falta apenas aceitar a sessão também por cabeçalho `Authorization` (o token já é um
JWT) e expor a triagem e o login como rotas de API.
