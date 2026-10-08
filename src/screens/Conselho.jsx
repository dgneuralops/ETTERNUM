import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { streamReply, synthesize, AiUnavailable } from '../lib/ai.js';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

const Q = 'Estou pensando em sair da agência para viver só de freelas de design. Tenho medo de não ter clientes suficientes.';
const ANS = {
  drucker: 'Comece pelo cliente, não pela sua vontade de sair. Quem paga você hoje, e por quê? Se três clientes já contratam você com frequência, existe um negócio. Se não, ainda é um desejo. Meça antes de decidir.',
  christensen: 'Pergunte que “trabalho” os seus clientes contratam você para fazer. Talvez não seja “design”, e sim “parecer profissional rápido”. Quem entende esse trabalho cobra melhor e depende menos de volume.',
  jobs: 'Você vai passar a maior parte da vida trabalhando. Se a agência já não te move, isso importa. Mas foque: escolha um tipo de projeto que você faria de graça e seja a melhor nele.',
  collins: 'Disciplina antes do salto. Monte o seu “volante”: um cliente satisfeito indica o próximo. Primeiro as pessoas certas, depois o que fazer. Que clientes você quer ter daqui a cinco anos?',
};
const STEPS = ['Liste os três clientes de freela que mais pagam e pergunte se contratariam mais.', 'Defina uma meta de receita mensal e alcance-a três meses seguidos antes de pedir demissão.', 'Escolha um nicho em que você seja a primeira opção.'];
const generic = m => `Olhando pelas minhas ideias: ${m.quote.charAt(0).toLowerCase() + m.quote.slice(1)} Antes de decidir, separe o que é medo do que é informação. O que você já sabe, com fatos, sobre os seus clientes?`;

