import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { streamReply, AiUnavailable } from '../lib/ai.js';
import { listConversas, loadMensagens, createConversa, addMensagem, quando } from '../lib/supabase.js';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

const parseSegs = s => s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(x => x.startsWith('**') ? { t: x.slice(2, -2), b: true } : { t: x, b: false });
const parse = md => { const out = []; md.split('\n').forEach(line => { if (!line.trim()) return; if (line.startsWith('- ')) { const last = out[out.length - 1]; const segs = parseSegs(line.slice(2)); if (last && last.type === 'ul') last.items.push(segs); else out.push({ type: 'ul', items: [segs] }); } else if (line.startsWith('> ')) out.push({ type: 'q', text: line.slice(2) }); else out.push({ type: 'p', segs: parseSegs(line) }); }); return out; };
const len = blocks => blocks.reduce((n, b) => n + (b.type === 'p' ? b.segs.reduce((m, g) => m + g.t.length, 0) : b.type === 'ul' ? b.items.reduce((m, it) => m + it.reduce((k, g) => k + g.t.length, 0), 0) : b.text.length), 0);
const cut = (blocks, n) => { const out = []; for (const b of blocks) { if (n <= 0) break; if (b.type === 'q') { out.push({ ...b, text: b.text.slice(0, n) }); n -= b.text.length; continue; } const cs = segs => { const r = []; for (const g of segs) { if (n <= 0) break; r.push({ ...g, t: g.t.slice(0, n) }); n -= g.t.length; } return r; }; if (b.type === 'p') out.push({ ...b, segs: cs(b.segs) }); else { const items = []; for (const it of b.items) { if (n <= 0) break; items.push(cs(it)); } out.push({ ...b, items }); } } return out; };

const MAESTRO_FIRST = `Ana, obrigado por me contar. Exaustão assim costuma ser um sinal, não um defeito seu.
Antes de decidir sobre o emprego, vale olhar para **o que está te esvaziando**:
- o ritmo dobrado com os freelas à noite;
- a sensação de não saber para onde a carreira vai;
- a solidão de carregar isso sozinha.
Acho que uma conversa com Viktor Frankl pode te ajudar a reencontrar o seu porquê.`;
const MAESTRO_BIZ = `Que bom que você trouxe isso. Para decisões de negócio, ajuda separar **o que é estratégia** do que é **cansaço do dia a dia**.
- Qual problema o seu cliente realmente quer resolver?
- O que você faria se tivesse que escolher uma única prioridade?
Peter Drucker é ótimo para colocar ordem nessas perguntas.`;
const MAESTRO_NEXT = `Estou aqui. Pode continuar no seu ritmo, sem pressa.
Lembro que você comentou sobre a **ansiedade** e a **falta de rumo na carreira**. Quer que a gente olhe para uma coisa de cada vez?`;
const MAESTRO_CRISIS = `Ana, obrigado por confiar isso a mim. O que você está sentindo é importante, e você **não precisa atravessar isso sozinha**.
Se puder, ligue agora para o **CVV, no 188**. É gratuito, funciona 24 horas e alguém vai ouvir você com cuidado.
Eu continuo aqui com você. Quer me contar o que aconteceu hoje?`;
const FRANKL = `Ana, o cansaço que você descreve é real, e não precisa ser negado. Mas repare numa coisa: **o sofrimento, por si só, não tem sentido — a atitude que escolhemos diante dele pode ter.**
Na logoterapia, costumo propor três caminhos para encontrar sentido:
- **Criar** algo, uma obra ou um gesto;
- **Viver** algo, ou amar alguém;
- **Escolher a atitude** diante do que não pode ser mudado.
> Quem tem um porquê enfrenta qualquer como.
Me conte: quando você ainda gostava do seu trabalho, o que fazia você levantar de manhã?`;
const FRANKL_2 = `Criar coisas que as pessoas usam. Repare que isso não é um cargo, é um **sentido**. Ele pode viver dentro deste emprego, em outro, ou nos seus freelas.
Antes de decidir se fica ou sai, que tal escrever esta semana três momentos em que você se sentiu útil?`;
const MATE = `Nas ideias de Gabor Maté, a pergunta muda: em vez de “o que há de errado comigo?”, perguntamos **“o que aconteceu comigo?”**.
Para ele, a exaustão muitas vezes aparece quando passamos muito tempo escolhendo **ser aceitos** em vez de **ser autênticos**:
- dizer sim quando o corpo pede não;
- ignorar sinais de cansaço para não decepcionar;
- carregar sozinho o que poderia ser dividido.
Quer olhar para algum desses pontos com calma?`;
const generic = m => `Obrigado por compartilhar isso comigo. Uma ideia que sempre me acompanhou: **${m.quote}**
Para pensar no seu momento, eu começaria por duas perguntas:
- O que, hoje, depende de você?
- O que você precisa aceitar para seguir em frente?
Me conte mais sobre o que está mais difícil agora.`;

