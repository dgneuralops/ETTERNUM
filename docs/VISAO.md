# Etternum — visão do produto

> **Seu amigo pessoal eterno.** Um lugar para conversar, desabafar e se aconselhar com a sabedoria que a
> humanidade já produziu — e que lembra de você.

## O problema

As pessoas estão perdidas, solitárias, com a mente confusa e sobrecarregadas de estresse. Faltam espaços para
desabafar sem julgamento e para receber orientação de qualidade em todas as áreas da vida: emoções,
relacionamentos, trabalho, negócios, estudo, fé, corpo, luto.

## A solução

1. **Triagem** — a pessoa conta quem é: nome, e-mail, CPF, data de nascimento e signo, com o que trabalha, o que
   gosta e não gosta de fazer, suas maiores dificuldades, o que mais a estressa no dia, a maior causa de
   desgaste, o que gosta e não gosta de comer, o que busca e quais áreas da vida mais importam agora.
2. **O Maestro** — o amigo pessoal eterno. Conversa sobre qualquer coisa, acolhe, aconselha e, quando uma
   grande mente pode ajudar mais, encaminha a pessoa para ela com um toque, levando junto o que ela já contou.
   É também o orquestrador: quem não sabe com quem falar começa por ele.
3. **Áreas da vida** — cada área reúne suas grandes mentes (agentes especialistas). A pessoa pode:
   - conversar com uma mente específica;
   - abrir o **Conselho**: várias mentes respondem à mesma situação e o Maestro sintetiza pontos em comum,
     divergências e próximos passos;
   - pedir ao Maestro que escolha por ela.
4. **Quadro Eterno** — as mentes favoritas da pessoa, sempre à mão na tela inicial.
5. **Memória** — todo o histórico fica guardado, e o Etternum mantém um resumo vivo do que aprendeu sobre a
   pessoa. Todas as mentes recebem essa memória, então cada conversa começa de onde a vida dela está.
6. **Astrologia** — o signo (calculado pela data de nascimento) entra em todas as respostas como lente
   simbólica de temperamento; na área Astrologia & Cosmos, Urânia, Ptolomeu, Kepler e Hipátia aprofundam.

## Áreas da vida (ordenadas por urgência da dor)

| Área                             | Por que importa                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| Vida Interior & Autoconhecimento | ansiedade, propósito, identidade — dor imediata e alto apelo emocional             |
| Luto, Memória & Legado           | perdas e finitude — a dor mais profunda e a ponte para as Cápsulas de Memória Viva |
| Relacionamentos & Conexões       | solidão, amor, família, perdão                                                     |
| Negócios & Liderança             | a solidão de quem decide: estratégia, inovação, carreira                           |
| Filosofia & Sabedoria            | como viver bem, liberdade, sentido                                                 |
| Espiritualidade & Fé             | fé, silêncio, paz interior                                                         |
| Conhecimento & Educação          | aprender, estudar, criar                                                           |
| Sociedade & História             | o mundo, o poder e as lições do passado                                            |
| Astrologia & Cosmos              | o signo como linguagem de autoconhecimento                                         |
| Corpo & Bem-estar                | alimentação, sono, hábitos                                                         |

## As cápsulas

61 grandes mentes. As 25 do carrossel principal: Carl Jung, Peter Drucker, Sêneca, Hannah Arendt, Rumi,
Clayton Christensen, Steve Jobs, Angela Duckworth, Jim Collins, Nietzsche, Simone de Beauvoir, Alan Watts,
Immanuel Kant, Viktor Frankl, Jordan Peterson, Clarissa Pinkola Estés, Gabor Maté, Zygmunt Bauman, Paulo
Freire, Angela Davis, Noam Chomsky, Jesus de Nazaré, Dalai Lama, Eckhart Tolle e Sri Ramana Maharshi. As cinco
primeiras são as cápsulas do MVP original.

Há três tipos:

- **Recriação** (pessoas que já faleceram): fala em primeira pessoa, com a voz e as ideias do pensador.
- **Inspirado em** (pessoas vivas e figuras religiosas, como Jesus de Nazaré e o Dalai Lama): um especialista
  que domina a obra e fala _sobre_ as ideias da pessoa, nunca _como_ ela. Isso evita atribuir falas a quem está
  vivo e reduz riscos de direito de imagem/nome (Código Civil, arts. 18 e 20) e de ofensa religiosa.
- **Guias** do próprio Etternum: o Maestro e Urânia (astrologia).

Pessoas vivas que ficaram de fora até haver autorização: personalidades como Elon Musk. Para incluí-las como
recriação, é preciso licença; como "Inspirado em", vale o mesmo cuidado de não atribuir falas.

## Planos

| Plano    | Regra                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Teste    | 14 dias com acesso completo, a partir do cadastro                                                                             |
| Gratuito | depois do teste: 1 cápsula (a primeira usada ou a escolhida em `/plano`) + 5 mensagens por dia; o Maestro continua disponível |
| Premium  | tudo ilimitado, inclusive o Conselho                                                                                          |

Mensagens encaminhadas pelo Maestro não contam duas vezes no limite diário. O dia vira à meia-noite de Brasília.

## Roadmap

**Fase 1 — MVP web (este repositório)**: tudo o que está descrito acima, em quatro idiomas — português do
Brasil, inglês, espanhol e francês — para crescer além do Brasil desde o início (América Latina, Estados Unidos,
Europa e África francófona).

**Fase 2 — lançamento**

- Checkout do Premium (Stripe, Mercado Pago ou Whop, com Pix) e webhook para ativar o plano.
- Recuperação de senha e confirmação de e-mail (envio de e-mails) — ou migração da autenticação para o
  Supabase Auth, que já oferece isso e login com Google.
- Alimentar as cápsulas com obras em domínio público ou licenciadas (`conhecimento/README.md`).
- Revisão jurídica dos Termos e da Política de Privacidade; limites de uso por minuto contra abuso.
- Métricas de produto (ativação na triagem, retenção, conversão do teste).

**Fase 3 — Cápsulas de Memória Viva (Premium)**
Eternizar a si mesmo ou um ente querido: coleta profunda (biografia, valores, histórias, jeito de falar, fotos,
áudios e textos), criação da cápsula e conversa com familiares. Exige consentimento explícito da própria
pessoa (ou dos herdeiros), cuidado especial com o luto e controles de quem pode acessar cada cápsula.

**Fase 4 — apps nativos e novos canais**
App iOS/Android (React Native/Expo) usando as mesmas rotas de API, voz, WhatsApp e notificações ("como você
está hoje?").
