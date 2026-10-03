# Prompt para desenhar a interface do Etternum no Claude Design

Como usar:

1. Abra o Claude Design (claude.ai/design) e crie um projeto novo chamado **Etternum**.
2. Copie o bloco abaixo inteiro (botão de copiar no canto do bloco, no GitHub) e cole como primeira mensagem.
3. O próprio prompt pede que o trabalho seja feito em etapas. Se ele parar no meio, envie:
   _"Continue na próxima etapa da Ordem de trabalho, mantendo o mesmo design system."_
4. Quando terminar, siga a seção **Como trazer o design de volta** no fim deste arquivo.

```text
Você vai desenhar a interface completa do Etternum, uma plataforma web (e depois app iOS/Android) em português do Brasil. O produto já existe em código (Next.js + Tailwind) e funciona; o seu trabalho é elevar o design de todas as telas para um nível premium, mantendo as mesmas telas, conteúdos e fluxos descritos aqui, para que o design possa ser implementado fielmente depois.

==================================================
1. O QUE É O ETTERNUM
==================================================
"Seu amigo pessoal eterno." As pessoas estão perdidas, solitárias, com a mente confusa e sobrecarregadas. No Etternum, cada pessoa faz uma triagem sobre a própria vida e conversa com "cápsulas": recriações por inteligência artificial de grandes mentes da humanidade — filósofos, psicólogos, teólogos, historiadores e empresários — em todas as áreas da vida.

Peças centrais:
- MAESTRO: o amigo pessoal eterno da pessoa e orquestrador. Conversa sobre qualquer coisa, acolhe, aconselha, lembra de tudo o que ela já contou e, quando faz sentido, encaminha para a grande mente ideal com um botão "Continuar com [nome]". É o coração do produto e deve ter o maior destaque na tela inicial.
- CÁPSULAS: 61 grandes mentes. Recriações em 1ª pessoa de quem já faleceu (Sêneca, Jung, Frankl...). Pessoas vivas e figuras religiosas (Dalai Lama, Jesus de Nazaré, Gabor Maté...) são cápsulas "Inspirado em": um especialista que fala SOBRE as ideias da pessoa, nunca COMO ela — sempre exibem o selo "Inspirado em".
- ÁREAS DA VIDA: 10 áreas; em cada uma a pessoa conversa com uma mente, abre o Conselho ou pede ao Maestro que escolha por ela.
- CONSELHO: a pessoa escolhe até 4 mentes de uma área, conta uma situação, cada mente responde em um card e o Maestro escreve uma síntese ("Onde concordam", "Onde divergem", "Próximos passos").
- QUADRO ETERNO: as mentes favoritas da pessoa (estrela), sempre à mão na tela inicial.
- MEMÓRIA: o Etternum guarda o histórico e um resumo vivo do que aprendeu sobre a pessoa; a pessoa pode ver e apagar.
- ASTROLOGIA: o signo (calculado pela data de nascimento) é uma lente simbólica nas respostas; a área Astrologia & Cosmos mostra um cartão do signo.
- PLANOS: teste grátis de 14 dias → depois, plano Gratuito (1 cápsula + 5 mensagens por dia) ou Premium (ilimitado, inclui o Conselho).
- EM BREVE (Premium): "Cápsula de Memória Viva" — eternizar a própria história ou a de um ente querido.

Público: adultos (18+) no Brasil, de 25 a 55 anos, em momentos de estresse, solidão, luto, dúvida de carreira ou busca de sentido; também empreendedores e líderes que "não têm com quem conversar". Muitos vão usar no celular, à noite.

==================================================
2. TOM E DIREÇÃO DE ARTE
==================================================
Sensação: um museu silencioso à noite, uma biblioteca antiga iluminada por velas, um amigo sábio que tem tempo para ouvir. Intelectual, elegante, acolhedor e moderno — nunca frio, nunca místico-brega, nunca "app de terapia" genérico.

Base obrigatória (identidade já aprovada pelo fundador):
- Fundo preto/grafite muito escuro; textos em branco suave; detalhes em DOURADO SUAVE #E0C78E.
- Cards em VIDRO JATEADO (glassmorphism sutil: fundo translúcido, borda fina, blur).
- Tipografia serifada elegante para títulos + sans-serif limpa para textos.
- Animações suaves e discretas nos botões e na entrada dos elementos.

Pode e deve elevar: hierarquia, ritmo vertical, texturas sutis (grão, mármore escuro, linhas douradas finas, constelações), ilustrações abstratas, microinterações, estados vazios bonitos. O símbolo da marca é um infinito (∞) em traço dourado.

PROIBIDO:
- Fotos ou retratos realistas de pessoas reais (direitos de imagem). Use, para cada mente, um "retrato" em monograma: iniciais em serifa dourada sobre um medalhão circular em tom sépia/bronze escuro, com leve vinheta. Você pode criar padrões abstratos por área (cor da área), mas nada que pareça uma foto da pessoa.
- Estética de horóscopo de revista, neon, emojis como ícones, gradientes arco-íris.

==================================================
3. DESIGN SYSTEM (entregue primeiro, como página própria)
==================================================
Ponto de partida (tokens do código atual — pode refinar, mas mantenha os NOMES dos tokens para facilitar a implementação):
- bg #0A0A0B · graphite #141417 · graphite-2 #1C1C21
- line rgba(255,255,255,0.09) · line-strong rgba(224,199,142,0.35)
- ink #F3EFE6 (texto principal) · muted #A7A197 (texto secundário) · faint #6F6A62 (terciário)
- gold #E0C78E · gold-strong #CFAE64 · danger #F28B82
- Cores de destaque por área (ícone e detalhes): Vida Interior #C9A7FF · Luto, Memória & Legado #E0C78E · Relacionamentos #F2A7B8 · Negócios #F0C36D · Filosofia #9EC5F5 · Espiritualidade #D8C4FF · Conhecimento #8FD9B6 · Sociedade #F3A977 · Astrologia #B9A6F2 · Corpo #A4DD8C
- Fontes (Google Fonts): títulos EB Garamond (normal e itálico); textos Inter. Se propuser outra serifada, ela PRECISA renderizar perfeitamente os acentos do português (ê, ã, ç, õ, í) — a Cormorant Garamond foi descartada porque desalinha o "ê".
- Espaçamento em múltiplos de 4px. Raios: 12, 16, 24 e 32px (cards grandes 24–32px, botões 999px).
- Ícones: Lucide (traço fino). Ícones das áreas: Brain, Infinity, Heart, Briefcase, Landmark, Sparkles, BookOpen, ScrollText, Moon, Leaf.

Componentes a especificar (com todos os estados: padrão, hover, foco, pressionado, desabilitado, carregando, erro):
- Botões: primário dourado (gradiente suave, texto escuro), secundário fantasma (borda fina), ícone redondo, link.
- Campos: texto, e-mail, senha, CPF com máscara, data, select, textarea, checkbox, chips selecionáveis; rótulo, dica e mensagem de erro em vermelho suave.
- Card de vidro (base de tudo).
- Medalhão da mente (monograma) em 4 tamanhos: 36, 48, 80, 112px. O Maestro tem um medalhão próprio: dourado com o símbolo ∞.
- Selo "Inspirado em" (discreto, com tooltip: "Cápsula de um especialista nas ideias desta pessoa — não é uma simulação dela.").
- Card de mente (MindCard): medalhão, selo (se houver), nome em serifa, período de vida, rótulo de especialidade em dourado caixa-alta pequena (ex.: "PSICOLOGIA · AUTOCONHECIMENTO"), frase de uma linha, estrela de favorito, botão "Acessar esta mente" (ou "Disponível no Premium" quando bloqueado).
- Card de área (ícone na cor da área, nome em serifa, frase, "18 mentes").
- Carrossel horizontal com setas no desktop e arraste no celular.
- Balões de chat: mensagem da pessoa (direita, dourado translúcido) e resposta da mente (esquerda, com medalhão pequeno, texto com markdown: negrito em dourado, listas, citações).
- Indicador "pensando" (três pontos dourados pulsando) e resposta chegando em tempo real (streaming).
- Botão de recomendação do Maestro: card compacto com medalhão + "Continuar com Viktor Frankl" + especialidade.
- Aviso de crise (CVV): bloco em vermelho suave, acolhedor, com "Você não está sozinho(a). Se precisar de ajuda agora:" e a lista: Ligue 188 — CVV (gratuito, 24 horas, ou chat em cvv.org.br) · Ligue 192 — SAMU · Ligue 190 — Polícia · Ligue 180 — Central de Atendimento à Mulher.
- Bloqueio de plano (card com mensagem + "Conhecer o Premium" + "Falar com o Maestro").
- Chip de plano no topo ("Teste grátis · 14 dias", "Gratuito", "Premium") e botão "Fazer upgrade".
- Barra lateral (desktop), barra superior, barra inferior (celular, 5 itens), item de lista de conversa, abas/filtros, tooltip, toast, modal de confirmação, skeletons de carregamento, estados vazios.

==================================================
4. NAVEGAÇÃO
==================================================
Área logada:
- Desktop (≥1024px): barra lateral fixa à esquerda com logo e os itens: Início, Maestro, Áreas da vida, Todas as mentes, Minhas conversas, Perfil, Plano; "Sair" no rodapé. Barra superior com "Olá, [nome]", chip do plano e botão "Fazer upgrade".
- Celular: barra superior com logo e chip do plano; barra inferior com 5 itens: Início, Maestro, Áreas, Conversas, Perfil. Alvos de toque de no mínimo 44px; respeitar a área segura do iPhone.
Área pública: cabeçalho com logo, "Mentes", "Como funciona", "Entrar" e botão "Começar grátis"; rodapé com "Sobre o Etternum | Termos de Uso | Política de Privacidade", "© 2026 Etternum. Todos os direitos reservados." e o aviso: "O Etternum não substitui psicólogos, médicos ou outros profissionais. As cápsulas são recriações feitas por inteligência artificial a partir de ideias públicas e não representam as pessoas reais. Em crise, ligue 188 (CVV, 24 horas, gratuito)."

==================================================
5. TELAS (cada uma em DESKTOP 1440px e CELULAR 390px)
==================================================
Nomeie cada quadro com o número, o nome e a rota, ex.: "05 Início — /inicio — Desktop".

01 LANDING PAGE — /
- Faixa superior: "ETTERNUM · A INTELIGÊNCIA DAS MEMÓRIAS".
- Título: "Converse com Grandes Mentes. Cultive sua sabedoria na era da IA." (a segunda frase em itálico dourado).
- Subtítulo: "Cápsulas interativas de pensadores históricos — e um amigo pessoal eterno que conhece você, ouve sem julgamento e está sempre por perto para aconselhar."
- Botões: "Testar grátis por 14 dias" (primário) e "Entrar na lista de espera" (secundário).
- 3 pilares com ícone: Conexão com o Conhecimento · Interação Personalizada · Enriquecimento Pessoal.
- Carrossel "As cápsulas" com as 25 mentes da lista da seção 6 (cards de vidro, medalhão sépia, nome, especialidade, botão "Acessar esta mente").
- Seção do Maestro: "Seu amigo pessoal eterno." com explicação curta.
- "Como funciona" em 4 passos: Faça sua triagem → Converse com o Maestro → Escolha uma área ou uma mente → Abra o Conselho.
- Grade "Todas as áreas da vida" (10 áreas).
- Planos: Teste grátis (14 dias, acesso completo; depois 1 cápsula + 5 mensagens por dia) e Premium (todas as mentes sem limite, Conselho, memória completa, em breve Cápsula de Memória Viva).
- "Sobre o Etternum": "museu emocional vivo"; menção às futuras Cápsulas de Memória Viva.
- Lista de espera: "Entre para nossa lista de espera." / "Seja um dos primeiros a explorar o poder transformador das cápsulas de IA." / campos Nome e E-mail / botão "Entrar na lista de espera" / estado de sucesso "Pronto! Você está na lista de espera do Etternum."

02 CADASTRO — /cadastro
"Crie sua conta" / "14 dias grátis com acesso a todas as mentes." Campos: Nome, E-mail, Senha (dica "Pelo menos 8 caracteres."), CPF (máscara 000.000.000-00), Data de nascimento e Signo lado a lado (o signo é preenchido automaticamente pela data, com o símbolo, ex.: "♐ Sagitário"; texto auxiliar "O signo é preenchido pela data de nascimento; ajuste se preferir."), checkbox de consentimento ("Tenho 18 anos ou mais, li e aceito os Termos de Uso e a Política de Privacidade, e autorizo o tratamento dos meus dados — inclusive informações sobre meu bem-estar emocional — para personalizar minhas conversas."), botão "Criar conta e começar a triagem", link "Já tem conta? Entrar". Mostre também o estado com erros ("CPF inválido. Confira os números.", "Para continuar, aceite os termos e a política de privacidade.").

03 ENTRAR — /entrar
"Bem-vindo de volta" / "Suas mentes e o Maestro estão esperando por você." E-mail, Senha, "Entrar", erro "E-mail ou senha incorretos.", link "Ainda não tem conta? Cadastre-se grátis". (Reserve espaço para um futuro "Esqueci minha senha" e "Entrar com Google".)

04 TRIAGEM — /triagem (4 etapas com barra de progresso)
Abertura: "Prazer, [nome]." + "Para que as grandes mentes possam orientar você de verdade, conte um pouco sobre a sua vida... Já sabemos que você é de ♐ Sagitário."
- Etapa 1 "Sua rotina": Com o que você trabalha? · O que você gosta de fazer? · E o que você não gosta de fazer? (opcional)
- Etapa 2 "O que pesa": Quais são as suas maiores dificuldades hoje? · O que mais deixa você estressado(a) num dia? · Qual é a maior causa do seu desgaste?
- Etapa 3 "Sabores": O que você gosta de comer? · E o que você não gosta de comer?
- Etapa 4 "Seu caminho": O que você espera encontrar no Etternum? + seleção múltipla das áreas de interesse (10 chips com ícone).
Botões "Voltar", "Continuar" e, no fim, "Concluir triagem". Tom acolhedor, uma pergunta por vez no celular é bem-vinda.

05 INÍCIO — /inicio (o "lar" da pessoa)
- Saudação: "Boa noite, Ana" + chip do signo "♐ Sagitário".
- Título "Como você está hoje?" e um grande campo para falar com o Maestro: medalhão do Maestro, "O Maestro, seu amigo pessoal eterno, está ouvindo.", placeholder "Desabafe, pergunte, peça um conselho…", botão "Conversar".
- Card "Continuar de onde parei" (última conversa: mente + título).
- "Seu Quadro Eterno": mentes favoritas em medalhões grandes (e estado vazio explicando a estrela).
- "Áreas da vida": 6 primeiras, priorizando as áreas de interesse da triagem; link "Ver todas".
- "Grandes mentes": carrossel.
- Card "Em breve · Premium — Cápsula de Memória Viva".

06 MAESTRO — /maestro
Conversa com o Maestro. Cabeçalho com medalhão dourado, "Maestro", "Seu amigo pessoal eterno", botão "+" (nova conversa). Coluna direita no desktop com "Conversas com o Maestro". Mostre os estados: vazio (sugestões em chips: "Hoje eu só preciso desabafar." / "Estou confuso(a) e não sei por onde começar." / "Quem pode me ajudar com meu negócio?"), resposta chegando, e uma resposta com RECOMENDAÇÃO: texto do Maestro + card "Continuar com Viktor Frankl — Sentido da vida · Psicologia". Variante vinda de uma área: subtítulo "Vamos encontrar a mente ideal em Negócios & Liderança". Placeholder "Conte o que você está vivendo…". Rodapé do campo: "Cápsulas de IA podem errar. Não substituem profissionais de saúde. Em crise, ligue 188."

07 ÁREAS DA VIDA — /areas
Título, frase "Escolha a área do que você está vivendo...", grade com as 10 áreas.

08 ÁREA — /area/[slug] (exemplo: Negócios & Liderança)
Cabeçalho com ícone grande na cor da área, nome e descrição. Dois cards de ação: "Abrir o Conselho — Leve sua situação a várias mentes ao mesmo tempo." e "Não sabe com quem falar? — Conte ao Maestro, ele encaminha para a mente ideal." Grade "Mentes desta área" com MindCards (com estrela). Variante ASTROLOGIA & COSMOS: acrescente o cartão do signo da pessoa ("Seu signo solar · ♐ Sagitário · Elemento Fogo · Mutável · Regente: Júpiter" e quatro blocos: Forças, Desafios, Sob estresse, O que ajuda) — trate como uma peça especial, com céu estrelado sutil.

09 TODAS AS MENTES — /mentes
"Todas as mentes" / "61 cápsulas de grandes mentes da humanidade." Filtros em chips por área (rolagem horizontal no celular) e grade de MindCards. Mostre um card bloqueado ("Disponível no Premium").

10 CONVERSA COM UMA MENTE — /mente/[slug] (exemplo: Viktor Frankl)
Cabeçalho: medalhão, nome em serifa, "Psiquiatra, criador da Logoterapia · 1905–1997", ações: estrela (Quadro Eterno), "Encaminhar ao Maestro", "+" nova conversa. Coluna direita no desktop: "Conversas com Viktor" + botão "Encaminhar ao Maestro". Estados a desenhar: (a) vazio com sugestões; (b) conversa com várias mensagens e uma resposta longa com negrito e lista; (c) pensando/streaming; (d) AVISO DE CRISE no topo da conversa; (e) BLOQUEIO DO PLANO no lugar do campo ("No plano gratuito você conversa com uma cápsula. Faça upgrade para acessar todas as mentes."); (f) erro de conexão ("A conexão caiu. Tente enviar de novo."). Variante de uma cápsula "Inspirado em" (ex.: Gabor Maté) com o selo visível.

11 CONSELHO — /conselho/[area] (exemplo: Negócios & Liderança)
"CONSELHO" / título da área / "Escolha até 4 mentes, conte sua situação e receba a perspectiva de cada uma — e uma síntese do Maestro com próximos passos." Seleção de conselheiros em chips ("Conselheiros 3/4"), campo "Conte ao Conselho de Negócios & Liderança o que está acontecendo…". Resultado: a pergunta da pessoa, uma grade de cards (um por mente, com medalhão, nome, especialidade e resposta) e um card de destaque "Síntese do Maestro" com Onde concordam / Onde divergem / Próximos passos (1, 2, 3). Estados: respostas chegando em paralelo, rodadas anteriores, bloqueado no plano gratuito ("O Conselho com várias mentes é exclusivo do plano Premium."). Coluna "Conselhos anteriores".

12 MINHAS CONVERSAS — /conversas
"Minhas conversas" / "Tudo o que você conversou fica guardado aqui. Continue de onde parou." Lista com medalhão, rótulo (nome da mente ou "Conselho · [área]"), título, data/hora e lixeira (com confirmação). Estado vazio: "Você ainda não conversou com ninguém. Comece pelo Maestro."

13 PERFIL — /perfil
Seções em cards: "Seus dados" (nome, e-mail, CPF mascarado ***.982.247-**, nascimento e signo); "Sua triagem" (todas as respostas + botão "Atualizar"); "O que o Etternum lembra sobre você" (memória em tópicos: Quem é, Momento atual, Desafios em andamento, Preferências e valores, Progressos e decisões, Pontos de atenção + botão "Apagar memória"); "Seu Quadro Eterno"; "Conta" (Sair; "Excluir minha conta e todos os meus dados" com confirmação digitando EXCLUIR).

14 PLANO — /plano
Três variantes: TESTE ("Seu teste de 14 dias termina em 17 de outubro (14 dias restantes). Até lá, tudo está liberado."), GRATUITO ("Você usou 3 de 5 mensagens hoje. Sua cápsula do plano gratuito é Sêneca. O Maestro está sempre disponível.", com medidor de uso) e PREMIUM ("Acesso ilimitado a todas as mentes. Obrigado!"). Card Premium com benefícios e botão "Assinar o Premium". Grade "Cápsula do plano gratuito" para escolher a cápsula (estado escolhido).

15 TERMOS E PRIVACIDADE — /termos e /privacidade
Modelo de página de texto longo, confortável de ler, com títulos e um aviso "Rascunho — revisão jurídica pendente".

16 ESTADOS GLOBAIS
Página 404 ("Esta página se perdeu no tempo."), carregamento (skeletons dos cards e do chat), erro genérico, toasts de sucesso/erro, modal de confirmação.

17 (CONCEITO) CÁPSULA DE MEMÓRIA VIVA — Premium, em breve
Uma tela-conceito de apresentação: eternizar a própria história ou a de alguém que você ama (memórias, valores, jeito de falar, fotos e áudios), com tom delicado sobre luto e consentimento. Apenas visual, para validar a ideia.

==================================================
6. CONTEÚDO REAL PARA USAR NOS MOCKUPS
==================================================
Áreas (nome — frase — ícone — nº de mentes):
1. Vida Interior & Autoconhecimento — Ansiedade, propósito, identidade e equilíbrio emocional. — Brain — 18
2. Luto, Memória & Legado — Perdas, finitude e o que permanece de nós. — Infinity — 8
3. Relacionamentos & Conexões — Amor, família, solidão e perdão. — Heart — 13
4. Negócios & Liderança — Decidir, liderar, empreender e inovar. — Briefcase — 11
5. Filosofia & Sabedoria — Propósito, escolhas e como viver bem. — Landmark — 21
6. Espiritualidade & Fé — Fé, silêncio, perdão e paz interior. — Sparkles — 13
7. Conhecimento & Educação — Aprender, estudar, criar e ensinar. — BookOpen — 12
8. Sociedade & História — O mundo, o poder e as lições do passado. — ScrollText — 10
9. Astrologia & Cosmos — Seu signo, os astros e o seu modo de ser. — Moon — 4
10. Corpo & Bem-estar — Alimentação, sono, hábitos e vitalidade. — Leaf — 4

Carrossel (ordem fixa; nome — especialidade — período — frase; [I] = selo "Inspirado em"):
Carl Gustav Jung — Psicologia · Autoconhecimento — 1875–1961 — Conhecer a própria sombra para se tornar inteiro.
Peter Drucker — Gestão · Negócios estratégicos — 1909–2005 — Fazer as coisas certas, não só fazer as coisas certo.
Sêneca — Filosofia estoica · Decisão de vida — c. 4 a.C.–65 d.C. — Serenidade, tempo e coragem diante da adversidade.
Hannah Arendt — Filosofia política · Liberdade — 1906–1975 — Pensar por conta própria e agir no mundo.
Rumi — Espiritualidade · Amor profundo — 1207–1273 — O amor como caminho; a ferida como porta da luz.
Clayton Christensen — Inovação disruptiva · Estratégia — 1952–2020 — Que trabalho o seu cliente contrata você para fazer?
Steve Jobs — Criatividade · Liderança e produto — 1955–2011 — Foco, simplicidade e a interseção entre tecnologia e humanidade.
Angela Duckworth [I] — Resiliência · Performance pessoal — nascida em 1970 — Paixão e perseverança para objetivos de longo prazo.
Jim Collins [I] — Estratégia empresarial · Construção de legado — nascido em 1958 — De boa a excelente: disciplina, pessoas certas e legado.
Friedrich Nietzsche — Filosofia existencial · Autenticidade — 1844–1900 — Tornar-se quem você é, com coragem.
Simone de Beauvoir — Existencialismo · Liberdade feminina — 1908–1986 — Liberdade, autenticidade e o direito de se inventar.
Alan Watts — Consciência · Presença — 1915–1973 — A sabedoria da insegurança e a arte de estar presente.
Immanuel Kant — Filosofia moral · Razão — 1724–1804 — Ousar saber e agir com dignidade.
Viktor Frankl — Sentido da vida · Psicologia — 1905–1997 — Encontrar sentido mesmo no sofrimento.
Jordan Peterson [I] — Responsabilidade · Estrutura psíquica — nascido em 1962 — Assumir responsabilidade e colocar ordem no caos.
Clarissa Pinkola Estés [I] — Psicologia arquetípica · Narrativas femininas — nascida em 1945 — Mitos e contos como remédio para a alma.
Gabor Maté [I] — Trauma · Saúde mental — nascido em 1944 — Não 'por que o vício', mas 'por que a dor'.
Zygmunt Bauman — Sociologia · Modernidade líquida — 1925–2017 — Entender os tempos líquidos para viver vínculos sólidos.
Paulo Freire — Educação · Consciência crítica — 1921–1997 — Educar é um ato de diálogo, amor e esperança.
Angela Davis [I] — Justiça social · Direitos humanos — nascida em 1944 — A liberdade é uma luta constante — e coletiva.
Noam Chomsky [I] — Linguística · Política · Mídia — nascido em 1928 — Pensar criticamente sobre linguagem, poder e informação.
Jesus de Nazaré [I] — Ética · Amor e transformação — c. 4 a.C.–c. 30 d.C. — Amor ao próximo, perdão e transformação interior.
Dalai Lama [I] — Compaixão · Sabedoria interior — Tenzin Gyatso, nascido em 1935 — Compaixão como caminho para a felicidade.
Eckhart Tolle [I] — Presença · Despertar espiritual — nascido em 1948 — O poder do agora.
Sri Ramana Maharshi — Silêncio · Autoconhecimento — 1879–1950 — Quem sou eu? A pergunta que aquieta a mente.

Pessoa de exemplo: Ana Clara Souza, 33 anos, ♐ Sagitário, designer numa agência que faz freelas à noite; gosta de dançar, cozinhar e ler poesia; dificuldades: ansiedade, solidão e falta de rumo na carreira; come açaí e comida japonesa; não gosta de fígado. Conversa de exemplo com o Maestro: "Estou exausta e sem saber se continuo no meu emprego." → o Maestro acolhe e recomenda Viktor Frankl.

==================================================
7. REGRAS OBRIGATÓRIAS
==================================================
- Todo texto em português do Brasil, com acentuação correta.
- O aviso de crise (CVV 188) nunca pode parecer um anúncio: é acolhedor, claro e sempre legível.
- O selo "Inspirado em" é sempre visível nas cápsulas de pessoas vivas e figuras religiosas.
- Nenhuma foto realista de pessoa real; nenhuma promessa de "terapia" ou "cura".
- O Maestro é sempre a porta de entrada mais fácil quando a pessoa não sabe o que fazer.

==================================================
8. ACESSIBILIDADE E RESPONSIVIDADE
==================================================
- Contraste mínimo AA (atenção ao dourado sobre fundo escuro e ao texto "faint").
- Foco visível em todos os elementos interativos; alvos de toque ≥ 44px.
- Respeitar "reduzir movimento": animações viram fades curtos.
- Breakpoints: 390 (celular), 768 (tablet), 1024 (desktop pequeno), 1440 (desktop). Sem rolagem horizontal da página no celular (só dentro de carrosséis).
- Pense já no app nativo: no celular, a navegação inferior e os gestos devem parecer de app, não de site.

==================================================
9. ORDEM DE TRABALHO
==================================================
Trabalhe em etapas e me mostre cada uma antes de seguir:
1. Design system (tokens, tipografia, componentes e estados) em uma página "00 Design System".
2. Landing (01), Cadastro (02), Entrar (03) e Triagem (04).
3. Início (05), Maestro (06), Áreas (07), Área + variante Astrologia (08) e Todas as mentes (09).
4. Conversa com uma mente (10) com todos os estados e Conselho (11).
5. Conversas (12), Perfil (13), Plano (14), Termos (15), Estados globais (16) e o conceito da Cápsula de Memória Viva (17).
6. Protótipo navegável ligando o fluxo principal: Landing → Cadastro → Triagem → Início → Maestro → recomendação → Conversa com Viktor Frankl → Áreas → Negócios → Conselho → Perfil.

==================================================
10. ENTREGA PARA IMPLEMENTAÇÃO
==================================================
O design será implementado em Next.js + Tailwind CSS 4 + Lucide. Para facilitar:
- Mantenha os nomes dos tokens da seção 3 e documente qualquer token novo (cor, sombra, raio, blur, espaçamento, tamanho de fonte e altura de linha).
- Nomeie componentes como no código: Logo, AppShell, SideNav, BottomNav, MindAvatar, MindCard, KindBadge, AreaCard, MindCarousel, ChatView, CouncilView, CrisisBanner, FavoriteButton, TriageForm, SignupForm, LoginForm, WaitlistForm, ConversationList.
- Ao final, gere um resumo de handoff: lista de telas com rota, lista de componentes com variantes e estados, todos os tokens, e as animações (duração e curva).
```

## Como trazer o design de volta

Quando o Claude Design terminar:

1. Peça a ele: _"Gere o handoff para desenvolvimento: exporte o código/HTML das telas e o resumo de tokens e
   componentes."_ Se aparecer uma opção de exportar ou enviar para o **Claude Code**, use-a.
2. Me envie nesta conversa:
   - o **link do projeto** no Claude Design (com acesso de leitura);
   - o **arquivo exportado** (zip/HTML), se houver;
   - **prints de cada tela** (desktop e celular), principalmente se não houver exportação.
3. Eu implemento tela por tela nos componentes que já existem, mantendo rotas, regras de negócio e testes, e abro
   um pull request com prints de antes e depois para você aprovar.