const SEED_USER = 'Estou exausta e sem saber se continuo no meu emprego.';

export default class Chat extends React.Component {
  listRef = React.createRef(); inputRef = React.createRef();
  state = { msgs: [], draft: '', thinking: false, stream: null, error: false, crisis: false, tip: false, recUsed: false };
  componentDidMount() {
    // Signed in and no demo variant: resume the latest conversation with this mind.
    // Demo variants ("novo", "conversa"…) only apply without an account; "msg:" starts a new conversation.
    if (this.a.loggedIn && !/^(msg|area):/.test(this.a.variant || '')) this.resume();
    else this.seed();
  }
  get tipo() { return this.mindSlug === 'maestro' ? 'maestro' : 'mente'; }
  async resume(id) {
    try {
      const hist = await listConversas({ tipo: this.tipo, slug: this.mindSlug });
      this.setState({ hist });
      const conv = id ? hist.find(c => c.id === id) : hist[0];
      if (!conv) return;
      const rows = await loadMensagens(conv.id);
      this.conversaId = conv.id;
      const msgs = rows.map(r => r.role === 'user' ? { role: 'user', text: r.content } : { role: 'ai', md: r.content, blocks: parse(r.content), rec: r.meta && r.meta.rec });
      this.setState({ msgs, recUsed: msgs.some(m => m.rec), crisis: rows.some(r => r.meta && r.meta.crisis) });
      this.scrollDown();
    } catch (e) { console.error('[conversas]', e.message); }
  }
  // Saves one message, creating the conversation on the first one.
  async persist(role, content, meta) {
    if (!this.a.loggedIn) return;
    try {
      if (!this.conversaId) {
        this.conversaId = await createConversa(this.tipo, this.mindSlug, role === 'user' ? content : 'Conversa');
        listConversas({ tipo: this.tipo, slug: this.mindSlug }).then(hist => this.setState({ hist })).catch(() => {});
      }
      await addMensagem(this.conversaId, role, content, meta);
    } catch (e) { console.error('[conversas]', e.message); }
  }
  componentWillUnmount() { clearInterval(this.si); clearTimeout(this.tt); this.ctrl && this.ctrl.abort(); }
  get a() { return this.props.app || {}; }
  get mindSlug() { return this.a.route === 'maestro' ? 'maestro' : (this.a.param || 'frankl'); }
  seed() {
    const v = this.a.variant || '';
    const isM = this.mindSlug === 'maestro';
    const ai = (md, rec) => ({ role: 'ai', md, blocks: parse(md), rec });
    if (v.startsWith('msg:')) return this.send(v.slice(4));
    if (v === 'recomendacao' && isM) return this.setState({ msgs: [{ role: 'user', text: SEED_USER }, ai(MAESTRO_FIRST, 'frankl')], recUsed: true });
    if (v === 'conversa' && !isM) return this.setState({ msgs: [{ role: 'user', text: SEED_USER }, ai(this.reply(true)), { role: 'user', text: 'Acho que eu gostava de criar coisas que as pessoas usavam.' }, ai(this.mindSlug === 'frankl' ? FRANKL_2 : this.reply(false))] });
    if (v === 'pensando') return this.setState({ msgs: [{ role: 'user', text: SEED_USER }], thinking: true });
    if (v === 'streaming') { this.setState({ msgs: [{ role: 'user', text: SEED_USER }] }); return this.startStream(this.reply(true), isM ? 'frankl' : null, true); }
    if (v === 'crise') return this.setState({ crisis: true, msgs: [{ role: 'user', text: 'Às vezes penso que seria melhor sumir.' }, ai(MAESTRO_CRISIS)] });
    if (v === 'erro') return this.setState({ msgs: [{ role: 'user', text: SEED_USER }], error: true });
  }
  reply(first, text) {
    const nome = (this.a.user || {}).primeiro || 'Ana';
    return this.replyRaw(first, text).replace(/\bAna\b/g, nome);
  }
  replyRaw(first, text) {
    const s = this.mindSlug;
    if (s === 'maestro') { if (text && /sumir|morrer|me matar|acabar com tudo|não aguento mais viver/i.test(text)) return MAESTRO_CRISIS; if (text && /neg[oó]cio|empresa|cliente/i.test(text)) return MAESTRO_BIZ; return first ? MAESTRO_FIRST : MAESTRO_NEXT; }
    if (s === 'frankl') return first ? FRANKL : FRANKL_2;
    if (s === 'mate') return MATE;
    return generic(ETT.bySlug[s] || ETT.bySlug.frankl);
  }
  scrollDown() { requestAnimationFrame(() => { const el = this.listRef.current; if (el) el.scrollTop = el.scrollHeight; }); }
  send(text) {
    text = (text || '').trim(); if (!text || this.state.thinking || this.state.stream) return;
    const crisis = /sumir|morrer|me matar|acabar com tudo/i.test(text);
    const first = !this.state.msgs.some(m => m.role === 'ai');
    this.setState(s => ({ msgs: [...s.msgs, { role: 'user', text }], draft: '', thinking: true, error: false, crisis: s.crisis || crisis }));
    this.scrollDown();
    const md = this.reply(first, text);
    let rec = null;
    if (this.mindSlug === 'maestro' && !this.state.recUsed && !crisis) rec = md === MAESTRO_BIZ ? 'drucker' : md === MAESTRO_FIRST ? 'frankl' : null;
    if ((this.a.variant || '').startsWith('area:') && rec) rec = 'drucker';
    if (this.demo) { this.tt = setTimeout(() => this.startStream(md, rec), 1100); return; }
    this.live(text, crisis, () => { this.demo = true; this.startStream(md, rec); });
  }
  // Live reply from the AI backend. Falls back to the scripted demo reply when no backend is configured.
  async live(text, crisis, fallback) {
    const history = [...this.state.msgs.filter(m => m.role === 'user' || m.md).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.role === 'user' ? m.text : m.md })), { role: 'user', content: text }];
    this.ctrl = new AbortController();
    const isM = this.mindSlug === 'maestro';
    const show = md => { const blocks = parse(md); this.setState({ thinking: false, stream: { blocks, n: len(blocks), total: len(blocks), rec: null } }); this.scrollDown(); };
    // Jev flags risk before the reply streams: show the CVV panel right away.
    const onMeta = m => { if (m.crisis) this.setState({ crisis: true }); };
    try {
      this.persist('user', text);
      const { text: md, crisis: risk, recommend } = await streamReply({ mind: this.mindSlug, messages: history, profile: this.a.profileAi, signal: this.ctrl.signal, onDelta: show, onMeta });
      const rec = isM && !crisis && !risk && !this.state.recUsed && recommend && ETT.bySlug[recommend] ? recommend : null;
      this.setState(s => ({ stream: null, thinking: false, recUsed: s.recUsed || !!rec, msgs: [...s.msgs, { role: 'ai', md: md.trim(), blocks: parse(md), rec }] }));
      this.persist('assistant', md.trim(), rec || risk ? { rec, crisis: risk || undefined } : null);
      this.scrollDown();
    } catch (e) {
      if (e.name === 'AbortError') return;
      if (e instanceof AiUnavailable) return fallback();
      this.setState({ thinking: false, stream: null, error: true });
    }
  }
  startStream(md, rec, loop) {
    const blocks = parse(md), total = len(blocks);
    this.setState({ thinking: false, stream: { blocks, n: 0, total, rec } });
    clearInterval(this.si);
    this.si = setInterval(() => {
      const st = this.state.stream; if (!st) return clearInterval(this.si);
      const n = st.n + 3;
      if (n >= st.total) {
        clearInterval(this.si);
        this.setState(s => ({ stream: null, recUsed: s.recUsed || !!rec, msgs: [...s.msgs, { role: 'ai', md, blocks, rec }] }));
        if (loop) setTimeout(() => { if (this.a.variant === 'streaming') { this.setState(s => ({ msgs: s.msgs.slice(0, -1) })); this.startStream(md, rec, true); } }, 2500);
      } else this.setState({ stream: { ...st, n } });
      this.scrollDown();
    }, 16);
  }
  renderVals() {
    const a = this.a, E = ETT, t = a.t || {}, s = this.state, mob = !!a.mobile;
    if (!E) return {};
    const nav = (r, p, v) => a.nav && a.nav(r, p, v);
    const slug = this.mindSlug, isM = slug === 'maestro';
    const raw = isM ? { slug: 'maestro', name: 'Maestro', inspired: false } : (E.bySlug[slug] || E.bySlug.frankl);
    const mind = { ...raw, ini: isM ? '∞' : E.initials(raw.name) };
    const v = a.variant || '';
    const areaV = v.startsWith('area:') ? E.areaBySlug[v.slice(5)] : null;
    const blocked = !isM && (v === 'bloqueio' || (a.plan === 'free' && slug !== 'seneca'));
    const fmt = b => ({ p: b.type === 'p', ul: b.type === 'ul', q: b.type === 'q', text: b.text || '',
      segs: (b.segs || []).map(g => ({ t: g.t, w: g.b ? 700 : 500, c: g.b ? t.accentText : t.ink })),
      items: (b.items || []).map(it => it.map(g => ({ t: g.t, w: g.b ? 700 : 500, c: g.b ? t.accentText : t.ink }))) });
    const toMsg = (m, i, streaming) => { const rec = m.rec && !streaming ? E.bySlug[m.rec] : null; return { user: m.role === 'user', ai: m.role === 'ai', text: m.text || '', blocks: (m.blocks || []).map(fmt), cursor: !!streaming, hasRec: !!rec, rec: rec ? { ...rec, ini: E.initials(rec.name) } : {}, recGo: rec ? () => nav('mente', rec.slug) : null }; };
    const msgs = s.msgs.map((m, i) => toMsg(m, i));
    if (s.stream) msgs.push(toMsg({ role: 'ai', blocks: cut(s.stream.blocks, s.stream.n) }, -1, true));
    const first = mind.name.split(' ')[0]; const nome = (a.user || {}).primeiro || 'Ana';
    const sugs = isM ? (areaV ? ['Estou pensando em largar meu emprego para empreender.', 'Como decidir entre dois caminhos?', 'Meu negócio não cresce. Por onde começo?'] : ['Hoje eu só preciso desabafar.', 'Estou confuso(a) e não sei por onde começar.', 'Quem pode me ajudar com meu negócio?'])
      : slug === 'frankl' ? ['Como encontro sentido no meu trabalho?', 'Estou atravessando uma perda.', 'Como lidar com o cansaço?'] : ['Como você enxergaria o meu momento?', `O que você me diria sobre ${raw.spec.split(' · ')[0].toLowerCase()}?`, 'Me conte uma ideia que mudou vidas.'];
    const fav = !!(a.favs || {})[slug];
    return {
      t, mobile: mob, desktop: !mob, showAside: !mob && (a.w || 1440) >= 1100, headForward: !mob && (a.w || 1440) < 1100, isMaestro: isM, isMind: !isM, mind,
      gap: mob ? '0' : '14px', pad: mob ? '0' : '0 4px 14px 12px', panelR: mob ? '0' : '28px', panelBg: mob ? 'transparent' : t.card, panelShadow: mob ? 'none' : `inset 0 0 0 1px ${t.line}`,
      headPad: mob ? '8px 14px' : '14px 18px', av: mob ? '40px' : '48px', avIcon: mob ? '20' : '24', nameSize: mob ? '17px' : '20px',
      listPad: mob ? '20px 16px' : '28px 32px', composerPad: mob ? '8px 12px 10px' : '8px 24px 18px', crisisPad: mob ? '18px' : '24px', crisisCols: '1fr 1fr', emptyH: mob ? '26px' : '32px',
      subtitle: isM ? (areaV ? `Vamos encontrar a mente ideal em ${areaV.name}` : 'Aurelius · Guardião das Mentes do Etternum') : `${raw.role} · ${raw.period}`,
      tip: s.tip, tipOn: () => this.setState({ tip: true }), tipOff: () => this.setState({ tip: false }), tipToggle: () => this.setState({ tip: !s.tip }),
      starBg: fav ? '#E0C78E' : t.card2, starFg: fav ? '#14110A' : t.ink, fav: () => a.toggleFav(slug),
      forward: () => nav('maestro', '', `msg:Estava conversando com ${raw.name} e queria a sua ajuda para continuar.`),
      reset: () => { clearInterval(this.si); this.conversaId = null; this.setState({ msgs: [], thinking: false, stream: null, error: false, crisis: false, recUsed: false }); },
      back: () => nav(isM ? 'inicio' : 'mentes'),
      crisis: s.crisis, empty: !s.msgs.length && !s.stream && !s.thinking,
      emptyTitle: isM ? (areaV ? 'Me conte o que está acontecendo.' : v === 'novo' ? `Boas-vindas ao Etternum, ${nome}. Meu nome é Aurelius. Mas aqui, todos me chamam de Maestro.` : `Oi, ${nome}. Estou aqui.`) : raw.inspired ? `Uma cápsula sobre as ideias de ${raw.name}.` : `Olá, ${nome}. Sou ${raw.name}.`,
      emptySub: isM ? 'Pode desabafar, perguntar ou pedir um conselho. Se fizer sentido, eu apresento você a uma grande mente.' : raw.inspired ? 'Falo sobre o pensamento dela, nunca como ela. Por onde quer começar?' : `“${raw.quote}” Por onde quer começar?`,
      obraLabel: raw.inspired ? `Alimentada com toda a obra de ${raw.name}` : `Alimentada com todos os livros e materiais de ${first === 'Sri' ? raw.name : raw.name}`,
      sugs: sugs.map(label => ({ label, go: () => this.send(label) })),
      msgs, thinking: s.thinking, thinkingLabel: isM ? 'O Maestro está pensando…' : `${first} está pensando…`,
      dots: [0, .16, .32].map(d => React.createElement('span', { key: d, style: { width: 7, height: 7, borderRadius: '50%', background: '#E0C78E', display: 'inline-block', animation: `etPulse 1.2s ${d}s infinite ease-in-out` } })),
      error: s.error, retry: () => { const last = [...s.msgs].reverse().find(m => m.role === 'user'); this.setState({ error: false, msgs: s.msgs.slice(0, -1) }); setTimeout(() => this.send(last ? last.text : SEED_USER), 50); },
      blocked, canType: !blocked, goPlano: () => nav('plano'), goMaestro: () => nav('maestro'),
      draft: s.draft, onDraft: e => this.setState({ draft: e.target.value }), onKey: e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(s.draft); } },
      submit: e => { e.preventDefault(); this.send(s.draft); }, busy: s.thinking || !!s.stream, sendBg: s.draft.trim() ? t.accent : t.card3,
      placeholder: isM ? 'Conte o que você está vivendo…' : `Escreva para ${first}…`, listRef: this.listRef, inputRef: this.inputRef,
      histTitle: isM ? 'Conversas com o Maestro' : `Conversas com ${first}`,
      hist: this.a.loggedIn ? (s.hist || []).map(c => ({ title: c.titulo, when: quando(c.updated_at), bg: c.id === this.conversaId ? t.card2 : 'transparent', go: () => { clearInterval(this.si); this.ctrl && this.ctrl.abort(); this.conversaId = null; this.setState({ msgs: [], thinking: false, stream: null, error: false, crisis: false }); this.resume(c.id); } })) : (isM ? [['Estou exausta e sem saber se continuo no meu emprego.', 'Hoje, 21:58'], ['Como lidar com a solidão à noite', 'Terça, 23:10'], ['Quero voltar a dançar', '28 set'], ['Primeira conversa', '20 set']] : [['Reencontrar o porquê no trabalho', 'Ontem, 22:14'], ['Sentido nas pequenas coisas', '30 set'], ['Primeira conversa', '22 set']]).map(([title, when], i) => ({ title, when, bg: i === 0 ? t.card2 : 'transparent', go: () => this.setState({ msgs: [] }) })),
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div data-screen-label={"06 Maestro / 10 Conversa"} style={{ height: "100%", display: "flex", gap: v.gap, padding: v.pad, color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", borderRadius: v.panelR, background: v.panelBg, boxShadow: v.panelShadow, overflow: "hidden" }}>
          <header style={{ flex: "none", display: "flex", alignItems: "center", gap: "12px", padding: v.headPad, borderBottom: `1px solid ${v.t?.line ?? ''}` }}>
            {v.mobile ? (
              <>
                <button onClick={v.back} aria-label={"Voltar"} style={{ width: "40px", height: "44px", marginLeft: "-8px", border: "0", background: "transparent", color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <Icon n={"chevron-left"} s={"22"} />
                </button>
              </>
            ) : null}
            {v.isMaestro ? (
              <>
                <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: v.av, height: v.av, borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
              </>
            ) : null}
            {v.isMind ? (
              <>
                <div style={{ position: "relative", flex: "none", width: v.av, height: v.av, borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                  <ImageSlot id={`mind-${v.mind?.slug ?? ''}`} shape={"circle"} compact placeholder={v.mind?.ini} />
                </div>
              </>
            ) : null}
            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "0" }}>
                <span style={{ font: `700 ${v.nameSize ?? ''}/1.15 Urbanist`, letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                  {v.mind?.name}
                </span>
                {v.mind?.inspired ? (
                  <>
                    <span onMouseEnter={v.tipOn} onMouseLeave={v.tipOff} onClick={v.tipToggle} style={{ position: "relative" }}>
                      <span style={{ height: "24px", padding: "0 10px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 11px Urbanist", display: "flex", alignItems: "center", gap: "5px", cursor: "help" }}>
                        <Icon n={"feather"} s={"12"} />
                        Inspirado em
                      </span>
                      {v.tip ? (
                        <>
                          <span role={"tooltip"} style={{ position: "absolute", top: "calc(100% + 8px)", left: "0", zIndex: "10", width: "250px", padding: "12px 14px", borderRadius: "14px", background: v.t?.altBg, color: v.t?.altFg, font: "500 13px/1.45 Urbanist", boxShadow: "0 20px 40px -12px rgba(0,0,0,.5)" }}>
                            Cápsula de um especialista nas ideias desta pessoa — não é uma simulação dela.
                          </span>
                        </>
                      ) : null}
                    </span>
                  </>
                ) : null}
              </div>
              <span style={{ font: "500 13.5px/1.3 Urbanist", color: v.t?.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {v.subtitle}
              </span>
            </div>
            {v.isMind ? (
              <>
                <button onClick={v.fav} aria-label={"Quadro Eterno"} title={"Quadro Eterno"} style={{ flex: "none", width: "44px", height: "44px", borderRadius: "50%", border: "0", background: v.starBg, color: v.starFg, display: "grid", placeItems: "center", cursor: "pointer", transition: "background .2s,transform .2s" }} className="chat-a1">
                  <Icon n={"star"} s={"18"} />
                </button>
                {v.headForward ? (
                  <>
                    <button onClick={v.forward} style={{ flex: "none", height: "44px", padding: "0 16px", borderRadius: "999px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "700 13.5px Urbanist", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <Icon n={"infinity"} s={"16"} c={v.t?.accentText} />
                      Encaminhar ao Maestro
                    </button>
                  </>
                ) : null}
              </>
            ) : null}
            <button onClick={v.reset} aria-label={"Nova conversa"} title={"Nova conversa"} style={{ flex: "none", width: "44px", height: "44px", borderRadius: "50%", border: "0", background: v.t?.accent, color: v.t?.onAccent, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Icon n={"plus"} s={"20"} />
            </button>
          </header>
          <div ref={v.listRef} style={{ flex: "1", minHeight: "0", overflowY: "auto", padding: v.listPad }}>
            <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "26px", minHeight: "100%" }}>
              {v.crisis ? (
                <>
                  <div role={"alert"} style={{ borderRadius: "26px", background: v.t?.dangerBg, padding: v.crisisPad, display: "flex", flexDirection: "column", gap: "16px", animation: "etIn .4s both" }}>
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                      <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "50%", background: v.t?.dangerCard, display: "grid", placeItems: "center" }}>
                        <Icon n={"heart-handshake"} s={"22"} c={v.t?.danger} />
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ font: "700 21px/1.2 Urbanist" }}>
                          Você não está sozinho(a).
                        </span>
                        <span style={{ font: "500 15.5px Urbanist", color: v.t?.ink }}>
                          Se precisar de ajuda agora:
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: v.crisisCols, gap: "8px" }}>
                      <a href={"tel:188"} style={{ gridColumn: "1 / -1", minHeight: "64px", borderRadius: "18px", background: v.t?.dangerCard, padding: "12px 18px", display: "flex", alignItems: "center", gap: "16px", color: v.t?.ink, textDecoration: "none" }}>
                        <span style={{ font: "800 32px/1 Urbanist", letterSpacing: "-.02em", color: v.t?.dangerInk }}>
                          188
                        </span>
                        <span style={{ font: "600 14.5px/1.4 Urbanist" }}>
                          CVV — gratuito, 24 horas, ou chat em cvv.org.br
                        </span>
                      </a>
                      <a href={"tel:192"} style={{ minHeight: "52px", borderRadius: "16px", background: v.t?.dangerCard, padding: "0 16px", display: "flex", alignItems: "center", gap: "12px", color: v.t?.ink, textDecoration: "none" }}>
                        <span style={{ font: "800 20px Urbanist", color: v.t?.dangerInk }}>
                          192
                        </span>
                        <span style={{ font: "600 14px Urbanist" }}>
                          SAMU
                        </span>
                      </a>
                      <a href={"tel:190"} style={{ minHeight: "52px", borderRadius: "16px", background: v.t?.dangerCard, padding: "0 16px", display: "flex", alignItems: "center", gap: "12px", color: v.t?.ink, textDecoration: "none" }}>
                        <span style={{ font: "800 20px Urbanist", color: v.t?.dangerInk }}>
                          190
                        </span>
                        <span style={{ font: "600 14px Urbanist" }}>
                          Polícia
                        </span>
                      </a>
                      <a href={"tel:180"} style={{ gridColumn: "1 / -1", minHeight: "52px", borderRadius: "16px", background: v.t?.dangerCard, padding: "0 16px", display: "flex", alignItems: "center", gap: "12px", color: v.t?.ink, textDecoration: "none" }}>
                        <span style={{ font: "800 20px Urbanist", color: v.t?.dangerInk }}>
                          180
                        </span>
                        <span style={{ font: "600 14px Urbanist" }}>
                          Central de Atendimento à Mulher
                        </span>
                      </a>
                    </div>
                  </div>
                </>
              ) : null}
              {v.empty ? (
                <>
                  <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "18px", padding: "32px 0" }}>
                    {v.isMaestro ? (
                      <>
                        <div role={"img"} aria-label={"Aurelius, o Maestro"} style={{ width: "120px", height: "120px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", animation: "etGlow 4s ease-in-out infinite", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></div>
                      </>
                    ) : null}
                    {v.isMind ? (
                      <>
                        <div style={{ position: "relative", width: "150px", height: "186px", borderRadius: "28px", overflow: "hidden", background: "#1A1510", boxShadow: "0 30px 60px -24px rgba(0,0,0,.6)" }}>
                          <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                            <ImageSlot id={`mind-${v.mind?.slug ?? ''}`} shape={"rect"} placeholder={v.mind?.name} />
                          </div>
                        </div>
                      </>
                    ) : null}
                    <h2 style={{ margin: "0", font: `700 ${v.emptyH ?? ''}/1.1 Urbanist`, letterSpacing: "-.02em", maxWidth: "520px", textWrap: "balance" }}>
                      {v.emptyTitle}
                    </h2>
                    <p style={{ margin: "0", font: "500 16px/1.55 Urbanist", color: v.t?.muted, maxWidth: "460px" }}>
                      {v.emptySub}
                    </p>
                    {v.isMind ? (
                      <>
                        <span style={{ height: "32px", padding: "0 14px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 12.5px Urbanist", display: "flex", alignItems: "center", gap: "7px" }}>
                          <Icon n={"library"} s={"14"} />
                          {v.obraLabel}
                        </span>
                      </>
                    ) : null}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", maxWidth: "440px", marginTop: "6px" }}>
                      {(v.sugs || []).map((s, $index) => (
                        <Fragment key={$index}>
                          <button onClick={s?.go} style={{ minHeight: "52px", padding: "10px 18px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "600 15px/1.35 Urbanist", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", transition: "background .2s,transform .15s" }} className="chat-a2">
                            <Icon n={"message-circle"} s={"17"} c={v.t?.accentText} />
                            {s?.label}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              {(v.msgs || []).map((m, $index) => (
                <Fragment key={$index}>
                  {m?.user ? (
                    <>
                      <div style={{ alignSelf: "flex-end", maxWidth: "82%", padding: "13px 18px", borderRadius: "22px 22px 6px 22px", background: "#E0C78E", color: "#14110A", font: "600 16px/1.5 Urbanist", animation: "etIn .3s both" }}>
                        {m?.text}
                      </div>
                    </>
                  ) : null}
                  {m?.ai ? (
                    <>
                      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        {v.isMaestro ? (
                          <>
                            <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                          </>
                        ) : null}
                        {v.isMind ? (
                          <>
                            <div style={{ position: "relative", flex: "none", width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                              <ImageSlot id={`mind-${v.mind?.slug ?? ''}`} shape={"circle"} compact placeholder={v.mind?.ini} />
                            </div>
                          </>
                        ) : null}
                        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px", font: "500 16.5px/1.7 Urbanist", color: v.t?.ink }}>
                          {(m?.blocks || []).map((b, $index) => (
                            <Fragment key={$index}>
                              {b?.p ? (
                                <>
                                  <p style={{ margin: "0", textWrap: "pretty" }}>
                                    {(b?.segs || []).map((g, $index) => (
                                      <Fragment key={$index}>
                                        <span style={{ fontWeight: g?.w, color: g?.c }}>
                                          {g?.t}
                                        </span>
                                      </Fragment>
                                    ))}
                                  </p>
                                </>
                              ) : null}
                              {b?.ul ? (
                                <>
                                  <ul style={{ margin: "0", paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {(b?.items || []).map((it, $index) => (
                                      <Fragment key={$index}>
                                        <li>
                                          {(it || []).map((g, $index) => (
                                            <Fragment key={$index}>
                                              <span style={{ fontWeight: g?.w, color: g?.c }}>
                                                {g?.t}
                                              </span>
                                            </Fragment>
                                          ))}
                                        </li>
                                      </Fragment>
                                    ))}
                                  </ul>
                                </>
                              ) : null}
                              {b?.q ? (
                                <>
                                  <blockquote style={{ margin: "0", padding: "2px 0 2px 18px", borderLeft: "2px solid #E0C78E", font: "italic 400 22px/1.4 'EB Garamond',serif" }}>
                                    {b?.text}
                                  </blockquote>
                                </>
                              ) : null}
                            </Fragment>
                          ))}
                          {m?.cursor ? (
                            <>
                              <span style={{ display: "inline-block", width: "2px", height: "18px", marginTop: "-30px", background: "#E0C78E", animation: "etBlink 1s steps(1) infinite" }}></span>
                            </>
                          ) : null}
                          {m?.hasRec ? (
                            <>
                              <button onClick={m?.recGo} style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "14px", padding: "10px 18px 10px 10px", borderRadius: "22px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.accentLine ?? ''}`, color: v.t?.ink, cursor: "pointer", textAlign: "left", animation: "etIn .4s both", transition: "transform .2s,background .2s" }}>
                                <div style={{ position: "relative", flex: "none", width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                                  <ImageSlot id={`mind-${m?.rec?.slug ?? ''}`} shape={"circle"} compact placeholder={m?.rec?.ini} />
                                </div>
                                <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <span style={{ font: "700 16px/1.2 Urbanist" }}>
                                    {"Continuar com "}{m?.rec?.name}
                                  </span>
                                  <span style={{ font: "600 13px Urbanist", color: v.t?.accentText }}>
                                    {m?.rec?.spec}
                                  </span>
                                </span>
                                <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: v.t?.accent, color: v.t?.onAccent, display: "grid", placeItems: "center" }}>
                                  <Icon n={"arrow-right"} s={"17"} />
                                </span>
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </>
                  ) : null}
                </Fragment>
              ))}
              {v.thinking ? (
                <>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {v.isMaestro ? (
                      <>
                        <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                      </>
                    ) : null}
                    {v.isMind ? (
                      <>
                        <div style={{ position: "relative", flex: "none", width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                          <ImageSlot id={`mind-${v.mind?.slug ?? ''}`} shape={"circle"} compact placeholder={v.mind?.ini} />
                        </div>
                      </>
                    ) : null}
                    <span style={{ display: "inline-flex", gap: "6px", padding: "13px 16px", borderRadius: "999px", background: v.t?.card2 }}>
                      {v.dots}
                    </span>
                    <span style={{ font: "500 13px Urbanist", color: v.t?.faint }}>
                      {v.thinkingLabel}
                    </span>
                  </div>
                </>
              ) : null}
              {v.error ? (
                <>
                  <div role={"alert"} style={{ alignSelf: "center", display: "flex", alignItems: "center", gap: "12px", padding: "8px 8px 8px 18px", borderRadius: "999px", background: v.t?.dangerBg, color: v.t?.dangerInk, font: "600 14px Urbanist" }}>
                    <Icon n={"wifi-off"} s={"17"} />
                    A conexão caiu. Tente enviar de novo.
                    <button onClick={v.retry} style={{ height: "34px", padding: "0 14px", borderRadius: "999px", border: "0", background: v.t?.danger, color: "#fff", font: "700 13px Urbanist", cursor: "pointer" }}>
                      Tentar de novo
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div style={{ flex: "none", padding: v.composerPad }}>
            <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {v.blocked ? (
                <>
                  <div style={{ borderRadius: "26px", background: v.t?.hero, color: v.t?.heroInk, boxShadow: "inset 0 0 0 1px rgba(224,199,142,.4)", padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ flex: "none", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(224,199,142,.16)", display: "grid", placeItems: "center" }}>
                        <Icon n={"lock-keyhole"} s={"18"} c={"#E0C78E"} />
                      </span>
                      <span style={{ font: "700 17px/1.4 Urbanist" }}>
                        No plano gratuito você conversa com uma cápsula. Faça upgrade para acessar todas as mentes.
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={v.goPlano} style={{ height: "46px", padding: "0 22px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 15px Urbanist", cursor: "pointer" }}>
                        Conhecer o Premium
                      </button>
                      <button onClick={v.goMaestro} style={{ height: "46px", padding: "0 22px", borderRadius: "999px", border: "0", background: "rgba(255,255,255,.08)", color: "#F3EFE6", font: "700 15px Urbanist", cursor: "pointer" }}>
                        Falar com o Maestro
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {v.canType ? (
                <>
                  <form onSubmit={v.submit} style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "6px 6px 6px 20px", borderRadius: "28px", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}` }}>
                    <textarea ref={v.inputRef} rows={"1"} value={v.draft ?? ''} onChange={v.onDraft} onKeyDown={v.onKey} placeholder={v.placeholder} style={{ flex: "1", minWidth: "0", minHeight: "46px", maxHeight: "140px", padding: "12px 0", border: "0", background: "transparent", color: v.t?.ink, font: "500 16px/1.4 Urbanist", outline: "none", resize: "none" }}></textarea>
                    <button type={"submit"} aria-label={"Enviar"} disabled={v.busy} style={{ flex: "none", width: "46px", height: "46px", borderRadius: "50%", border: "0", background: v.sendBg, color: v.t?.onAccent, display: "grid", placeItems: "center", cursor: "pointer", transition: "background .2s" }}>
                      <Icon n={"arrow-up"} s={"20"} />
                    </button>
                  </form>
                  <span style={{ font: "500 12px/1.4 Urbanist", color: v.t?.faint, textAlign: "center" }}>
                    Cápsulas de IA podem errar. Não substituem profissionais de saúde. Em crise, ligue 188.
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {v.showAside ? (
          <>
            <aside style={{ flex: "none", width: "290px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "18px 12px", display: "flex", flexDirection: "column", gap: "6px", flex: "1", minHeight: "0", overflowY: "auto" }}>
                <span style={{ font: "700 16px Urbanist", padding: "0 8px 8px" }}>
                  {v.histTitle}
                </span>
                {(v.hist || []).map((h, $index) => (
                  <Fragment key={$index}>
                    <button onClick={h?.go} style={{ border: "0", borderRadius: "16px", background: h?.bg, color: v.t?.ink, padding: "12px", display: "flex", flexDirection: "column", gap: "3px", textAlign: "left", cursor: "pointer", transition: "background .2s" }}>
                      <span style={{ font: "700 14px/1.3 Urbanist" }}>
                        {h?.title}
                      </span>
                      <span style={{ font: "500 12px Urbanist", color: v.t?.faint }}>
                        {h?.when}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              {v.isMind ? (
                <>
                  <button onClick={v.forward} style={{ flex: "none", borderRadius: "24px", border: "0", background: v.t?.hero, color: v.t?.heroInk, padding: "18px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left" }}>
                    <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "40px", height: "40px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                    <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ font: "700 15px Urbanist" }}>
                        Encaminhar ao Maestro
                      </span>
                      <span style={{ font: "500 12.5px/1.35 Urbanist", color: v.t?.heroMuted }}>
                        Ele continua a conversa e sugere outras mentes.
                      </span>
                    </span>
                  </button>
                </>
              ) : null}
            </aside>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
