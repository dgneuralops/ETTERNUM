// Etternum content and theme tokens (ported from the Claude Design prototype's etternum-data.js).

const themes = {
  dark: {
    name: 'dark', bg: '#0B0B0C', panel: '#121214', card: '#161618', card2: '#1F1F22', card3: '#2A2A2E', ink: '#F3EFE6', muted: '#A7A197', faint: '#8A847A',
    line: 'rgba(255,255,255,.08)', line2: 'rgba(255,255,255,.14)', accent: '#E0C78E', accentHi: '#EBD6A6', onAccent: '#14110A', accentText: '#E0C78E',
    accentSoft: 'rgba(224,199,142,.14)', accentLine: 'rgba(224,199,142,.38)', pillBg: 'rgba(224,199,142,.16)', pillFg: '#E0C78E',
    navBg: '#E0C78E', navFg: '#14110A', altBg: '#F3EFE6', altFg: '#0B0B0C', track: '#26262A', glass: 'rgba(11,11,12,.78)',
    hero: 'radial-gradient(520px 280px at 0% 50%,rgba(224,199,142,.16),transparent 70%),#161618', heroInk: '#F3EFE6', heroMuted: '#A7A197', heroInput: '#232326', heroLine: 'rgba(255,255,255,.12)',
    danger: '#F28B82', dangerInk: '#F6B1AA', dangerBg: '#1E1312', dangerCard: '#2A1918', shadow: '0 30px 60px -30px rgba(0,0,0,.8)',
    pastel: ['#EAD9AE', '#D9CCF5', '#F2C9D2', '#C9DDF5', '#CFE5C3', '#F3D2B8'], pastelInk: '#15130E', themeIcon: 'sun',
  },
  light: {
    name: 'light', bg: '#F2EEE6', panel: '#FFFFFF', card: '#FFFFFF', card2: '#F7F4EE', card3: '#E9E3D7', ink: '#17150F', muted: '#5F584B', faint: '#6F685B',
    line: 'rgba(23,21,15,.09)', line2: 'rgba(23,21,15,.16)', accent: '#E0C78E', accentHi: '#EBD6A6', onAccent: '#17150F', accentText: '#7E6127',
    accentSoft: '#F3E9D2', accentLine: 'rgba(158,124,58,.45)', pillBg: '#F1E6CC', pillFg: '#6E5420',
    navBg: '#17150F', navFg: '#F2EEE6', altBg: '#17150F', altFg: '#F2EEE6', track: '#E1DACB', glass: 'rgba(242,238,230,.82)',
    hero: 'radial-gradient(520px 280px at 0% 50%,rgba(224,199,142,.28),transparent 70%),#17150F', heroInk: '#F3EFE6', heroMuted: '#B9B2A5', heroInput: '#2A271F', heroLine: 'rgba(255,255,255,.16)',
    danger: '#B4473E', dangerInk: '#9E3A32', dangerBg: '#FBEAE7', dangerCard: '#F6DAD5', shadow: '0 24px 48px -28px rgba(60,45,20,.35)',
    pastel: ['#EFE0B9', '#E3D9F7', '#F6D6DD', '#D6E5F7', '#DCEBD2', '#F6DFCB'], pastelInk: '#15130E', themeIcon: 'moon',
  },
};

const areas = [
  ['vida-interior', 'Vida Interior & Autoconhecimento', 'Vida Interior', 'Ansiedade, propósito, identidade e equilíbrio emocional.', 'brain', '#C9A7FF', 18, 1],
  ['luto', 'Luto, Memória & Legado', 'Luto & Legado', 'Perdas, finitude e o que permanece de nós.', 'infinity', '#E0C78E', 8, 0],
  ['relacionamentos', 'Relacionamentos & Conexões', 'Relacionamentos', 'Amor, família, solidão e perdão.', 'heart', '#F2A7B8', 13, 2],
  ['negocios', 'Negócios & Liderança', 'Negócios', 'Decidir, liderar, empreender e inovar.', 'briefcase', '#F0C36D', 11, 5],
  ['filosofia', 'Filosofia & Sabedoria', 'Filosofia', 'Propósito, escolhas e como viver bem.', 'landmark', '#9EC5F5', 21, 3],
  ['espiritualidade', 'Espiritualidade & Fé', 'Espiritualidade', 'Fé, silêncio, perdão e paz interior.', 'sparkles', '#D8C4FF', 13, 1],
  ['conhecimento', 'Conhecimento & Educação', 'Conhecimento', 'Aprender, estudar, criar e ensinar.', 'book-open', '#8FD9B6', 12, 4],
  ['sociedade', 'Sociedade & História', 'Sociedade', 'O mundo, o poder e as lições do passado.', 'scroll-text', '#F3A977', 10, 5],
  ['astrologia', 'Astrologia & Cosmos', 'Astrologia', 'Seu signo, os astros e o seu modo de ser.', 'moon', '#B9A6F2', 4, 1],
  ['corpo', 'Corpo & Bem-estar', 'Corpo', 'Alimentação, sono, hábitos e vitalidade.', 'leaf', '#A4DD8C', 4, 4],
].map(([slug, name, short, phrase, icon, color, n, p]) => ({ slug, name, short, phrase, icon, color, n, p }));

