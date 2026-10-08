import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { Overlay } from '../components/Overlay.jsx';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

const P = s => s.split('\n\n');
const SEED = [
 { id:'frankl', img:'/covers/em-busca-de-sentido.webp', title:'Em Busca de Sentido', author:'Viktor Frankl', cat:'Vida Interior', mins:14, color:'#1E2A3A', ink:'#E0C78E', status:'publicado', featured:true, progress:42, reads:1284,
   synopsis:'Psiquiatra e sobrevivente de quatro campos de concentração, Frankl descreve o que observou em quem resistia e em quem desistia. Dessa experiência nasce a logoterapia: a força mais profunda do ser humano é a busca por um sentido.',
   insights:[{t:'A última liberdade',d:'Tudo pode ser tirado de uma pessoa, exceto a escolha da atitude diante das circunstâncias.'},{t:'Sentido se descobre',d:'Frankl aponta três fontes: um trabalho ou obra, o encontro com alguém e a postura diante do sofrimento inevitável.'},{t:'O vazio existencial',d:'Tédio e apatia são sintomas de uma vida sem direção, e não de falta de distração.'},{t:'Responder à vida',d:'A pergunta não é o que esperamos da vida, mas o que a vida espera de nós em cada situação.'}],
   chapters:[{t:'Experiências no campo',body:'Frankl divide a vida no campo em três fases: o choque da chegada, a apatia que se instala como defesa e, depois da libertação, a difícil volta ao mundo.\n\nEle percebe que os prisioneiros que mantinham uma razão para viver, como reencontrar alguém ou terminar uma obra, suportavam melhor a fome e o frio do que os que perdiam a esperança.'},{t:'Os fundamentos da logoterapia',body:'A logoterapia parte de uma ideia simples: o ser humano é movido pela vontade de sentido. Quando ela é frustrada, surgem o vazio e a neurose.\n\nO terapeuta não entrega um sentido pronto. Ele ajuda a pessoa a enxergar as possibilidades de sentido presentes na própria vida.'},{t:'O otimismo trágico',body:'Dor, culpa e morte fazem parte de toda existência. Frankl propõe dizer sim à vida apesar delas.\n\nO sofrimento transforma-se em conquista, a culpa em mudança e a finitude em um convite à ação responsável.'}],
   quotes:[{q:'Quem tem um porquê para viver suporta quase qualquer como.',a:'Nietzsche, citado por Frankl'}] },
 { id:'habitos', img:'/covers/habitos-atomicos.jpg', title:'Hábitos Atômicos', author:'James Clear', cat:'Hábitos', mins:13, color:'#E0C78E', ink:'#14110A', status:'publicado', featured:false, progress:75, reads:2310,
   synopsis:'Pequenas melhorias, repetidas todos os dias, produzem resultados enormes ao longo do tempo. Clear apresenta um método prático para criar bons hábitos e abandonar os ruins.',
   insights:[{t:'1% melhor por dia',d:'Os resultados são um reflexo atrasado dos hábitos. A melhoria composta só aparece depois de um tempo.'},{t:'Identidade primeiro',d:'A mudança mais duradoura começa por quem você quer se tornar, e não pelo resultado que quer alcançar.'},{t:'As quatro leis',d:'Torne o hábito óbvio, atraente, fácil e satisfatório.'},{t:'Ambiente acima da força de vontade',d:'Desenhe o espaço ao seu redor para que a boa escolha seja a mais simples.'}],
   chapters:[{t:'O poder dos pequenos hábitos',body:'Melhorar 1% ao dia durante um ano rende algo perto de trinta e sete vezes melhor. O contrário também vale.\n\nSistemas importam mais que metas: vencedores e perdedores costumam ter as mesmas metas.'},{t:'Como construir hábitos melhores',body:'Todo hábito segue um ciclo de deixa, desejo, resposta e recompensa. Cada lei atua sobre uma dessas etapas.'}],
   quotes:[{q:'Você não sobe ao nível das suas metas. Você cai ao nível dos seus sistemas.',a:'James Clear'}] },
 { id:'seneca', img:'/covers/cartas-a-lucilio.jpg', title:'Cartas a Lucílio', author:'Sêneca', cat:'Filosofia', mins:11, color:'#6E2B22', ink:'#F3E6CF', status:'publicado', featured:false, progress:0, reads:846,
   synopsis:'Em cartas a um amigo, Sêneca reflete sobre tempo, amizade, medo e morte. Um guia estoico para viver com serenidade em meio ao caos.',
   insights:[{t:'O tempo é o único bem',d:'Perdemos a vida não por ser curta, mas por desperdiçá-la sem perceber.'},{t:'Sofremos mais na imaginação',d:'Grande parte do medo vem do que antecipamos, e não do que de fato acontece.'},{t:'Amizade verdadeira',d:'Escolha amigos que te tornem melhor, e seja esse amigo para alguém.'}],
   chapters:[{t:'Sobre o tempo',body:'Reivindique a posse de si mesmo. Guarde o tempo que até agora lhe era tirado ou escapava.\n\nNenhum dia deve passar sem que você aprenda algo que o ajude a enfrentar a morte e a pobreza.'}],
   quotes:[{q:'Não é que tenhamos pouco tempo, é que perdemos muito.',a:'Sêneca'}] },
 { id:'focado', title:'Trabalho Focado', author:'Cal Newport', cat:'Negócios', mins:12, color:'#F3EFE6', ink:'#14110A', status:'publicado', featured:false, progress:0, reads:1102,
   synopsis:'A capacidade de se concentrar sem distração está ficando rara e, por isso, mais valiosa. Newport mostra como treinar o foco como um músculo.',
   insights:[{t:'Trabalho profundo é raro',d:'Quem consegue se concentrar por longos períodos produz mais e aprende mais rápido.'},{t:'Abrace o tédio',d:'Resistir à distração em momentos ociosos fortalece o foco.'},{t:'Rituais de foco',d:'Defina onde, quando e por quanto tempo você vai trabalhar sem interrupções.'}],
   chapters:[{t:'A ideia',body:'Tarefas rasas são fáceis de reproduzir e criam pouco valor. O trabalho profundo cria valor novo e é difícil de copiar.'}],
   quotes:[{q:'Clareza sobre o que importa traz clareza sobre o que não importa.',a:'Cal Newport'}] },
 { id:'mindset', title:'Mindset', author:'Carol Dweck', cat:'Psicologia', mins:10, color:'#2F4A3A', ink:'#EAD9AE', status:'publicado', featured:false, progress:0, reads:932,
   synopsis:'A forma como você enxerga as próprias habilidades muda a forma como aprende, trabalha e se relaciona. Dweck compara a mentalidade fixa com a de crescimento.',
   insights:[{t:'Fixa ou de crescimento',d:'Quem acredita que pode se desenvolver encara o erro como informação, e não como sentença.'},{t:'Elogie o processo',d:'Elogiar o esforço e a estratégia forma pessoas mais resilientes do que elogiar o talento.'},{t:'O poder do ainda',d:'Trocar “não sei” por “ainda não sei” muda a relação com o desafio.'}],
   chapters:[{t:'As duas mentalidades',body:'Na mentalidade fixa, cada desafio é um teste de valor. Na de crescimento, é uma chance de aprender.'}],
   quotes:[] },
 { id:'kahneman', title:'Rápido e Devagar', author:'Daniel Kahneman', cat:'Psicologia', mins:16, color:'#3A2E5A', ink:'#F2C9D2', status:'publicado', featured:false, progress:0, reads:1540,
   synopsis:'Pensamos com dois sistemas: um rápido e intuitivo, outro lento e deliberado. Kahneman mostra como os atalhos do primeiro nos levam a erros previsíveis.',
   insights:[{t:'Sistema 1 e Sistema 2',d:'O primeiro decide quase tudo; o segundo só entra quando algo exige esforço.'},{t:'Ancoragem',d:'O primeiro número que ouvimos distorce todas as estimativas seguintes.'},{t:'Aversão à perda',d:'Perder dói cerca de duas vezes mais do que ganhar o mesmo valor.'}],
   chapters:[{t:'Dois sistemas',body:'O Sistema 1 opera de forma automática. O Sistema 2 é preguiçoso e muitas vezes apenas aprova o que o primeiro sugeriu.'}],
   quotes:[] },
 { id:'meditacoes', title:'Meditações', author:'Marco Aurélio', cat:'Filosofia', mins:9, color:'#2A2A2E', ink:'#E0C78E', status:'rascunho', featured:false, progress:0, reads:0,
   synopsis:'Notas pessoais de um imperador romano para si mesmo, sobre dever, impermanência e autocontrole.',
   insights:[{t:'O obstáculo é o caminho',d:'O que impede a ação se torna a própria ação.'}],
   chapters:[{t:'Livro I',body:''}], quotes:[] },
];
const CATS = ['Vida Interior','Filosofia','Hábitos','Negócios','Psicologia','Espiritualidade'];
const SW = [['#1E2A3A','#E0C78E'],['#6E2B22','#F3E6CF'],['#E0C78E','#14110A'],['#F3EFE6','#14110A'],['#2F4A3A','#EAD9AE'],['#3A2E5A','#F2C9D2'],['#2A2A2E','#E0C78E']];
const KEY = 'ett-clube-livro-v2';

