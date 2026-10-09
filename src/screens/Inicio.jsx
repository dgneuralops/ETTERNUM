import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';
import { listConversas, quando } from '../lib/supabase.js';

export default class Inicio extends React.Component {
  state = { msg: '', last: null };
  carRef = React.createRef();
  componentDidMount() {
    const a = this.props.app || {};
    if (a.loggedIn) listConversas({ tipo: 'mente' }).then(l => l[0] && this.setState({ last: l[0] })).catch(() => {});
  }
  // "Continuar de onde parei": the latest conversation with a mind; before any, the first triagem pick.
  cont(a, E, nav) {
    const u = a.user || {}, last = this.state.last;
    if (last && E.bySlug[last.slug]) return { cont: { slug: last.slug, name: E.bySlug[last.slug].name, title: last.titulo, when: quando(last.updated_at), kicker: 'Continuar de onde parei', cta: 'Continuar conversa' }, goCont: () => nav('mente', last.slug) };
    if (u.demo) return { cont: { slug: 'frankl', name: 'Viktor Frankl', title: 'Reencontrar o porquê no trabalho', when: 'Ontem, 22:14', kicker: 'Continuar de onde parei', cta: 'Continuar conversa' }, goCont: () => nav('mente', 'frankl', 'conversa') };
    const slug = (u.recomendadas || []).find(k => E.bySlug[k]) || 'frankl', m = E.bySlug[slug];
    return { cont: { slug, name: m.name, title: m.spec.split(' · ')[0], when: 'Para você', kicker: 'Recomendada na sua triagem', cta: 'Começar conversa' }, goCont: () => nav('mente', slug) };
  }
  renderVals() {
    const a = this.props.app || {}, E = ETT, t = a.t || {}, mob = !!a.mobile;
    if (!E) return {};
    const nav = (r, p, v) => a.nav && a.nav(r, p, v);
    const favs = Object.keys(a.favs || {}).filter(k => a.favs[k] && E.bySlug[k]);
    const prio = ['vida-interior', 'relacionamentos', 'negocios', 'filosofia', 'luto', 'espiritualidade'];
    return {
      t, u: a.user || {}, saudacao: (h => h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite')(new Date().getHours()), mobile: mob, desktop: !mob, cols: mob || (a.w || 1440) < 1180 ? 'minmax(0,1fr)' : 'minmax(0,1fr) 310px',
      h1: mob ? '30px' : '34px', h2: mob ? '26px' : '32px', heroPad: mob ? '22px' : '28px 32px', heroDir: mob ? 'column' : 'row', heroGap: mob ? '18px' : '30px', heroAlign: mob ? 'flex-start' : 'center',
      medal: mob ? '64px' : '120px', medalIcon: mob ? '32' : '60', sendPad: mob ? '12px' : '22px',
      areaCols: mob ? '1fr 1fr' : 'repeat(3,1fr)', tileH: mob ? '128px' : '132px',
      carMargin: mob ? '0 -16px' : '0', carPadding: mob ? '0 16px' : '0',
      msg: this.state.msg, onMsg: e => this.setState({ msg: e.target.value }),
      send: e => { e.preventDefault(); nav('maestro', '', 'msg:' + (this.state.msg || 'Estou exausta e sem saber se continuo no meu emprego.')); },
      suggestions: ['Hoje eu só preciso desabafar.', 'Estou confuso(a) e não sei por onde começar.', 'Quem pode me ajudar com meu negócio?'].map(label => ({ label, go: () => nav('maestro', '', 'msg:' + label) })),
      areas: prio.map((slug, i) => { const ar = E.areaBySlug[slug]; return { ...ar, bg: t.pastel[ar.p], tag: i < 3 ? 'Do seu interesse' : `${ar.n} mentes`, go: () => nav('area', slug) }; }),
      minds: E.carousel.slice(0, 12).map(m => { const on = !!(a.favs || {})[m.slug]; return { ...m, short: m.spec.split(' · ')[0], starBg: on ? '#E0C78E' : 'rgba(11,11,12,.5)', starFg: on ? '#14110A' : '#F3EFE6', fav: () => a.toggleFav(m.slug), go: () => nav('mente', m.slug) }; }),
      carRef: this.carRef, prev: () => this.carRef.current?.scrollBy({ left: -224 }), next: () => this.carRef.current?.scrollBy({ left: 224 }),
      favs: favs.map((k, i) => { const m = E.bySlug[k]; return { ...m, ini: E.initials(m.name), first: m.name.split(' ').slice(-1)[0], short: m.spec.split(' · ')[0], bg: t.pastel[i % 6], go: () => nav('mente', k) }; }),
      hasFavs: favs.length > 0, noFavs: favs.length === 0,
      ...this.cont(a, E, nav), goAreas: () => nav('areas'), goMentes: () => nav('mentes'), goMemoria: () => nav('memoria'), goPerfil: () => nav('perfil'),
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div data-screen-label={"05 Início"} style={{ display: "grid", gridTemplateColumns: v.cols, gap: "20px", alignItems: "start", color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        <div style={{ minWidth: "0", display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
              {v.saudacao + ", "}
              <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                {v.u?.primeiro}
              </span>
            </h1>
            <span style={{ height: "30px", padding: "0 12px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 13px Urbanist", display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ fontFamily: "'EB Garamond',serif", fontSize: "15px" }}>
                {v.u?.signoSym}︎
              </span>
              {v.u?.signo}
            </span>
          </div>
          <section style={{ borderRadius: "30px", background: v.t?.hero, color: v.t?.heroInk, padding: v.heroPad, display: "flex", flexDirection: v.heroDir, gap: v.heroGap, alignItems: v.heroAlign }}>
            <div role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: v.medal, height: v.medal, borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", animation: "etGlow 4s ease-in-out infinite", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></div>
            <div style={{ flex: "1", minWidth: "0", width: "100%", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h2 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.1 Urbanist`, letterSpacing: "-.02em" }}>
                  {"Como você está "}
                  <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: "#E0C78E" }}>
                    hoje?
                  </span>
                </h2>
                <span style={{ font: "500 15px/1.45 Urbanist", color: v.t?.heroMuted }}>
                  Aurelius, o Maestro, seu amigo pessoal eterno, está ouvindo.
                </span>
              </div>
              <form onSubmit={v.send} style={{ minHeight: "56px", borderRadius: "28px", background: v.t?.heroInput, display: "flex", alignItems: "center", padding: "6px 6px 6px 20px", gap: "8px" }}>
                <input value={v.msg ?? ''} onChange={v.onMsg} placeholder={"Desabafe, pergunte, peça um conselho…"} style={{ flex: "1", minWidth: "0", height: "44px", border: "0", background: "transparent", color: "#F3EFE6", font: "500 16px Urbanist", outline: "none" }} />
                <button type={"submit"} style={{ flex: "none", height: "44px", padding: `0 ${v.sendPad ?? ''}`, borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 15px Urbanist", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "background .2s" }} className="inic-h1">
                  {v.desktop ? (
                    <>
                      Conversar
                    </>
                  ) : null}
                  {v.mobile ? (
                    <>
                      <Icon n={"arrow-up"} s={"18"} />
                    </>
                  ) : null}
                </button>
              </form>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {(v.suggestions || []).map((s, $index) => (
                  <Fragment key={$index}>
                    <button onClick={s?.go} style={{ minHeight: "34px", padding: "6px 14px", borderRadius: "999px", border: "0", background: "transparent", boxShadow: `inset 0 0 0 1px ${v.t?.heroLine ?? ''}`, color: v.t?.heroInk, font: "600 13px Urbanist", cursor: "pointer", textAlign: "left", transition: "background .2s" }} className="inic-h2">
                      {s?.label}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </section>
          {v.mobile ? (
            <>
              <button onClick={v.goCont} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 16px 10px 10px", borderRadius: "24px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, cursor: "pointer", textAlign: "left" }}>
                <div style={{ position: "relative", flex: "none", width: "60px", height: "60px", borderRadius: "18px", overflow: "hidden", background: "#1A1510", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                  <ImageSlot id={`mind-${v.cont.slug}`} shape={"rect"} placeholder={v.cont.name} />
                </div>
                <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ font: "600 12px Urbanist", color: v.t?.muted }}>
                    {v.cont.kicker}
                  </span>
                  <span style={{ font: "700 15.5px/1.25 Urbanist" }}>
                    {v.cont.name} · {v.cont.title}
                  </span>
                </div>
                <Icon n={"chevron-right"} s={"20"} c={v.t?.muted} />
              </button>
            </>
          ) : null}
          {v.mobile ? (
            <>
              <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ margin: "0", font: "700 20px Urbanist" }}>
                    Seu Quadro Eterno
                  </h3>
                </div>
                {v.hasFavs ? (
                  <>
                    <div style={{ display: "flex", gap: "16px", overflowX: "auto", scrollbarWidth: "none", margin: "0 -16px", padding: "0 16px" }}>
                      {(v.favs || []).map((f, $index) => (
                        <Fragment key={$index}>
                          <button onClick={f?.go} style={{ flex: "none", width: "84px", border: "0", background: "transparent", color: v.t?.ink, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", padding: "0" }}>
                            <div style={{ position: "relative", width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", boxShadow: `0 0 0 2px ${v.t?.bg ?? ''},0 0 0 3.5px #E0C78E`, filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                              <ImageSlot id={`mind-${f?.slug ?? ''}`} shape={"circle"} compact placeholder={f?.ini} />
                            </div>
                            <span style={{ font: "700 12.5px/1.2 Urbanist", textAlign: "center" }}>
                              {f?.first}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.noFavs ? (
                  <>
                    <div style={{ borderRadius: "22px", padding: "22px", boxShadow: `inset 0 0 0 1.5px ${v.t?.line2 ?? ''}`, display: "flex", gap: "14px", alignItems: "center" }}>
                      <Icon n={"star"} s={"24"} c={v.t?.accentText} />
                      <span style={{ font: "500 14.5px/1.5 Urbanist", color: v.t?.muted }}>
                        Toque na estrela de qualquer mente para mantê-la sempre à mão aqui.
                      </span>
                    </div>
                  </>
                ) : null}
              </section>
            </>
          ) : null}
          <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ margin: "0", font: "700 20px Urbanist" }}>
                Áreas da vida
              </h3>
              <button onClick={v.goAreas} style={{ border: "0", background: "transparent", color: v.t?.muted, font: "700 14px Urbanist", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                Ver todas
                <Icon n={"arrow-right"} s={"15"} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: v.areaCols, gap: "12px" }}>
              {(v.areas || []).map((a, $index) => (
                <Fragment key={$index}>
                  <button onClick={a?.go} style={{ minHeight: v.tileH, borderRadius: "24px", border: "0", background: a?.bg, color: "#15130E", padding: "18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px", cursor: "pointer", textAlign: "left", transition: "transform .25s cubic-bezier(.25,.1,.25,1)" }} className="inic-h3">
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ font: "800 28px/1 Urbanist", letterSpacing: "-.03em" }}>
                        {a?.n}
                      </span>
                      <span style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(21,19,14,.08)", display: "grid", placeItems: "center" }}>
                        <Icon n={a?.icon} s={"20"} />
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ font: "700 15.5px/1.2 Urbanist" }}>
                        {a?.short}
                      </span>
                      <span style={{ font: "500 12.5px Urbanist", opacity: ".7" }}>
                        {a?.tag}
                      </span>
                    </div>
                  </button>
                </Fragment>
              ))}
            </div>
          </section>
          <section style={{ display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ margin: "0", font: "700 20px Urbanist" }}>
                Grandes mentes
              </h3>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button onClick={v.goMentes} style={{ border: "0", background: "transparent", color: v.t?.muted, font: "700 14px Urbanist", cursor: "pointer", marginRight: "6px" }}>
                  Ver todas
                </button>
                {v.desktop ? (
                  <>
                    <button onClick={v.prev} aria-label={"Anterior"} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "0", background: v.t?.card2, color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer" }}>
                      <Icon n={"chevron-left"} s={"18"} />
                    </button>
                    <button onClick={v.next} aria-label={"Próximo"} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "0", background: v.t?.accent, color: v.t?.onAccent, display: "grid", placeItems: "center", cursor: "pointer" }}>
                      <Icon n={"chevron-right"} s={"18"} />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <div ref={v.carRef} style={{ display: "flex", gap: "12px", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", scrollbarWidth: "none", margin: v.carMargin, padding: v.carPadding }}>
              {(v.minds || []).map((m, $index) => (
                <Fragment key={$index}>
                  <div style={{ flex: "none", width: "212px", scrollSnapAlign: "start", borderRadius: "24px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "8px 8px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ position: "relative", height: "200px", borderRadius: "18px", overflow: "hidden", background: "#1A1510" }}>
                      <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                        <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"rect"} placeholder={m?.name} />
                      </div>
                      {m?.inspired ? (
                        <>
                          <span title={"Cápsula de um especialista nas ideias desta pessoa — não é uma simulação dela."} style={{ position: "absolute", left: "8px", top: "8px", height: "24px", padding: "0 9px", borderRadius: "999px", background: "rgba(11,11,12,.7)", color: "#E0C78E", font: "700 10.5px Urbanist", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Icon n={"feather"} s={"11"} />
                            Inspirado em
                          </span>
                        </>
                      ) : null}
                      <button onClick={m?.fav} aria-label={"Favoritar"} style={{ position: "absolute", top: "6px", right: "6px", width: "36px", height: "36px", borderRadius: "50%", border: "0", background: m?.starBg, color: m?.starFg, display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(8px)", transition: "background .2s,transform .2s" }} className="inic-a4">
                        <Icon n={"star"} s={"16"} />
                      </button>
                    </div>
                    <div style={{ padding: "0 6px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ font: "700 16px/1.15 Urbanist" }}>
                        {m?.name}
                      </span>
                      <span style={{ alignSelf: "flex-start", height: "22px", padding: "0 10px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 11px Urbanist", display: "flex", alignItems: "center" }}>
                        {m?.short}
                      </span>
                      <button onClick={m?.go} style={{ alignSelf: "flex-end", border: "0", background: "transparent", color: v.t?.ink, font: "700 13.5px Urbanist", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", padding: "4px 0" }}>
                        Conversar
                        <Icon n={"arrow-right"} s={"14"} />
                      </button>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
          {v.mobile ? (
            <>
              <button onClick={v.goMemoria} style={{ borderRadius: "24px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.accentLine ?? ''}`, padding: "20px", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", color: v.t?.ink, cursor: "pointer" }}>
                <span style={{ font: "700 11px Urbanist", letterSpacing: ".12em", color: v.t?.accentText }}>
                  EM BREVE · PREMIUM
                </span>
                <span style={{ font: "700 18px/1.2 Urbanist" }}>
                  Cápsula de Memória Viva
                </span>
                <span style={{ font: "500 14px/1.45 Urbanist", color: v.t?.muted }}>
                  Eternize a sua história ou a de alguém que você ama.
                </span>
              </button>
            </>
          ) : null}
        </div>
        {v.desktop ? (
          <>
            <aside style={{ display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "0" }}>
              <div style={{ borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "10px 10px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ position: "relative", height: "150px", borderRadius: "18px", overflow: "hidden", background: "#1A1510" }}>
                  <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                    <ImageSlot id={`mind-${v.cont.slug}`} shape={"rect"} placeholder={v.cont.name} />
                  </div>
                  <span style={{ position: "absolute", left: "10px", bottom: "10px", height: "26px", padding: "0 10px", borderRadius: "999px", background: "rgba(0,0,0,.6)", color: "#F3EFE6", font: "600 11.5px Urbanist", display: "flex", alignItems: "center", pointerEvents: "none" }}>
                    {v.cont.when}
                  </span>
                </div>
                <div style={{ padding: "0 6px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ font: "600 12.5px Urbanist", color: v.t?.muted }}>
                    {v.cont.kicker}
                  </span>
                  <span style={{ font: "700 17px/1.25 Urbanist" }}>
                    {v.cont.name} · {v.cont.title}
                  </span>
                </div>
                <button onClick={v.goCont} style={{ margin: "0 6px", height: "44px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 14.5px Urbanist", cursor: "pointer" }}>
                  {v.cont.cta}
                </button>
              </div>
              <div style={{ borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "18px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px" }}>
                  <span style={{ font: "700 17px Urbanist" }}>
                    Seu Quadro Eterno
                  </span>
                  <button onClick={v.goPerfil} style={{ border: "0", background: "transparent", color: v.t?.muted, font: "700 12.5px Urbanist", cursor: "pointer" }}>
                    Ver tudo
                  </button>
                </div>
                {v.hasFavs ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(v.favs || []).map((f, $index) => (
                        <Fragment key={$index}>
                          <button onClick={f?.go} style={{ height: "62px", borderRadius: "18px", border: "0", background: f?.bg, color: "#15130E", padding: "0 14px 0 9px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left", transition: "transform .2s" }} className="inic-h5">
                            <div style={{ position: "relative", flex: "none", width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                              <ImageSlot id={`mind-${f?.slug ?? ''}`} shape={"circle"} compact placeholder={f?.ini} />
                            </div>
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                              <span style={{ font: "700 14.5px Urbanist" }}>
                                {f?.name}
                              </span>
                              <span style={{ font: "500 12.5px Urbanist", opacity: ".7" }}>
                                {f?.short}
                              </span>
                            </div>
                            <Icon n={"arrow-up-right"} s={"16"} />
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {v.noFavs ? (
                  <>
                    <div style={{ borderRadius: "18px", padding: "22px 16px", boxShadow: `inset 0 0 0 1.5px ${v.t?.line2 ?? ''}`, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textAlign: "center" }}>
                      <Icon n={"star"} s={"26"} c={v.t?.accentText} />
                      <span style={{ font: "700 15px Urbanist" }}>
                        Seu Quadro Eterno está vazio
                      </span>
                      <span style={{ font: "500 13.5px/1.5 Urbanist", color: v.t?.muted }}>
                        Toque na estrela de qualquer mente para mantê-la sempre à mão aqui.
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              <button onClick={v.goMemoria} style={{ borderRadius: "26px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.accentLine ?? ''}`, padding: "20px", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", color: v.t?.ink, cursor: "pointer" }}>
                <span style={{ font: "700 11px Urbanist", letterSpacing: ".12em", color: v.t?.accentText }}>
                  EM BREVE · PREMIUM
                </span>
                <span style={{ font: "700 18px/1.2 Urbanist" }}>
                  Cápsula de Memória Viva
                </span>
                <span style={{ font: "500 13.5px/1.45 Urbanist", color: v.t?.muted }}>
                  Eternize a sua história ou a de alguém que você ama.
                </span>
                <span style={{ marginTop: "6px", font: "700 13.5px Urbanist", color: v.t?.accentText, display: "flex", alignItems: "center", gap: "4px" }}>
                  Conhecer
                  <Icon n={"arrow-right"} s={"14"} />
                </span>
              </button>
            </aside>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