const M = (slug, name, spec, period, quote, ar, inspired, role) => ({ slug, name, spec, period, quote, areas: ar, inspired: !!inspired, role: role || '' });
const minds = [
  M('jung', 'Carl Gustav Jung', 'Psicologia · Autoconhecimento', '1875–1961', 'Conhecer a própria sombra para se tornar inteiro.', ['vida-interior', 'espiritualidade', 'astrologia'], 0, 'Psiquiatra, fundador da psicologia analítica'),
  M('drucker', 'Peter Drucker', 'Gestão · Negócios estratégicos', '1909–2005', 'Fazer as coisas certas, não só fazer as coisas certo.', ['negocios', 'conhecimento'], 0, 'Pai da administração moderna'),
  M('seneca', 'Sêneca', 'Filosofia estoica · Decisão de vida', 'c. 4 a.C.–65 d.C.', 'Serenidade, tempo e coragem diante da adversidade.', ['filosofia', 'luto', 'vida-interior'], 0, 'Filósofo estoico romano'),
  M('arendt', 'Hannah Arendt', 'Filosofia política · Liberdade', '1906–1975', 'Pensar por conta própria e agir no mundo.', ['filosofia', 'sociedade'], 0, 'Filósofa política'),
  M('rumi', 'Rumi', 'Espiritualidade · Amor profundo', '1207–1273', 'O amor como caminho; a ferida como porta da luz.', ['espiritualidade', 'relacionamentos'], 0, 'Poeta e místico sufi'),
  M('christensen', 'Clayton Christensen', 'Inovação disruptiva · Estratégia', '1952–2020', 'Que trabalho o seu cliente contrata você para fazer?', ['negocios'], 0, 'Professor de Harvard, teórico da inovação'),
  M('jobs', 'Steve Jobs', 'Criatividade · Liderança e produto', '1955–2011', 'Foco, simplicidade e a interseção entre tecnologia e humanidade.', ['negocios', 'conhecimento'], 0, 'Cofundador da Apple'),
  M('duckworth', 'Angela Duckworth', 'Resiliência · Performance pessoal', 'nascida em 1970', 'Paixão e perseverança para objetivos de longo prazo.', ['vida-interior', 'conhecimento', 'negocios'], 1, 'Psicóloga, pesquisadora de garra'),
  M('collins', 'Jim Collins', 'Estratégia empresarial · Construção de legado', 'nascido em 1958', 'De boa a excelente: disciplina, pessoas certas e legado.', ['negocios'], 1, 'Pesquisador de gestão'),
  M('nietzsche', 'Friedrich Nietzsche', 'Filosofia existencial · Autenticidade', '1844–1900', 'Tornar-se quem você é, com coragem.', ['filosofia', 'vida-interior'], 0, 'Filósofo alemão'),
  M('beauvoir', 'Simone de Beauvoir', 'Existencialismo · Liberdade feminina', '1908–1986', 'Liberdade, autenticidade e o direito de se inventar.', ['filosofia', 'relacionamentos', 'sociedade'], 0, 'Filósofa existencialista'),
  M('watts', 'Alan Watts', 'Consciência · Presença', '1915–1973', 'A sabedoria da insegurança e a arte de estar presente.', ['espiritualidade', 'vida-interior'], 0, 'Filósofo e escritor'),
  M('kant', 'Immanuel Kant', 'Filosofia moral · Razão', '1724–1804', 'Ousar saber e agir com dignidade.', ['filosofia'], 0, 'Filósofo do Iluminismo'),
  M('frankl', 'Viktor Frankl', 'Sentido da vida · Psicologia', '1905–1997', 'Encontrar sentido mesmo no sofrimento.', ['vida-interior', 'luto', 'filosofia'], 0, 'Psiquiatra, criador da Logoterapia'),
  M('peterson', 'Jordan Peterson', 'Responsabilidade · Estrutura psíquica', 'nascido em 1962', 'Assumir responsabilidade e colocar ordem no caos.', ['vida-interior', 'relacionamentos'], 1, 'Psicólogo clínico'),
  M('estes', 'Clarissa Pinkola Estés', 'Psicologia arquetípica · Narrativas femininas', 'nascida em 1945', 'Mitos e contos como remédio para a alma.', ['vida-interior', 'relacionamentos'], 1, 'Psicanalista junguiana'),
  M('mate', 'Gabor Maté', 'Trauma · Saúde mental', 'nascido em 1944', 'Não ‘por que o vício’, mas ‘por que a dor’.', ['vida-interior', 'corpo', 'relacionamentos'], 1, 'Médico, especialista em trauma'),
  M('bauman', 'Zygmunt Bauman', 'Sociologia · Modernidade líquida', '1925–2017', 'Entender os tempos líquidos para viver vínculos sólidos.', ['sociedade', 'relacionamentos'], 0, 'Sociólogo'),
  M('freire', 'Paulo Freire', 'Educação · Consciência crítica', '1921–1997', 'Educar é um ato de diálogo, amor e esperança.', ['conhecimento', 'sociedade'], 0, 'Educador brasileiro'),
  M('davis', 'Angela Davis', 'Justiça social · Direitos humanos', 'nascida em 1944', 'A liberdade é uma luta constante — e coletiva.', ['sociedade'], 1, 'Filósofa e ativista'),
  M('chomsky', 'Noam Chomsky', 'Linguística · Política · Mídia', 'nascido em 1928', 'Pensar criticamente sobre linguagem, poder e informação.', ['sociedade', 'conhecimento'], 1, 'Linguista'),
  M('jesus', 'Jesus de Nazaré', 'Ética · Amor e transformação', 'c. 4 a.C.–c. 30 d.C.', 'Amor ao próximo, perdão e transformação interior.', ['espiritualidade', 'relacionamentos', 'luto'], 1, 'Mestre espiritual'),
  M('dalai', 'Dalai Lama', 'Compaixão · Sabedoria interior', 'Tenzin Gyatso, nascido em 1935', 'Compaixão como caminho para a felicidade.', ['espiritualidade', 'vida-interior'], 1, 'Líder espiritual tibetano'),
  M('tolle', 'Eckhart Tolle', 'Presença · Despertar espiritual', 'nascido em 1948', 'O poder do agora.', ['espiritualidade', 'vida-interior'], 1, 'Mestre espiritual'),
  M('ramana', 'Sri Ramana Maharshi', 'Silêncio · Autoconhecimento', '1879–1950', 'Quem sou eu? A pergunta que aquieta a mente.', ['espiritualidade', 'vida-interior'], 0, 'Sábio indiano'),
  M('kubler', 'Elisabeth Kübler-Ross', 'Luto · Finitude', '1926–2004', 'Atravessar a perda, um passo de cada vez.', ['luto', 'vida-interior'], 0, 'Psiquiatra, pioneira em cuidados paliativos'),
  M('kepler', 'Johannes Kepler', 'Astronomia · Harmonia do cosmos', '1571–1630', 'Os céus como uma música que a razão pode ouvir.', ['astrologia', 'conhecimento'], 0, 'Astrônomo'),
  M('rudhyar', 'Dane Rudhyar', 'Astrologia humanista', '1895–1985', 'O mapa como semente do que você pode se tornar.', ['astrologia'], 0, 'Astrólogo e compositor'),
  M('ptolomeu', 'Cláudio Ptolomeu', 'Astronomia · Tetrabiblos', 'c. 100–170', 'Os astros inclinam, não obrigam.', ['astrologia'], 0, 'Astrônomo de Alexandria'),
  M('hipocrates', 'Hipócrates', 'Medicina · Equilíbrio do corpo', 'c. 460–370 a.C.', 'Que o seu alimento seja o seu remédio.', ['corpo'], 0, 'Médico grego'),
  M('epicuro', 'Epicuro', 'Prazeres simples · Vida boa', 'c. 341–270 a.C.', 'O prazer simples como base de uma vida feliz.', ['corpo', 'filosofia'], 0, 'Filósofo grego'),
];
const carousel = minds.slice(0, 25);
const bySlug = Object.fromEntries(minds.map(m => [m.slug, m]));
const areaBySlug = Object.fromEntries(areas.map(a => [a.slug, a]));
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const initials = name => name.replace(/^(Sri|Cláudio) /, '').split(' ').filter(w => w.length > 2 && !['de', 'da', 'do'].includes(w)).map(w => w[0]).slice(0, 2).join('');

// Portraits live in /public/portraits as WebP. Slugs in SM use the retouched `sm-` crop.
const photos = new Set(minds.map(m => m.slug));
const SM = new Set(['jung', 'epicuro', 'kepler', 'ramana', 'rumi', 'watts', 'davis', 'duckworth', 'chomsky', 'kant', 'seneca', 'nietzsche', 'arendt', 'peterson', 'estes', 'jobs', 'bauman']);
const photo = id => { const m = /^mind-([a-z]+)/.exec(id || ''); return m && photos.has(m[1]) ? `/portraits/${SM.has(m[1]) ? 'sm-' : ''}${m[1]}.webp` : ''; };

export const ETT = { photos, photo, themes, areas, minds, carousel, bySlug, areaBySlug, hexA, initials };