export default class Clube extends React.Component {
  constructor(p) {
    super(p);
    let books = SEED;
    try { const s = localStorage.getItem(KEY); if (s) books = JSON.parse(s); } catch (e) {}
    const mode = p.mode || 'leitor';
    this.state = { mode, view: mode === 'admin' ? 'books' : 'lib', sel: 'frankl', chap: 0, q: '', cat: 'Todos', books, draft: null, hl: {}, fs: 21, toast: '', saved: { frankl: true }, stF: 'todos', authed: (() => { try { return sessionStorage.getItem('ett-admin') === '1'; } catch (e) { return false; } })(), lEmail: '', lPass: '', lErr: '' };
  }
  componentDidUpdate(pp) { if (pp.mode !== this.props.mode && this.props.mode) this.setState({ mode: this.props.mode, view: this.props.mode === 'admin' ? 'books' : 'lib' }); }
  componentWillUnmount() { clearTimeout(this.tt); }
  rootRef = el => { this.root = el; };
  top() { requestAnimationFrame(() => { window.scrollTo(0, 0); let n = this.root && this.root.parentElement; while (n) { const o = getComputedStyle(n).overflowY; if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) { n.scrollTop = 0; break; } n = n.parentElement; } }); }
  go = (o) => { this.setState(o); this.top(); };
  toast = m => { clearTimeout(this.tt); this.setState({ toast: m }); this.tt = setTimeout(() => this.setState({ toast: '' }), 2400); };
  persist(books) { this.setState({ books }); try { localStorage.setItem(KEY, JSON.stringify(books)); } catch (e) {} }
  upd = fn => this.setState(s => ({ draft: fn(JSON.parse(JSON.stringify(s.draft))) }));
  commit(status) {
    const d = { ...this.state.draft, status: status || this.state.draft.status, title: this.state.draft.title || 'Sem título' };
    let books = this.state.books.slice();
    if (d.featured) books = books.map(b => ({ ...b, featured: false }));
    const i = books.findIndex(b => b.id === d.id);
    if (i >= 0) books[i] = d; else books.unshift(d);
    this.persist(books);
    this.toast(status === 'publicado' ? 'Livro publicado' : 'Rascunho salvo');
    this.go({ view: 'books', draft: null });
  }
  vm(b) {
    return { ...b, glow: `radial-gradient(circle at 50% 62%, ${b.color}55, transparent 68%), #131315`, heroBg: `radial-gradient(800px 360px at 10% 0%, ${b.color}70, transparent 70%), #121214`,
      nIns: b.insights.length, nChap: b.chapters.length, progW: (b.progress || 0) + '%', progLabel: `${b.progress || 0}% lido`,
      readLabel: b.progress > 0 ? 'Continuar leitura' : 'Ler resumo',
      coverBg: b.img ? `url(${b.img}) center/cover no-repeat` : 'none',
      excerpt: (b.synopsis || '').split(/(?<=\.)\s/)[0],
      pagesFlat: b.insights.slice(0, 3).map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0') })),
      pages: b.insights.slice(0, 3).map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0'), tf: `translateX(${(i + 1) * 10}%) rotate(${(i + 1) * 4}deg)`, bg: ['#F6F0E3', '#EFE7D6', '#E7DDC9'][i] })).reverse(),
      open: () => this.go({ mode: 'leitor', view: 'book', sel: b.id }),
      read: () => this.go({ mode: 'leitor', view: 'read', sel: b.id, chap: 0 }) };
  }
  renderVals() {
    const s = this.state, books = s.books;
    const pub = books.filter(b => b.status === 'publicado');
    const isL = s.mode === 'leitor', isA = s.mode === 'admin';
    const seg = on => ({ bg: on ? '#E0C78E' : 'transparent', fg: on ? '#14110A' : '#A7A197' });
    const featB = pub.find(b => b.featured) || pub[0];
    const q = s.q.trim().toLowerCase();
    const grid = pub.filter(b => (s.cat === 'Todos' || b.cat === s.cat) && (!q || (b.title + ' ' + b.author).toLowerCase().includes(q))).map(b => this.vm(b));
    const curB = books.find(b => b.id === s.sel) || books[0];
    const cur = this.vm(curB);
    cur.insightsN = curB.insights.map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0') }));
    cur.chapList = curB.chapters.map((c, i) => ({ t: c.t, n: String(i + 1).padStart(2, '0'), go: () => this.go({ view: 'read', chap: i }) }));
    const ci = Math.min(s.chap, curB.chapters.length - 1);
    const chap = curB.chapters[ci] || { t: '', body: '' };
    const paras = P(chap.body || '').filter(Boolean).map((text, i) => {
      const k = `${curB.id}:${ci}:${i}`, on = !!s.hl[k];
      return { k, text, bg: on ? 'rgba(224,199,142,.16)' : 'transparent', ring: on ? 'inset 3px 0 0 #E0C78E' : 'none', toggle: () => this.setState(st => ({ hl: { ...st.hl, [k]: !st.hl[k] } })) };
    });
    const hlCount = Object.keys(s.hl).filter(k => s.hl[k] && k.startsWith(curB.id + ':')).length;
    const last = ci >= curB.chapters.length - 1;
    const saved = !!s.saved[curB.id];

    const emb = !!this.props.embedded, realAdmin = this.props.mode === 'admin';
    const vals = {
      rootRef: this.rootRef, embedded: emb,
      adminLogin: isA && !s.authed, adminIn: isA && s.authed, showBackAdmin: realAdmin && isL,
      lEmail: s.lEmail, lPass: s.lPass, lErr: s.lErr,
      setLEmail: e => this.setState({ lEmail: e.target.value, lErr: '' }), setLPass: e => this.setState({ lPass: e.target.value, lErr: '' }),
      login: e => { e.preventDefault(); if (!/.+@.+\..+/.test(s.lEmail) || s.lPass.length < 4) return this.setState({ lErr: 'Confira o e-mail e a senha.' }); try { sessionStorage.setItem('ett-admin', '1'); } catch (x) {} this.setState({ authed: true, lPass: '' }); this.toast('Bem-vindo ao admin'); },
      logout: () => { try { sessionStorage.removeItem('ett-admin'); } catch (x) {} this.go({ authed: false, view: 'books', draft: null }); }, standalone: !emb, rootMinH: emb ? '100%' : '100vh', rootRadius: emb ? '26px' : '0', headPos: emb ? 'relative' : 'sticky', readTop: emb ? '0px' : '69px', stickTop: emb ? '16px' : '90px',
      segL: seg(isL), segA: seg(isA), isAdmin: isA,
      vLib: isL && s.view === 'lib', vBook: isL && s.view === 'book', vRead: isL && s.view === 'read',
      goLib: () => this.go({ mode: 'leitor', view: 'lib' }), goLeitor: () => this.go({ mode: 'leitor', view: 'lib' }), goAdmin: () => this.go({ mode: 'admin', view: 'books', draft: null }),
      hasFeatured: !!featB, feat: featB ? this.vm(featB) : {},
      continueList: pub.filter(b => b.progress > 0).map(b => this.vm(b)), hasContinue: (this.props.showContinue ?? true) && pub.some(b => b.progress > 0),
      q: s.q, setQ: e => this.setState({ q: e.target.value }),
      catChips: ['Todos', ...CATS.filter(c => pub.some(b => b.cat === c))].map(k => ({ k, bg: s.cat === k ? '#F3EFE6' : 'transparent', fg: s.cat === k ? '#0B0B0C' : '#CFC8BC', ring: s.cat === k ? 'transparent' : 'rgba(255,255,255,.14)', go: () => this.setState({ cat: k }) })),
      grid, gridEmpty: grid.length === 0,
      cur, toggleSave: () => { this.setState(st => ({ saved: { ...st.saved, [curB.id]: !st.saved[curB.id] } })); this.toast(saved ? 'Removido da estante' : 'Salvo na sua estante'); },
      saveIcon: saved ? 'bookmark-check' : 'bookmark', saveLabel: saved ? 'Na sua estante' : 'Salvar na estante',
      chap, chapNum: ci + 1, paras, hlCount, fsPx: s.fs + 'px', readPct: Math.round(((ci + 1) / curB.chapters.length) * 100) + '%',
      fsUp: () => this.setState(st => ({ fs: Math.min(28, st.fs + 1) })), fsDown: () => this.setState(st => ({ fs: Math.max(16, st.fs - 1) })),
      backToBook: () => this.go({ view: 'book' }),
      noPrev: ci === 0, prevOp: ci === 0 ? '.4' : '1',
      prevChap: () => ci > 0 && this.go({ chap: ci - 1 }),
      nextChap: () => last ? (this.toast('Resumo concluído'), this.go({ view: 'book' })) : this.go({ chap: ci + 1 }),
      nextLabel: last ? 'Concluir' : 'Próximo capítulo',
      toast: s.toast,
      mapOpen: !!s.mapOpen, toggleMap: () => this.setState(st => ({ mapOpen: !st.mapOpen })),
      mapItems: [
        ['Biblioteca', '/clube', { mode: 'leitor', view: 'lib' }, isL && s.view === 'lib'],
        ['Livro', '/clube/livro', { mode: 'leitor', view: 'book', sel: 'frankl' }, isL && s.view === 'book'],
        ['Leitura', '/clube/ler', { mode: 'leitor', view: 'read', sel: 'frankl', chap: 0 }, isL && s.view === 'read'],
        ['Admin · Login', '/admin', { mode: 'admin', view: 'books', authed: false }, isA && !s.authed],
        ['Admin · Livros', '/admin/livros', { mode: 'admin', view: 'books', authed: true }, isA && s.authed && s.view === 'books'],
        ['Admin · Editor', '/admin/livro', { mode: 'admin', view: 'edit', authed: true, draft: JSON.parse(JSON.stringify(books[0])) }, isA && s.view === 'edit'],
        ['Admin · Materiais', '/admin/materiais', { mode: 'admin', view: 'media', authed: true }, isA && s.view === 'media'],
      ].concat(this.props.onExit ? [['← Voltar ao Etternum', '/', null, false]] : []).map(([label, path, st, on]) => ({ label, path, bg: on ? '#2A2A2E' : 'transparent', go: () => st ? this.go({ ...st, mapOpen: false }) : this.props.onExit() })),
    };

    if (isA) {
      const navI = [['books', 'Livros', 'book-open'], ['media', 'Materiais', 'image']];
      vals.adminNav = navI.map(([k, label, icon]) => { const on = s.view === k || (k === 'books' && s.view === 'edit'); return { k, label, icon, bg: on ? '#E0C78E' : 'transparent', fg: on ? '#14110A' : '#CFC8BC', go: () => this.go({ view: k, draft: null }) }; });
      vals.aBooks = s.view === 'books'; vals.aEdit = s.view === 'edit' && !!s.draft; vals.aMedia = s.view === 'media';
      vals.newBook = () => this.go({ view: 'edit', draft: { id: 'livro-' + Date.now(), title: '', author: '', cat: CATS[0], mins: 10, color: SW[0][0], ink: SW[0][1], status: 'rascunho', featured: false, progress: 0, reads: 0, synopsis: '', insights: [{ t: '', d: '' }], chapters: [{ t: '', body: '' }], quotes: [], isNew: true } });
      vals.stats = [
        { l: 'Publicados', v: pub.length, icon: 'circle-check' }, { l: 'Rascunhos', v: books.length - pub.length, icon: 'file-pen' },
        { l: 'Insights', v: books.reduce((a, b) => a + b.insights.length, 0), icon: 'lightbulb' }, { l: 'Leituras (30d)', v: books.reduce((a, b) => a + b.reads, 0).toLocaleString('pt-BR'), icon: 'trending-up' },
      ];
      vals.statusTabs = [['todos', 'Todos'], ['publicado', 'Publicados'], ['rascunho', 'Rascunhos']].map(([k, label]) => ({ k, label, bg: s.stF === k ? '#F3EFE6' : 'transparent', fg: s.stF === k ? '#0B0B0C' : '#A7A197', go: () => this.setState({ stF: k }) }));
      vals.rows = books.filter(b => s.stF === 'todos' || b.status === s.stF).map(b => {
        const p = b.status === 'publicado';
        return { ...b, nIns: b.insights.length, readsLabel: b.reads ? b.reads.toLocaleString('pt-BR') + ' leituras' : '—', stLabel: p ? 'Publicado' : 'Rascunho', stBg: p ? 'rgba(143,217,182,.14)' : 'rgba(255,255,255,.07)', stFg: p ? '#8FD9B6' : '#A7A197',
          edit: () => this.go({ view: 'edit', draft: JSON.parse(JSON.stringify(b)) }), preview: () => this.go({ mode: 'leitor', view: 'book', sel: b.id }) };
      });
      const d = s.draft;
      if (d) {
        const f = k => e => { const v = e.target.value; this.upd(x => { x[k] = k === 'mins' ? (+v || 0) : v; return x; }); };
        const listF = (key, i, k) => e => { const v = e.target.value; this.upd(x => { x[key][i][k] = v; return x; }); };
        const del = (key, i) => () => this.upd(x => { x[key].splice(i, 1); return x; });
        vals.d = { ...d, coverBg: d.img ? `url(${d.img}) center/cover no-repeat` : 'none', titleOr: d.title || 'Novo livro', nIns: d.insights.length, nChap: d.chapters.length };
        vals.editKicker = d.isNew ? 'Novo livro' : 'Editando livro';
        vals.on = { title: f('title'), author: f('author'), cat: f('cat'), mins: f('mins'), synopsis: f('synopsis') };
        vals.catOpts = CATS;
        vals.insRows = d.insights.map((r, i) => ({ ...r, k: i, n: String(i + 1).padStart(2, '0'), onT: listF('insights', i, 't'), onD: listF('insights', i, 'd'), del: del('insights', i), up: () => i > 0 && this.upd(x => { const a = x.insights; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return x; }) }));
        vals.chapRows = d.chapters.map((r, i) => ({ ...r, k: i, n: String(i + 1).padStart(2, '0'), onT: listF('chapters', i, 't'), onB: listF('chapters', i, 'body'), del: del('chapters', i) }));
        vals.quoteRows = d.quotes.map((r, i) => ({ ...r, k: i, onQ: listF('quotes', i, 'q'), onA: listF('quotes', i, 'a'), del: del('quotes', i) }));
        vals.addIns = () => this.upd(x => { x.insights.push({ t: '', d: '' }); return x; });
        vals.addChap = () => this.upd(x => { x.chapters.push({ t: '', body: '' }); return x; });
        vals.addQuote = () => this.upd(x => { x.quotes.push({ q: '', a: '' }); return x; });
        vals.coverSlotId = 'clube-capa-' + d.id;
        vals.setCover = url => this.upd(x => { if (url) x.img = url; else delete x.img; return x; });
        vals.swatches = SW.map(([c, ink]) => ({ c, ring: d.color === c ? '0 0 0 2px #121214, 0 0 0 4px #E0C78E' : 'inset 0 0 0 1px rgba(255,255,255,.18)', pick: () => this.upd(x => { x.color = c; x.ink = ink; return x; }) }));
        vals.statusOpts = [['rascunho', 'Rascunho'], ['publicado', 'Publicado']].map(([k, label]) => ({ k, label, bg: d.status === k ? '#E0C78E' : 'transparent', fg: d.status === k ? '#14110A' : '#A7A197', go: () => this.upd(x => { x.status = k; return x; }) }));
        vals.featTrack = d.featured ? '#E0C78E' : '#2A2A2E'; vals.featJustify = d.featured ? 'flex-end' : 'flex-start';
        vals.toggleFeat = () => this.upd(x => { x.featured = !x.featured; return x; });
        vals.saveDraft = () => this.commit();
        vals.publish = () => this.commit('publicado');
        vals.delBook = () => { this.persist(books.filter(b => b.id !== d.id)); this.toast('Livro excluído'); this.go({ view: 'books', draft: null }); };
      }
      vals.mediaSlots = ['Banner do clube', 'Encontro do mês', 'Autor em destaque', 'Ilustração de capítulo', 'Imagem livre', 'Imagem livre', 'Imagem livre', 'Imagem livre'].map((ph, i) => ({ id: 'clube-media-' + (i + 1), ph }));
      vals.files = [{ n: 'Guia de discussão — Em Busca de Sentido.pdf', meta: 'PDF · 1,2 MB · enviado em 28 set', icon: 'file-text' }, { n: 'Áudio do encontro de setembro.mp3', meta: 'Áudio · 38 MB · enviado em 21 set', icon: 'headphones' }, { n: 'Calendário de leituras 2026.pdf', meta: 'PDF · 340 KB · enviado em 2 set', icon: 'calendar' }];
      vals.fakeUpload = () => this.toast('Selecione um arquivo para enviar');
    }
    return vals;
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div ref={v.rootRef} style={{ minHeight: v.rootMinH, background: "#0B0B0C", color: "#F3EFE6", fontFamily: "Urbanist,system-ui,sans-serif", borderRadius: v.rootRadius, overflow: "clip" }}>
        <header style={{ position: v.headPos, top: "0", zIndex: "30", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", padding: v.embedded ? "14px clamp(16px,4vw,40px)" : "calc(14px + env(safe-area-inset-top)) clamp(16px,4vw,40px) 14px", background: "rgba(11,11,12,.84)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <button onClick={v.goLib} style={{ display: "flex", alignItems: "center", gap: "10px", border: "0", background: "transparent", color: "#F3EFE6", cursor: "pointer", padding: "0" }}>
            {v.standalone ? (
              <>
                <Icon n={"infinity"} s={"24"} c={"#E0C78E"} />
                <span style={{ font: "800 14px Urbanist", letterSpacing: ".22em" }}>
                  ETTERNUM
                </span>
                <span style={{ color: "#5A554D", fontSize: "18px" }}>
                  /
                </span>
              </>
            ) : null}
            {v.embedded ? (
              <>
                <Icon n={"library"} s={"20"} c={"#E0C78E"} />
              </>
            ) : null}
            <span style={{ font: "italic 400 21px 'EB Garamond',serif", color: "#E0C78E" }}>
              Clube do Livro
            </span>
          </button>
          <span style={{ flex: "1" }}></span>
          {v.showBackAdmin ? (
            <>
              <button onClick={v.goAdmin} style={{ height: "36px", padding: "0 16px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 13px Urbanist", display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                <Icon n={"arrow-left"} s={"15"} />
                Voltar ao admin
              </button>
            </>
          ) : null}
          {v.adminIn ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ font: "600 13px Urbanist", color: "#8A847A" }}>
                  Administrador
                </span>
                <button onClick={v.logout} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: "#1A1A1C", color: "#F3EFE6", font: "600 13px Urbanist", display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                  <Icon n={"log-out"} s={"15"} />
                  Sair
                </button>
              </div>
            </>
          ) : null}
        </header>
        {v.vLib ? (
          <>
            <main data-screen-label={"Biblioteca"} style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(24px,4vw,48px) clamp(16px,4vw,40px) 96px", display: "flex", flexDirection: "column", gap: "64px", animation: "ccIn .45s both" }}>
              {v.hasFeatured ? (
                <>
                  <section style={{ position: "relative", overflow: "hidden", borderRadius: "32px", background: v.feat?.heroBg, padding: "clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", gap: "clamp(28px,3.5vw,40px)" }}>
                    <div style={{ display: "flex", gap: "clamp(24px,4vw,48px)", alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ flex: "none", width: "clamp(130px,15vw,180px)", containerType: "inline-size" }}>
                        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", borderRadius: "3px 9px 9px 3px", background: v.feat?.color, color: v.feat?.ink, padding: "13% 11%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 36px 60px -26px rgba(0,0,0,.95)" }}>
                          {v.feat?.img ? (
                            <>
                              <span style={{ position: "absolute", inset: "0", zIndex: "5", background: v.feat?.coverBg }}></span>
                            </>
                          ) : null}
                          <span style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "5%", zIndex: "6", background: "linear-gradient(90deg,rgba(0,0,0,.35),rgba(255,255,255,.12) 60%,transparent)" }}></span>
                          <span style={{ font: "700 5cqw Urbanist", letterSpacing: ".2em", textTransform: "uppercase", opacity: ".75" }}>
                            {v.feat?.cat}
                          </span>
                          <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "15cqw", lineHeight: "1" }}>
                            {v.feat?.title}
                          </span>
                          <span style={{ font: "600 6cqw Urbanist" }}>
                            {v.feat?.author}
                          </span>
                        </div>
                      </div>
                      <div style={{ flex: "1 1 380px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "8px", font: "700 12px Urbanist", letterSpacing: ".16em", textTransform: "uppercase", color: "#E0C78E" }}>
                          <Icon n={"sparkles"} s={"14"} />
                          Leitura do mês · Outubro
                        </span>
                        <h1 style={{ margin: "0", font: "400 clamp(36px,4.4vw,56px)/1 'EB Garamond',serif", letterSpacing: "-.01em", textWrap: "balance" }}>
                          {v.feat?.title}
                        </h1>
                        <span style={{ font: "500 15px Urbanist", color: "#A7A197" }}>
                          {"por "}{v.feat?.author}{" · "}{v.feat?.mins}{" min · "}{v.feat?.nIns}{" insights · "}{v.feat?.nChap}{" capítulos"}
                        </span>
                        <p style={{ margin: "4px 0 0", maxWidth: "620px", font: "400 16px/1.6 Urbanist", color: "#CFC8BC", textWrap: "pretty" }}>
                          {v.feat?.synopsis}
                        </p>
                      </div>
                      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: "10px", alignSelf: "center" }}>
                        <button onClick={v.feat?.read} style={{ height: "50px", padding: "0 26px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 15px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", whiteSpace: "nowrap" }} className="club-h1">
                          Começar a ler
                          <Icon n={"arrow-right"} s={"17"} />
                        </button>
                        <button onClick={v.feat?.open} style={{ height: "50px", padding: "0 24px", borderRadius: "999px", border: "0", background: "rgba(255,255,255,.07)", color: "#F3EFE6", font: "700 15px Urbanist", cursor: "pointer", whiteSpace: "nowrap" }} className="club-h2">
                          Ver o livro
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              ) : null}
              {v.hasContinue ? (
                <>
                  <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h2 style={{ margin: "0", font: "700 24px Urbanist", letterSpacing: "-.01em" }}>
                      Continue lendo
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,340px),1fr))", gap: "14px" }}>
                      {(v.continueList || []).map((b, $index) => (
                        <Fragment key={$index}>
                          <button key={b?.id} onClick={b?.read} style={{ display: "flex", gap: "18px", alignItems: "center", padding: "16px", borderRadius: "20px", border: "0", background: "#131315", color: "#F3EFE6", textAlign: "left", cursor: "pointer", transition: "background .2s" }} className="club-h3">
                            <div style={{ flex: "none", width: "64px", containerType: "inline-size" }}>
                              <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", borderRadius: "3px 7px 7px 3px", background: b?.color, color: b?.ink, padding: "12%", display: "flex", alignItems: "center", boxShadow: "0 14px 24px -12px rgba(0,0,0,.9),inset 4px 0 0 rgba(0,0,0,.18)" }}>
                                {b?.img ? (
                                  <>
                                    <span style={{ position: "absolute", inset: "0", zIndex: "5", background: b?.coverBg }}></span>
                                  </>
                                ) : null}
                                <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "17cqw", lineHeight: "1" }}>
                                  {b?.title}
                                </span>
                              </div>
                            </div>
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                              <span style={{ font: "700 16px Urbanist" }}>
                                {b?.title}
                              </span>
                              <span style={{ font: "500 13px Urbanist", color: "#A7A197" }}>
                                {b?.author}{" · "}{b?.progLabel}
                              </span>
                              <span style={{ height: "4px", borderRadius: "2px", background: "#26262A", overflow: "hidden", marginTop: "6px" }}>
                                <span style={{ display: "block", height: "100%", width: b?.progW, background: "#E0C78E", borderRadius: "2px" }}></span>
                              </span>
                            </div>
                            <Icon n={"play"} s={"18"} c={"#E0C78E"} />
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </section>
                </>
              ) : null}
              <section style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h2 style={{ margin: "0", font: "700 24px Urbanist", letterSpacing: "-.01em" }}>
                      Biblioteca
                    </h2>
                    <span style={{ font: "500 14px Urbanist", color: "#A7A197" }}>
                      As ideias centrais de cada livro, em minutos.
                    </span>
                  </div>
                  <label style={{ flex: "0 1 340px", height: "46px", borderRadius: "999px", background: "#161618", display: "flex", alignItems: "center", gap: "10px", padding: "0 18px", color: "#8A847A" }}>
                    <Icon n={"search"} s={"17"} />
                    <input value={v.q ?? ''} onChange={v.setQ} placeholder={"Buscar livro ou autor"} style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", outline: "none", color: "#F3EFE6", font: "500 15px Urbanist" }} />
                  </label>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {(v.catChips || []).map((c, $index) => (
                    <Fragment key={$index}>
                      <button key={c?.k} onClick={c?.go} style={{ height: "38px", padding: "0 16px", borderRadius: "999px", border: "0", background: c?.bg, color: c?.fg, font: "600 14px Urbanist", cursor: "pointer" }}>
                        {c?.k}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,250px),1fr))", gap: "14px" }}>
                  {(v.grid || []).map((b, $index) => (
                    <Fragment key={$index}>
                      <article key={b?.id} style={{ borderRadius: "26px", background: "#141416", padding: "8px 8px 16px", display: "flex", flexDirection: "column", gap: "14px", transition: "transform .3s cubic-bezier(.25,.1,.25,1)" }} className="club-h4">
                        <button onClick={b?.open} aria-label={b?.title} style={{ position: "relative", height: "300px", border: "0", padding: "0", borderRadius: "20px", overflow: "hidden", background: b?.glow, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: "52%", containerType: "inline-size" }}>
                            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", borderRadius: "3px 8px 8px 3px", background: b?.color, color: b?.ink, padding: "13% 11%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 28px 40px -18px rgba(0,0,0,.95)" }}>
                              {b?.img ? (
                                <>
                                  <span style={{ position: "absolute", inset: "0", zIndex: "5", background: b?.coverBg }}></span>
                                </>
                              ) : null}
                              <span style={{ font: "700 6cqw Urbanist", letterSpacing: ".2em", textTransform: "uppercase", opacity: ".7" }}>
                                {b?.cat}
                              </span>
                              <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "15cqw", lineHeight: "1" }}>
                                {b?.title}
                              </span>
                              <span style={{ font: "600 6.5cqw Urbanist", opacity: ".85" }}>
                                {b?.author}
                              </span>
                            </div>
                          </div>
                          <span style={{ position: "absolute", left: "10px", top: "10px", height: "26px", padding: "0 11px", borderRadius: "999px", background: "rgba(11,11,12,.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#E0C78E", font: "700 11px Urbanist", letterSpacing: ".04em", display: "flex", alignItems: "center" }}>
                            {b?.cat}
                          </span>
                        </button>
                        <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: "6px", flex: "1" }}>
                          <h3 style={{ margin: "0", font: "700 19px/1.2 Urbanist", letterSpacing: "-.01em" }}>
                            {b?.title}
                          </h3>
                          <span style={{ font: "500 13px Urbanist", color: "#8A847A" }}>
                            {b?.author}
                          </span>
                          <p style={{ margin: "4px 0 0", font: "italic 400 17px/1.35 'EB Garamond',serif", color: "#A7A197", flex: "1", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {b?.excerpt}
                          </p>
                          <div style={{ display: "flex", gap: "16px", marginTop: "6px", font: "600 12.5px Urbanist", color: "#A7A197" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Icon n={"clock"} s={"14"} c={"#E0C78E"} />
                              {b?.mins}{" min"}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Icon n={"lightbulb"} s={"14"} c={"#E0C78E"} />
                              {b?.nIns}{" insights"}
                            </span>
                          </div>
                          <button onClick={b?.open} style={{ marginTop: "12px", height: "44px", borderRadius: "999px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "700 14px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", transition: "background .2s" }} className="club-h5">
                            {b?.readLabel}
                          </button>
                        </div>
                      </article>
                    </Fragment>
                  ))}
                </div>
                {v.gridEmpty ? (
                  <>
                    <div style={{ padding: "56px 20px", borderRadius: "22px", background: "#161618", textAlign: "center", color: "#A7A197", font: "500 15px Urbanist" }}>
                      Nenhum livro encontrado para essa busca.
                    </div>
                  </>
                ) : null}
              </section>
            </main>
          </>
        ) : null}
        {v.vBook ? (
          <>
            <main data-screen-label={"Livro"} style={{ maxWidth: "1160px", margin: "0 auto", padding: "clamp(20px,3vw,36px) clamp(16px,4vw,40px) 96px", display: "flex", flexDirection: "column", gap: "36px", animation: "ccIn .45s both" }}>
              <button onClick={v.goLib} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", height: "40px", padding: "0 16px 0 12px", borderRadius: "999px", border: "0", background: "#161618", color: "#A7A197", font: "600 14px Urbanist", cursor: "pointer" }}>
                <Icon n={"arrow-left"} s={"16"} />
                Biblioteca
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: "clamp(28px,5vw,64px)", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", maxWidth: "340px", justifySelf: "center", width: "100%" }}>
                  <div style={{ width: "100%", padding: "40px 0", borderRadius: "28px", background: v.cur?.glow, display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "62%", containerType: "inline-size" }}>
                      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", borderRadius: "5px 12px 12px 5px", background: v.cur?.color, color: v.cur?.ink, padding: "13% 11%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 40px 60px -26px rgba(0,0,0,.95),inset 7px 0 0 rgba(0,0,0,.18)" }}>
                        {v.cur?.img ? (
                          <>
                            <span style={{ position: "absolute", inset: "0", zIndex: "5", background: v.cur?.coverBg }}></span>
                          </>
                        ) : null}
                        <span style={{ font: "700 5cqw Urbanist", letterSpacing: ".2em", textTransform: "uppercase", opacity: ".7" }}>
                          {v.cur?.cat}
                        </span>
                        <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "15cqw", lineHeight: "1" }}>
                          {v.cur?.title}
                        </span>
                        <span style={{ font: "600 6cqw Urbanist", opacity: ".85" }}>
                          {v.cur?.author}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={v.cur?.read} style={{ width: "100%", height: "52px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 15px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }} className="club-h6">
                    <Icon n={"book-open"} s={"17"} />
                    {v.cur?.readLabel}
                  </button>
                  <button onClick={v.toggleSave} style={{ width: "100%", height: "48px", borderRadius: "999px", border: "0", background: "#161618", color: "#F3EFE6", font: "700 14px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
                    <Icon n={v.saveIcon} s={"16"} c={"#E0C78E"} />
                    {v.saveLabel}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "36px", minWidth: "0" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <span style={{ font: "700 12px Urbanist", letterSpacing: ".18em", textTransform: "uppercase", color: "#E0C78E" }}>
                      {v.cur?.cat}
                    </span>
                    <h1 style={{ margin: "0", font: "400 clamp(40px,5.5vw,62px)/1.02 'EB Garamond',serif", textWrap: "balance" }}>
                      {v.cur?.title}
                    </h1>
                    <span style={{ font: "500 16px Urbanist", color: "#A7A197" }}>
                      {"por "}{v.cur?.author}{" · "}{v.cur?.mins}{" min · "}{v.cur?.nIns}{" insights"}
                    </span>
                    <p style={{ margin: "8px 0 0", font: "400 18px/1.65 Urbanist", color: "#CFC8BC", textWrap: "pretty", maxWidth: "640px" }}>
                      {v.cur?.synopsis}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <h2 style={{ margin: "0", font: "700 20px Urbanist" }}>
                      Ideias principais
                    </h2>
                    {(v.cur?.insightsN || []).map((it, $index) => (
                      <Fragment key={$index}>
                        <div key={it?.n} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "20px", padding: "24px 0", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                          <span style={{ font: "400 30px/1 'EB Garamond',serif", color: "#E0C78E", minWidth: "34px" }}>
                            {it?.n}
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <span style={{ font: "700 17px Urbanist" }}>
                              {it?.t}
                            </span>
                            <span style={{ font: "400 15.5px/1.6 Urbanist", color: "#A7A197", textWrap: "pretty" }}>
                              {it?.d}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {(v.cur?.quotes || []).map((qt, $index) => (
                    <Fragment key={$index}>
                      <figure style={{ margin: "0", padding: "34px clamp(22px,4vw,44px)", borderRadius: "26px", background: "radial-gradient(400px 200px at 0% 0%,rgba(224,199,142,.14),transparent 70%),#121214", display: "flex", flexDirection: "column", gap: "16px" }}>
                        <Icon n={"quote"} s={"30"} c={"#E0C78E"} />
                        <blockquote style={{ margin: "0", font: "italic 400 clamp(24px,3vw,30px)/1.3 'EB Garamond',serif", textWrap: "pretty" }}>
                          {qt?.q}
                        </blockquote>
                        <figcaption style={{ font: "600 14px Urbanist", color: "#A7A197" }}>
                          {"— "}{qt?.a}
                        </figcaption>
                      </figure>
                    </Fragment>
                  ))}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h2 style={{ margin: "0 0 4px", font: "700 20px Urbanist" }}>
                      Capítulos
                    </h2>
                    {(v.cur?.chapList || []).map((c, $index) => (
                      <Fragment key={$index}>
                        <button key={c?.n} onClick={c?.go} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 0", border: "0", borderTop: "1px solid rgba(255,255,255,.07)", background: "transparent", color: "#F3EFE6", textAlign: "left", cursor: "pointer" }} className="club-h7">
                          <span style={{ font: "700 13px Urbanist", color: "#8A847A", minWidth: "24px" }}>
                            {c?.n}
                          </span>
                          <span style={{ flex: "1", font: "600 16px Urbanist" }}>
                            {c?.t}
                          </span>
                          <Icon n={"chevron-right"} s={"17"} c={"#8A847A"} />
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : null}
        {v.vRead ? (
          <>
            <main data-screen-label={"Leitura"} style={{ animation: "ccIn .45s both" }}>
              <div style={{ position: "sticky", top: v.readTop, zIndex: "20", background: "rgba(11,11,12,.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
                <div style={{ maxWidth: "760px", margin: "0 auto", padding: "12px clamp(16px,4vw,24px)", display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={v.backToBook} aria-label={"Voltar"} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "#161618", color: "#F3EFE6", display: "grid", placeItems: "center", cursor: "pointer" }}>
                    <Icon n={"arrow-left"} s={"17"} />
                  </button>
                  <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                    <span style={{ font: "700 14px Urbanist", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {v.cur?.title}
                    </span>
                    <span style={{ font: "500 12px Urbanist", color: "#8A847A" }}>
                      {"Capítulo "}{v.chapNum}{" de "}{v.cur?.nChap}{" · "}{v.hlCount}{" destaques"}
                    </span>
                  </div>
                  <button onClick={v.fsDown} aria-label={"Diminuir texto"} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "#161618", color: "#F3EFE6", font: "500 14px 'EB Garamond',serif", cursor: "pointer" }}>
                    A
                  </button>
                  <button onClick={v.fsUp} aria-label={"Aumentar texto"} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "#161618", color: "#F3EFE6", font: "500 20px 'EB Garamond',serif", cursor: "pointer" }}>
                    A
                  </button>
                </div>
                <div style={{ height: "2px", background: "#1F1F22" }}>
                  <div style={{ height: "100%", width: v.readPct, background: "#E0C78E", transition: "width .4s" }}></div>
                </div>
              </div>
              <article style={{ maxWidth: "680px", margin: "0 auto", padding: "56px clamp(20px,5vw,24px) 120px", display: "flex", flexDirection: "column", gap: "26px" }}>
                <span style={{ font: "700 12px Urbanist", letterSpacing: ".18em", textTransform: "uppercase", color: "#E0C78E" }}>
                  {"Capítulo "}{v.chapNum}
                </span>
                <h1 style={{ margin: "-12px 0 8px", font: "400 clamp(36px,5vw,48px)/1.08 'EB Garamond',serif", textWrap: "balance" }}>
                  {v.chap?.t}
                </h1>
                <span style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px Urbanist", color: "#8A847A" }}>
                  <Icon n={"highlighter"} s={"15"} />
                  Toque em um parágrafo para destacar
                </span>
                {(v.paras || []).map((p, $index) => (
                  <Fragment key={$index}>
                    <p key={p?.k} onClick={p?.toggle} style={{ margin: "0 -14px", padding: "6px 14px", borderRadius: "10px", fontFamily: "'EB Garamond',serif", fontSize: v.fsPx, lineHeight: "1.65", color: "#E8E2D6", background: p?.bg, boxShadow: p?.ring, cursor: "pointer", textWrap: "pretty", transition: "background .2s" }}>
                      {p?.text}
                    </p>
                  </Fragment>
                ))}
                <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", marginTop: "32px", paddingTop: "28px", borderTop: "1px solid rgba(255,255,255,.08)", flexWrap: "wrap" }}>
                  <button onClick={v.prevChap} disabled={v.noPrev} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "0", background: "#161618", color: "#F3EFE6", font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", opacity: v.prevOp }}>
                    <Icon n={"arrow-left"} s={"16"} />
                    Anterior
                  </button>
                  <button onClick={v.nextChap} style={{ height: "48px", padding: "0 22px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    {v.nextLabel}
                    <Icon n={"arrow-right"} s={"16"} />
                  </button>
                </div>
              </article>
            </main>
          </>
        ) : null}
        {v.adminLogin ? (
          <>
            <main data-screen-label={"Admin · Login"} style={{ minHeight: "calc(100vh - 70px)", display: "grid", placeItems: "center", padding: "48px 20px", animation: "ccIn .45s both" }}>
              <form onSubmit={v.login} style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "32px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", textAlign: "center" }}>
                  <span style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#161618", display: "grid", placeItems: "center" }}>
                    <Icon n={"lock-keyhole"} s={"24"} c={"#E0C78E"} />
                  </span>
                  <h1 style={{ margin: "0", font: "600 32px Urbanist", letterSpacing: "-.025em" }}>
                    Acesso administrativo
                  </h1>
                  <p style={{ margin: "0", font: "500 15px/1.5 Urbanist", color: "#8A847A" }}>
                    Área restrita à equipe do Etternum.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type={"email"} value={v.lEmail ?? ''} onChange={v.setLEmail} placeholder={"E-mail"} autoComplete={"username"} style={{ height: "54px", padding: "0 18px", borderRadius: "14px", border: "0", background: "#161618", color: "#F3EFE6", font: "500 16px Urbanist", outline: "none" }} />
                  <input type={"password"} value={v.lPass ?? ''} onChange={v.setLPass} placeholder={"Senha"} autoComplete={"current-password"} style={{ height: "54px", padding: "0 18px", borderRadius: "14px", border: "0", background: "#161618", color: "#F3EFE6", font: "500 16px Urbanist", outline: "none" }} />
                  {v.lErr ? (
                    <>
                      <span style={{ font: "500 13.5px Urbanist", color: "#F28B82", padding: "2px 4px 0" }}>
                        {v.lErr}
                      </span>
                    </>
                  ) : null}
                </div>
                <button type={"submit"} style={{ height: "54px", borderRadius: "999px", border: "0", background: "#F3EFE6", color: "#0B0B0C", font: "700 16px Urbanist", cursor: "pointer", transition: "opacity .2s" }} className="club-h8">
                  Entrar
                </button>
                <span style={{ textAlign: "center", font: "500 13px Urbanist", color: "#5F5A52" }}>
                  Leitores acessam o clube pelo app Etternum.
                </span>
              </form>
            </main>
          </>
        ) : null}
        {v.adminIn ? (
          <>
            <div data-screen-label={"Admin"} style={{ maxWidth: "1360px", margin: "0 auto", padding: "clamp(20px,3vw,32px) clamp(16px,3vw,32px) 96px", display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <aside style={{ flex: "1 1 200px", maxWidth: "240px", position: "sticky", top: v.stickTop, padding: "8px 0", background: "transparent", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ padding: "0 12px 10px", font: "700 11px Urbanist", letterSpacing: ".18em", textTransform: "uppercase", color: "#8A847A" }}>
                  Gestão
                </span>
                {(v.adminNav || []).map((n, $index) => (
                  <Fragment key={$index}>
                    <button key={n?.k} onClick={n?.go} style={{ height: "42px", padding: "0 14px", borderRadius: "999px", border: "0", display: "flex", alignItems: "center", gap: "11px", background: n?.bg, color: n?.fg, font: "600 14px Urbanist", cursor: "pointer", textAlign: "left" }}>
                      <Icon n={n?.icon} s={"17"} />
                      {n?.label}
                    </button>
                  </Fragment>
                ))}
                <div style={{ height: "1px", background: "rgba(255,255,255,.08)", margin: "10px 8px" }}></div>
                <button onClick={v.newBook} style={{ height: "42px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 14px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer" }}>
                  <Icon n={"plus"} s={"16"} />
                  Novo livro
                </button>
              </aside>
              <div style={{ flex: "999 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "24px", animation: "ccIn .4s both" }}>
                {v.aBooks ? (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <h1 style={{ margin: "0", font: "700 28px Urbanist", letterSpacing: "-.01em" }}>
                          Livros
                        </h1>
                        <span style={{ font: "500 14px Urbanist", color: "#A7A197" }}>
                          Cadastre resumos, insights, capítulos e citações.
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px" }}>
                      {(v.stats || []).map((s, $index) => (
                        <Fragment key={$index}>
                          <div key={s?.l} style={{ padding: "4px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px Urbanist", color: "#A7A197" }}>
                              <Icon n={s?.icon} s={"15"} c={"#E0C78E"} />
                              {s?.l}
                            </span>
                            <span style={{ font: "700 30px Urbanist", letterSpacing: "-.02em" }}>
                              {s?.v}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ borderRadius: "24px", background: "#121214", overflow: "hidden" }}>
                      <div style={{ display: "flex", gap: "8px", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", flexWrap: "wrap" }}>
                        {(v.statusTabs || []).map((f, $index) => (
                          <Fragment key={$index}>
                            <button key={f?.k} onClick={f?.go} style={{ height: "34px", padding: "0 14px", borderRadius: "999px", border: "0", background: f?.bg, color: f?.fg, font: "600 13px Urbanist", cursor: "pointer" }}>
                              {f?.label}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {(v.rows || []).map((b, $index) => (
                        <Fragment key={$index}>
                          <div key={b?.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.06)", flexWrap: "wrap" }}>
                            <div style={{ flex: "none", width: "42px", containerType: "inline-size" }}>
                              <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", borderRadius: "2px 5px 5px 2px", background: b?.color, color: b?.ink, padding: "12%", display: "flex", alignItems: "center", boxShadow: "inset 3px 0 0 rgba(0,0,0,.2)" }}>
                                {b?.img ? (
                                  <>
                                    <span style={{ position: "absolute", inset: "0", zIndex: "5", background: b?.coverBg }}></span>
                                  </>
                                ) : null}
                                <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "18cqw", lineHeight: "1" }}>
                                  {b?.title}
                                </span>
                              </div>
                            </div>
                            <div style={{ flex: "1 1 200px", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <span style={{ font: "700 15px Urbanist", display: "flex", alignItems: "center", gap: "8px" }}>
                                {b?.title}
                                {b?.featured ? (
                                  <>
                                    <Icon n={"star"} s={"13"} c={"#E0C78E"} />
                                  </>
                                ) : null}
                              </span>
                              <span style={{ font: "500 13px Urbanist", color: "#8A847A" }}>
                                {b?.author}{" · "}{b?.cat}
                              </span>
                            </div>
                            <span style={{ flex: "none", width: "96px", font: "600 13px Urbanist", color: "#A7A197" }}>
                              {b?.nIns}{" insights"}
                            </span>
                            <span style={{ flex: "none", width: "90px", font: "600 13px Urbanist", color: "#A7A197" }}>
                              {b?.readsLabel}
                            </span>
                            <span style={{ flex: "none", height: "26px", padding: "0 11px", borderRadius: "999px", background: b?.stBg, color: b?.stFg, font: "700 12px Urbanist", display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }}></span>
                              {b?.stLabel}
                            </span>
                            <div style={{ flex: "none", display: "flex", gap: "6px" }}>
                              <button onClick={b?.edit} aria-label={"Editar"} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "0", background: "#1F1F22", color: "#F3EFE6", display: "grid", placeItems: "center", cursor: "pointer" }} className="club-h9">
                                <Icon n={"pencil"} s={"15"} />
                              </button>
                              <button onClick={b?.preview} aria-label={"Ver como leitor"} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "0", background: "#1F1F22", color: "#F3EFE6", display: "grid", placeItems: "center", cursor: "pointer" }} className="club-h10">
                                <Icon n={"eye"} s={"15"} />
                              </button>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.aEdit ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <button onClick={v.goAdmin} aria-label={"Voltar"} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: "#161618", color: "#F3EFE6", display: "grid", placeItems: "center", cursor: "pointer" }}>
                        <Icon n={"arrow-left"} s={"17"} />
                      </button>
                      <div style={{ flex: "1", minWidth: "200px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ font: "700 12px Urbanist", letterSpacing: ".14em", textTransform: "uppercase", color: "#8A847A" }}>
                          {v.editKicker}
                        </span>
                        <h1 style={{ margin: "0", font: "700 26px Urbanist", letterSpacing: "-.01em" }}>
                          {v.d?.titleOr}
                        </h1>
                      </div>
                      <button onClick={v.delBook} style={{ height: "42px", padding: "0 16px", borderRadius: "999px", border: "0", background: "transparent", color: "#F28B82", font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                        <Icon n={"trash-2"} s={"15"} />
                        Excluir
                      </button>
                      <button onClick={v.saveDraft} style={{ height: "42px", padding: "0 18px", borderRadius: "999px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "700 14px Urbanist", cursor: "pointer" }}>
                        Salvar rascunho
                      </button>
                      <button onClick={v.publish} style={{ height: "42px", padding: "0 20px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "7px", cursor: "pointer" }}>
                        <Icon n={"send"} s={"15"} />
                        Publicar
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                      <div style={{ flex: "999 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px" }}>
                        <section style={{ padding: "24px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "16px" }}>
                          <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                            Informações
                          </h2>
                          <label style={{ display: "flex", flexDirection: "column", gap: "7px", font: "600 13px Urbanist", color: "#A7A197" }}>
                            Título
                            <input value={v.d?.title ?? ''} onChange={v.on?.title} placeholder={"Ex.: Em Busca de Sentido"} style={{ height: "46px", padding: "0 14px", borderRadius: "14px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "500 15px Urbanist", outline: "none" }} />
                          </label>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "14px" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "7px", font: "600 13px Urbanist", color: "#A7A197" }}>
                              Autor
                              <input value={v.d?.author ?? ''} onChange={v.on?.author} style={{ height: "46px", padding: "0 14px", borderRadius: "14px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "500 15px Urbanist", outline: "none" }} />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "7px", font: "600 13px Urbanist", color: "#A7A197" }}>
                              Categoria
                              <select value={v.d?.cat ?? ''} onChange={v.on?.cat} style={{ height: "46px", padding: "0 12px", borderRadius: "14px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "500 15px Urbanist", outline: "none" }}>
                                {(v.catOpts || []).map((o, $index) => (
                                  <Fragment key={$index}>
                                    <option key={o} value={o ?? ''}>
                                      {o}
                                    </option>
                                  </Fragment>
                                ))}
                              </select>
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", gap: "7px", font: "600 13px Urbanist", color: "#A7A197" }}>
                              Tempo de leitura (min)
                              <input type={"number"} value={v.d?.mins ?? ''} onChange={v.on?.mins} style={{ height: "46px", padding: "0 14px", borderRadius: "14px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "500 15px Urbanist", outline: "none" }} />
                            </label>
                          </div>
                          <label style={{ display: "flex", flexDirection: "column", gap: "7px", font: "600 13px Urbanist", color: "#A7A197" }}>
                            Sinopse
                            <textarea value={v.d?.synopsis ?? ''} onChange={v.on?.synopsis} rows={"4"} style={{ padding: "12px 14px", borderRadius: "14px", border: "0", background: "#1F1F22", color: "#F3EFE6", font: "400 15px/1.55 Urbanist", outline: "none", resize: "vertical" }}></textarea>
                          </label>
                        </section>
                        <section style={{ padding: "24px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                              {"Insights "}
                              <span style={{ color: "#8A847A", fontWeight: "600" }}>
                                {"· "}{v.d?.nIns}
                              </span>
                            </h2>
                            <button onClick={v.addIns} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: "rgba(224,199,142,.14)", color: "#E0C78E", font: "700 13px Urbanist", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                              <Icon n={"plus"} s={"14"} />
                              Adicionar
                            </button>
                          </div>
                          {(v.insRows || []).map((r, $index) => (
                            <Fragment key={$index}>
                              <div key={r?.k} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "14px", padding: "18px 0 4px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                                <span style={{ font: "400 24px/1 'EB Garamond',serif", color: "#E0C78E", paddingTop: "10px" }}>
                                  {r?.n}
                                </span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                                  <input value={r?.t ?? ''} onChange={r?.onT} placeholder={"Título do insight"} style={{ height: "40px", padding: "0 12px", borderRadius: "12px", border: "0", background: "#232326", color: "#F3EFE6", font: "700 14.5px Urbanist", outline: "none" }} />
                                  <textarea value={r?.d ?? ''} onChange={r?.onD} rows={"2"} placeholder={"Explique em 1–3 frases"} style={{ padding: "10px 12px", borderRadius: "12px", border: "0", background: "#232326", color: "#CFC8BC", font: "400 14px/1.5 Urbanist", outline: "none", resize: "vertical" }}></textarea>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                  <button onClick={r?.up} aria-label={"Subir"} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "0", background: "#232326", color: "#A7A197", display: "grid", placeItems: "center", cursor: "pointer" }}>
                                    <Icon n={"chevron-up"} s={"15"} />
                                  </button>
                                  <button onClick={r?.del} aria-label={"Remover"} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "0", background: "#232326", color: "#F28B82", display: "grid", placeItems: "center", cursor: "pointer" }}>
                                    <Icon n={"x"} s={"15"} />
                                  </button>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </section>
                        <section style={{ padding: "24px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                              {"Capítulos do resumo "}
                              <span style={{ color: "#8A847A", fontWeight: "600" }}>
                                {"· "}{v.d?.nChap}
                              </span>
                            </h2>
                            <button onClick={v.addChap} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: "rgba(224,199,142,.14)", color: "#E0C78E", font: "700 13px Urbanist", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                              <Icon n={"plus"} s={"14"} />
                              Adicionar
                            </button>
                          </div>
                          {(v.chapRows || []).map((r, $index) => (
                            <Fragment key={$index}>
                              <div key={r?.k} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "18px 0 4px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <span style={{ font: "700 12px Urbanist", color: "#8A847A", minWidth: "22px" }}>
                                    {r?.n}
                                  </span>
                                  <input value={r?.t ?? ''} onChange={r?.onT} placeholder={"Título do capítulo"} style={{ flex: "1", minWidth: "0", height: "40px", padding: "0 12px", borderRadius: "12px", border: "0", background: "#232326", color: "#F3EFE6", font: "700 14.5px Urbanist", outline: "none" }} />
                                  <button onClick={r?.del} aria-label={"Remover"} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "0", background: "#232326", color: "#F28B82", display: "grid", placeItems: "center", cursor: "pointer" }}>
                                    <Icon n={"x"} s={"15"} />
                                  </button>
                                </div>
                                <textarea value={r?.body ?? ''} onChange={r?.onB} rows={"5"} placeholder={"Texto do capítulo. Separe parágrafos com uma linha em branco."} style={{ padding: "12px", borderRadius: "12px", border: "0", background: "#232326", color: "#CFC8BC", font: "400 15px/1.6 'EB Garamond',serif", outline: "none", resize: "vertical" }}></textarea>
                              </div>
                            </Fragment>
                          ))}
                        </section>
                        <section style={{ padding: "24px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                              Citações
                            </h2>
                            <button onClick={v.addQuote} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: "rgba(224,199,142,.14)", color: "#E0C78E", font: "700 13px Urbanist", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                              <Icon n={"plus"} s={"14"} />
                              Adicionar
                            </button>
                          </div>
                          {(v.quoteRows || []).map((r, $index) => (
                            <Fragment key={$index}>
                              <div key={r?.k} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "18px 0 4px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
                                <Icon n={"quote"} s={"18"} c={"#E0C78E"} />
                                <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <textarea value={r?.q ?? ''} onChange={r?.onQ} rows={"2"} placeholder={"Citação"} style={{ padding: "10px 12px", borderRadius: "12px", border: "0", background: "#232326", color: "#F3EFE6", font: "italic 400 17px/1.4 'EB Garamond',serif", outline: "none", resize: "vertical" }}></textarea>
                                  <input value={r?.a ?? ''} onChange={r?.onA} placeholder={"Autor da citação"} style={{ height: "38px", padding: "0 12px", borderRadius: "12px", border: "0", background: "#232326", color: "#A7A197", font: "600 13.5px Urbanist", outline: "none" }} />
                                </div>
                                <button onClick={r?.del} aria-label={"Remover"} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "0", background: "#232326", color: "#F28B82", display: "grid", placeItems: "center", cursor: "pointer" }}>
                                  <Icon n={"x"} s={"15"} />
                                </button>
                              </div>
                            </Fragment>
                          ))}
                        </section>
                      </div>
                      <div style={{ flex: "1 1 280px", minWidth: "260px", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: v.stickTop }}>
                        <section style={{ padding: "22px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                            Capa
                          </h2>
                          <div key={v.d?.id} style={{ width: "100%", aspectRatio: "2/3", maxHeight: "320px", borderRadius: "16px", overflow: "hidden", background: "#1F1F22" }}>
                            <ImageSlot id={v.coverSlotId} src={v.d?.img} onChange={v.setCover} placeholder={"Arraste a capa do livro (JPG/PNG)"} shape={"rounded"} radius={"16"} />
                          </div>
                          <span style={{ font: "600 13px Urbanist", color: "#A7A197" }}>
                            Sem imagem, a capa tipográfica usa esta cor:
                          </span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {(v.swatches || []).map((w, $index) => (
                              <Fragment key={$index}>
                                <button key={w?.c} onClick={w?.pick} aria-label={"Cor"} style={{ width: "34px", height: "34px", borderRadius: "50%", border: "0", background: w?.c, boxShadow: w?.ring, cursor: "pointer" }}></button>
                              </Fragment>
                            ))}
                          </div>
                        </section>
                        <section style={{ padding: "22px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "14px" }}>
                          <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                            Publicação
                          </h2>
                          <div style={{ display: "flex", gap: "6px", padding: "4px", borderRadius: "999px", background: "#1F1F22" }}>
                            {(v.statusOpts || []).map((o, $index) => (
                              <Fragment key={$index}>
                                <button key={o?.k} onClick={o?.go} style={{ flex: "1", height: "36px", borderRadius: "999px", border: "0", background: o?.bg, color: o?.fg, font: "700 13px Urbanist", cursor: "pointer" }}>
                                  {o?.label}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                          <button onClick={v.toggleFeat} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "16px", border: "0", background: "#1A1A1C", color: "#F3EFE6", textAlign: "left", cursor: "pointer" }}>
                            <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ font: "700 14px Urbanist" }}>
                                Leitura do mês
                              </span>
                              <span style={{ font: "500 12.5px Urbanist", color: "#8A847A" }}>
                                Aparece no destaque da biblioteca
                              </span>
                            </span>
                            <span style={{ width: "44px", height: "26px", borderRadius: "999px", background: v.featTrack, padding: "3px", display: "flex", justifyContent: v.featJustify, transition: "background .2s" }}>
                              <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#F3EFE6" }}></span>
                            </span>
                          </button>
                        </section>
                        <section style={{ padding: "22px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
                          <span style={{ alignSelf: "flex-start", font: "700 12px Urbanist", letterSpacing: ".14em", textTransform: "uppercase", color: "#8A847A" }}>
                            Pré-visualização
                          </span>
                          <div style={{ width: "46%", containerType: "inline-size" }}>
                            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", borderRadius: "4px 9px 9px 4px", background: v.d?.color, color: v.d?.ink, padding: "13% 11%", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 26px 36px -18px rgba(0,0,0,.95),inset 5px 0 0 rgba(0,0,0,.18)" }}>
                              {v.d?.img ? (
                                <>
                                  <span style={{ position: "absolute", inset: "0", zIndex: "5", background: v.d?.coverBg }}></span>
                                </>
                              ) : null}
                              <span style={{ font: "700 6cqw Urbanist", letterSpacing: ".2em", textTransform: "uppercase", opacity: ".7" }}>
                                {v.d?.cat}
                              </span>
                              <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "15cqw", lineHeight: "1" }}>
                                {v.d?.titleOr}
                              </span>
                              <span style={{ font: "600 6.5cqw Urbanist", opacity: ".85" }}>
                                {v.d?.author}
                              </span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </>
                ) : null}
                {v.aMedia ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <h1 style={{ margin: "0", font: "700 28px Urbanist", letterSpacing: "-.01em" }}>
                        Materiais
                      </h1>
                      <span style={{ font: "500 14px Urbanist", color: "#A7A197" }}>
                        Imagens e arquivos de apoio usados nos resumos e encontros do clube.
                      </span>
                    </div>
                    <section style={{ padding: "24px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                        Imagens
                      </h2>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }}>
                        {(v.mediaSlots || []).map((m, $index) => (
                          <Fragment key={$index}>
                            <div key={m?.id} style={{ aspectRatio: "4/3", borderRadius: "16px", overflow: "hidden", background: "#1F1F22" }}>
                              <ImageSlot id={m?.id} placeholder={m?.ph} shape={"rounded"} radius={"16"} />
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </section>
                    <section style={{ padding: "24px", borderRadius: "24px", background: "#121214", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
                        <h2 style={{ margin: "0", font: "700 17px Urbanist" }}>
                          Arquivos
                        </h2>
                        <button onClick={v.fakeUpload} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: "rgba(224,199,142,.14)", color: "#E0C78E", font: "700 13px Urbanist", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                          <Icon n={"upload"} s={"14"} />
                          Enviar arquivo
                        </button>
                      </div>
                      {(v.files || []).map((f, $index) => (
                        <Fragment key={$index}>
                          <div key={f?.n} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 4px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                            <span style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#1F1F22", display: "grid", placeItems: "center" }}>
                              <Icon n={f?.icon} s={"18"} c={"#E0C78E"} />
                            </span>
                            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                              <span style={{ font: "700 14px Urbanist" }}>
                                {f?.n}
                              </span>
                              <span style={{ font: "500 12.5px Urbanist", color: "#8A847A" }}>
                                {f?.meta}
                              </span>
                            </span>
                            <button aria-label={"Mais opções"} style={{ width: "34px", height: "34px", borderRadius: "50%", border: "0", background: "transparent", color: "#8A847A", display: "grid", placeItems: "center", cursor: "pointer" }}>
                              <Icon n={"ellipsis"} s={"17"} />
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </section>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
        {v.standalone ? (
          <>
            <div style={{ position: "fixed", left: "14px", bottom: "14px", zIndex: "70", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
              {v.mapOpen ? (
                <>
                  <div style={{ width: "250px", maxHeight: "420px", overflowY: "auto", padding: "10px", borderRadius: "20px", background: "#1F1F22", boxShadow: "0 30px 60px -20px rgba(0,0,0,.8)", display: "flex", flexDirection: "column", gap: "2px" }}>
                    {(v.mapItems || []).map((m, $index) => (
                      <Fragment key={$index}>
                        <button key={m?.label} onClick={m?.go} style={{ height: "36px", padding: "0 10px", border: "0", borderRadius: "10px", background: m?.bg, color: "#F3EFE6", font: "500 13px Urbanist", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: "8px" }} className="club-h11">
                          <span>
                            {m?.label}
                          </span>
                          <span style={{ color: "#8A847A", font: "11px ui-monospace,Menlo,monospace" }}>
                            {m?.path}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              <button onClick={v.toggleMap} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: "#1F1F22", color: "#E0C78E", boxShadow: "inset 0 0 0 1px rgba(224,199,142,.35)", font: "700 12px Urbanist", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <Icon n={"map"} s={"14"} />
                Mapa de telas
              </button>
            </div>
          </>
        ) : null}
        {v.toast ? (
          <>
            <Overlay>
            <div role={"status"} style={{ position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)", zIndex: "60", display: "flex", alignItems: "center", gap: "10px", padding: "13px 20px", borderRadius: "999px", background: "#F3EFE6", color: "#0B0B0C", font: "600 14px Urbanist", boxShadow: "0 20px 40px -12px rgba(0,0,0,.6)", animation: "ccPop .3s both", whiteSpace: "nowrap" }}>
              <Icon n={"circle-check"} s={"17"} />
              {v.toast}
            </div>
            </Overlay>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