export default class Conselho extends React.Component {
  state = { sel: ['drucker', 'christensen', 'jobs'], draft: '', round: null, past: [] };
  componentDidMount() { if ((this.props.app || {}).variant === 'resultado') this.run(Q, true); }
  componentWillUnmount() { clearInterval(this.ti); this.ctrl && this.ctrl.abort(); }
  run(q, instant) {
    if (!instant && !this.demo) return this.runLive(q);
    const E = ETT;
    if (this.state.round) this.setState(s => ({ past: [...s.past, s.round.q] }));
    const texts = this.state.sel.map(k => ANS[k] || generic(E.bySlug[k]));
    const round = { q, sel: [...this.state.sel], texts, n: texts.map(x => instant ? x.length : 0), start: this.state.sel.map((_, i) => 6 + i * 10), tick: instant ? 999 : 0, synth: !!instant };
    this.setState({ round, draft: '' });
    if (instant) return;
    clearInterval(this.ti);
    this.ti = setInterval(() => this.setState(s => {
      const r = s.round; if (!r) return null;
      const tick = r.tick + 1;
      const n = r.n.map((v, i) => tick > r.start[i] ? Math.min(r.texts[i].length, v + 2 + (i % 2)) : v);
      const done = n.every((v, i) => v >= r.texts[i].length);
      if (done) { clearInterval(this.ti); setTimeout(() => this.setState(st => ({ round: st.round && { ...st.round, synth: true } })), 600); }
      return { round: { ...r, tick, n } };
    }), 22);
  }
  // Live Conselho: every selected mind answers in parallel, then the Maestro writes the synthesis.
  async runLive(q) {
    const E = ETT, area = E.areaBySlug[(this.props.app || {}).param] || E.areaBySlug.negocios;
    const sel = [...this.state.sel];
    if (this.state.round) this.setState(s => ({ past: [...s.past, s.round.q] }));
    const blank = sel.map(() => '');
    this.setState({ round: { q, sel, texts: blank, n: sel.map(() => 0), start: [], tick: 0, synth: false, live: true }, draft: '' });
    this.ctrl && this.ctrl.abort();
    const ctrl = this.ctrl = new AbortController();
    const plain = t => t.replace(/\*\*/g, '').replace(/^\s*[->]\s?/gm, '').replace(/\[\[[^\]]*\]\]/g, '').trim();
    const put = (i, t) => this.setState(s => { if (!s.round || !s.round.live || ctrl.signal.aborted) return null; const texts = s.round.texts.slice(), n = s.round.n.slice(); texts[i] = t; n[i] = t.length; return { round: { ...s.round, texts, n } }; });
    try {
      const prompt = `Estou levando esta situação ao Conselho de ${area.name} do Etternum. Responda em até 4 frases, sem listas, com o seu ponto de vista mais característico.\n\n${q}`;
      const texts = await Promise.all(sel.map((k, i) => streamReply({ mind: k, messages: [{ role: 'user', content: prompt }], signal: ctrl.signal, onDelta: t => put(i, plain(t)) }).then(r => plain(r.text))));
      let syn = null;
      try { syn = await synthesize({ area: area.slug, question: q, answers: sel.map((slug, i) => ({ slug, text: texts[i] })), signal: ctrl.signal }); } catch (e) { if (e.name === 'AbortError') return; }
      this.setState(s => ({ round: s.round && { ...s.round, texts, n: texts.map(t => t.length), synth: true, syn } }));
    } catch (e) {
      if (e.name === 'AbortError') return;
      if (e instanceof AiUnavailable) { this.demo = true; return this.setState({ round: null }, () => this.run(q)); }
      const msg = 'Não consegui responder agora. Tente enviar de novo.';
      this.setState(s => ({ round: s.round && { ...s.round, texts: s.round.texts.map(t => t || msg), n: s.round.texts.map(t => (t || msg).length), synth: false, live: false, failed: true } }));
    }
  }
  renderVals() {
    const a = this.props.app || {}, E = ETT, t = a.t || {}, s = this.state, mob = !!a.mobile;
    if (!E) return {};
    const nav = (r, p) => a.nav && a.nav(r, p);
    const area = E.areaBySlug[a.param] || E.areaBySlug.negocios;
    const blocked = a.plan === 'free' || a.variant === 'bloqueio';
    const poolSlugs = E.minds.filter(m => m.areas.includes(area.slug)).map(m => m.slug);
    const r = s.round;
    const busy = !!r && !r.synth && !r.failed;
    return {
      t, desktop: !mob && (a.w || 1440) >= 1100, cols: mob || (a.w || 1440) < 1100 ? 'minmax(0,1fr)' : 'minmax(0,1fr) 290px', h1: mob ? '30px' : '42px',
      area, past: s.past.map(q => ({ q: q.length > 60 ? q.slice(0, 60) + '…' : q, go: () => {} })),
      hasRound: !!r, roundQ: r ? r.q : '',
      resCols: mob ? '1fr' : (r && r.sel.length === 4 ? '1fr 1fr' : r && r.sel.length === 1 ? '1fr' : 'repeat(auto-fit,minmax(240px,1fr))'),
      answers: r ? r.sel.map((k, i) => { const m = E.bySlug[k]; return { slug: k, name: m.name, ini: E.initials(m.name), spec: m.spec.split(' · ')[0], text: r.texts[i].slice(0, r.n[i]), waiting: r.n[i] === 0, typing: r.live && !r.synth ? r.n[i] > 0 : r.n[i] > 0 && r.n[i] < r.texts[i].length, delay: i * 80 + 'ms' }; }) : [],
      dots: [0, .16, .32].map(d => React.createElement('span', { key: d, style: { width: 7, height: 7, borderRadius: '50%', background: '#E0C78E', display: 'inline-block', animation: `etPulse 1.2s ${d}s infinite ease-in-out` } })),
      synth: !!(r && r.synth), synPad: mob ? '22px' : '30px', synCols: mob ? '1fr' : '1fr 1fr', steps: (r && r.syn && r.syn.passos.length ? r.syn.passos : STEPS).map((text, i) => ({ n: i + 1, text })), synAgree: r && r.syn && r.syn.concordam || 'Antes de sair, transforme os freelas num teste real: clientes recorrentes e receita previsível.', synDiverge: r && r.syn && r.syn.divergem || 'Jobs valoriza seguir o que te move agora; Drucker e Collins pedem disciplina e números antes do salto.',
      blocked, canAsk: !blocked, goPlano: () => nav('plano'), goMaestro: () => nav('maestro'),
      count: s.sel.length, countColor: s.sel.length === 4 ? t.accentText : t.muted,
      pool: poolSlugs.map(k => { const m = E.bySlug[k]; const on = s.sel.includes(k); const dis = !on && s.sel.length >= 4; return { slug: k, name: m.name, ini: E.initials(m.name), on, disabled: dis, bg: on ? t.accentSoft : t.card2, ring: on ? t.accent : t.line, ringW: on ? '2px' : '1px', fg: t.ink, op: dis ? .45 : 1, cursor: dis ? 'not-allowed' : 'pointer', toggle: () => this.setState(st => ({ sel: on ? st.sel.filter(x => x !== k) : [...st.sel, k] })) }; }),
      draft: s.draft, onDraft: e => this.setState({ draft: e.target.value }), placeholder: `Conte ao Conselho de ${area.name} o que está acontecendo…`,
      submit: e => { e.preventDefault(); if (busy || !s.sel.length) return; this.run(s.draft.trim() || Q); }, busy, sendBg: busy || !s.sel.length ? t.card3 : t.accent,
      hist: [['NEGÓCIOS & LIDERANÇA', 'Largar a agência e viver de freelas?', 'Ontem'], ['RELACIONAMENTOS', 'Como dizer não para a minha mãe', '26 set'], ['VIDA INTERIOR', 'Ansiedade antes de apresentações', '19 set']].map(([area, title, when], i) => ({ area, title, when, bg: i === 0 ? t.card2 : 'transparent' })),
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div data-screen-label={"11 Conselho"} style={{ display: "grid", gridTemplateColumns: v.cols, gap: "20px", alignItems: "start", color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        <div style={{ minWidth: "0", display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ font: "800 12.5px Urbanist", letterSpacing: ".2em", color: v.t?.accentText }}>
              CONSELHO
            </span>
            <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
              {v.area?.name}
            </h1>
            <p style={{ margin: "0", maxWidth: "640px", font: "500 16.5px/1.55 Urbanist", color: v.t?.muted }}>
              Escolha até 4 mentes, conte sua situação e receba a perspectiva de cada uma — e uma síntese do Maestro com próximos passos.
            </p>
          </div>
          {(v.past || []).map((p, $index) => (
            <Fragment key={$index}>
              <button onClick={p?.go} style={{ borderRadius: "20px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", cursor: "pointer" }}>
                <Icon n={"history"} s={"18"} c={v.t?.faint} />
                <span style={{ flex: "1", font: "600 14.5px/1.35 Urbanist" }}>
                  {"Rodada anterior · "}{p?.q}
                </span>
                <Icon n={"chevron-down"} s={"18"} c={v.t?.faint} />
              </button>
            </Fragment>
          ))}
          {v.hasRound ? (
            <>
              <div style={{ alignSelf: "flex-end", maxWidth: "86%", padding: "14px 20px", borderRadius: "24px 24px 6px 24px", background: "#E0C78E", color: "#14110A", font: "600 16px/1.5 Urbanist" }}>
                {v.roundQ}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.resCols, gap: "12px" }}>
                {(v.answers || []).map((r, $index) => (
                  <Fragment key={$index}>
                    <div style={{ borderRadius: "24px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "18px", display: "flex", flexDirection: "column", gap: "12px", animation: "etIn .4s both", animationDelay: r?.delay }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ position: "relative", flex: "none", width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                          <ImageSlot id={`mind-${r?.slug ?? ''}`} shape={"circle"} compact placeholder={r?.ini} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                          <span style={{ font: "700 16px Urbanist" }}>
                            {r?.name}
                          </span>
                          <span style={{ font: "600 12px Urbanist", color: v.t?.accentText }}>
                            {r?.spec}
                          </span>
                        </div>
                      </div>
                      {r?.waiting ? (
                        <>
                          <span style={{ display: "inline-flex", gap: "6px", alignSelf: "flex-start", padding: "12px 15px", borderRadius: "999px", background: v.t?.card2 }}>
                            {v.dots}
                          </span>
                        </>
                      ) : null}
                      <p style={{ margin: "0", font: "500 15px/1.65 Urbanist", color: v.t?.ink }}>
                        {r?.text}
                        {r?.typing ? (
                          <>
                            <span style={{ display: "inline-block", width: "2px", height: "15px", marginLeft: "2px", verticalAlign: "-2px", background: "#E0C78E", animation: "etBlink 1s steps(1) infinite" }}></span>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </Fragment>
                ))}
              </div>
              {v.synth ? (
                <>
                  <div style={{ borderRadius: "30px", background: v.t?.hero, color: v.t?.heroInk, boxShadow: "inset 0 0 0 1px rgba(224,199,142,.45)", padding: v.synPad, display: "flex", flexDirection: "column", gap: "22px", animation: "etIn .5s both" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "48px", height: "48px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ font: "700 22px Urbanist", letterSpacing: "-.01em" }}>
                          Síntese do Maestro
                        </span>
                        <span style={{ font: "500 13.5px Urbanist", color: v.t?.heroMuted }}>
                          O que o Conselho disse, em poucas linhas.
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: v.synCols, gap: "12px" }}>
                      <div style={{ borderRadius: "20px", background: "rgba(255,255,255,.05)", padding: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ display: "flex", gap: "8px", alignItems: "center", font: "700 15px Urbanist", color: "#A4DD8C" }}>
                          <Icon n={"check-check"} s={"17"} />
                          Onde concordam
                        </span>
                        <span style={{ font: "500 15px/1.55 Urbanist", color: "#E9E4DA" }}>
                          {v.synAgree}
                        </span>
                      </div>
                      <div style={{ borderRadius: "20px", background: "rgba(255,255,255,.05)", padding: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ display: "flex", gap: "8px", alignItems: "center", font: "700 15px Urbanist", color: "#F3A977" }}>
                          <Icon n={"split"} s={"17"} />
                          Onde divergem
                        </span>
                        <span style={{ font: "500 15px/1.55 Urbanist", color: "#E9E4DA" }}>
                          {v.synDiverge}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <span style={{ font: "700 15px Urbanist", color: "#E0C78E" }}>
                        Próximos passos
                      </span>
                      {(v.steps || []).map((s, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                            <span style={{ flex: "none", width: "30px", height: "30px", borderRadius: "50%", background: "#E0C78E", color: "#14110A", display: "grid", placeItems: "center", font: "800 14px Urbanist" }}>
                              {s?.n}
                            </span>
                            <span style={{ paddingTop: "4px", font: "500 15.5px/1.5 Urbanist", color: "#F3EFE6" }}>
                              {s?.text}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
          {v.blocked ? (
            <>
              <div style={{ borderRadius: "26px", background: v.t?.hero, color: v.t?.heroInk, boxShadow: "inset 0 0 0 1px rgba(224,199,142,.4)", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ flex: "none", width: "42px", height: "42px", borderRadius: "50%", background: "rgba(224,199,142,.16)", display: "grid", placeItems: "center" }}>
                    <Icon n={"lock-keyhole"} s={"19"} c={"#E0C78E"} />
                  </span>
                  <span style={{ font: "700 18px/1.35 Urbanist" }}>
                    O Conselho com várias mentes é exclusivo do plano Premium.
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
          {v.canAsk ? (
            <>
              <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ font: "700 16px Urbanist" }}>
                    Conselheiros
                  </span>
                  <span style={{ font: "700 14px Urbanist", color: v.countColor }}>
                    {v.count}/4
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {(v.pool || []).map((m, $index) => (
                    <Fragment key={$index}>
                      <button onClick={m?.toggle} disabled={m?.disabled} style={{ height: "48px", padding: "0 16px 0 5px", borderRadius: "999px", border: "0", background: m?.bg, boxShadow: `inset 0 0 0 ${m?.ringW ?? ''} ${m?.ring ?? ''}`, color: m?.fg, font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "10px", cursor: m?.cursor, opacity: m?.op, transition: "background .2s,box-shadow .2s" }}>
                        <div style={{ position: "relative", flex: "none", width: "38px", height: "38px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                          <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"circle"} compact placeholder={m?.ini} />
                        </div>
                        {m?.name}
                        {m?.on ? (
                          <>
                            <Icon n={"check"} s={"15"} />
                          </>
                        ) : null}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <form onSubmit={v.submit} style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "6px 6px 6px 18px", borderRadius: "24px", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}` }}>
                  <textarea rows={"2"} value={v.draft ?? ''} onChange={v.onDraft} placeholder={v.placeholder} style={{ flex: "1", minWidth: "0", minHeight: "56px", padding: "10px 0", border: "0", background: "transparent", color: v.t?.ink, font: "500 16px/1.45 Urbanist", outline: "none", resize: "none" }}></textarea>
                  <button type={"submit"} disabled={v.busy} style={{ flex: "none", height: "48px", padding: "0 20px", borderRadius: "999px", border: "0", background: v.sendBg, color: v.t?.onAccent, font: "700 15px Urbanist", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    Perguntar
                    <Icon n={"arrow-up"} s={"17"} />
                  </button>
                </form>
              </div>
            </>
          ) : null}
        </div>
        {v.desktop ? (
          <>
            <aside style={{ borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "18px 12px", display: "flex", flexDirection: "column", gap: "6px", position: "sticky", top: "0" }}>
              <span style={{ font: "700 16px Urbanist", padding: "0 8px 8px" }}>
                Conselhos anteriores
              </span>
              {(v.hist || []).map((h, $index) => (
                <Fragment key={$index}>
                  <div style={{ borderRadius: "16px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px", background: h?.bg }}>
                    <span style={{ font: "700 11px Urbanist", letterSpacing: ".1em", color: v.t?.accentText }}>
                      {h?.area}
                    </span>
                    <span style={{ font: "700 14px/1.3 Urbanist" }}>
                      {h?.title}
                    </span>
                    <span style={{ font: "500 12px Urbanist", color: v.t?.faint }}>
                      {h?.when}
                    </span>
                  </div>
                </Fragment>
              ))}
            </aside>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
