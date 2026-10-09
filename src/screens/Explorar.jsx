import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { signoCard } from '../lib/signos.js';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

export default class Explorar extends React.Component {
  state = { filter: 'todas' };
  renderVals() {
    const a = this.props.app || {}, E = ETT, t = a.t || {}, mob = !!a.mobile;
    if (!E) return {};
    const nav = (r, p, v) => a.nav && a.nav(r, p, v);
    const route = a.route, slug = a.param || 'negocios';
    const area = E.areaBySlug[slug] || E.areaBySlug.negocios;
    const free = a.plan === 'free';
    let list = route === 'area' ? E.minds.filter(m => m.areas.includes(area.slug)) : this.state.filter === 'todas' ? E.minds : E.minds.filter(m => m.areas.includes(this.state.filter));
    const card = (m, i) => { const fav = !!(a.favs || {})[m.slug]; const locked = free && m.slug !== 'seneca' || (route === 'mentes' && !free && m.slug === 'dalai' && a.variant === 'bloqueado'); return { ...m, delay: Math.min(i, 12) * 40 + 'ms',
      locked, filter: locked ? 'grayscale(1) brightness(.6)' : 'grayscale(1) sepia(.38) contrast(1.08) brightness(.88)',
      starBg: fav ? '#E0C78E' : 'rgba(11,11,12,.5)', starFg: fav ? '#14110A' : '#F3EFE6', fav: () => a.toggleFav(m.slug),
      cta: locked ? 'Disponível no Premium' : 'Acessar esta mente', btnBg: locked ? t.card2 : 'transparent', btnRing: locked ? t.line : t.accentLine, btnFg: locked ? t.muted : t.accentText,
      go: () => locked ? nav('plano') : nav('mente', m.slug) }; };
    const filters = [{ slug: 'todas', short: 'Todas' }, ...E.areas].map(f => { const on = this.state.filter === f.slug; return { label: f.short, icon: f.icon || '', hasIcon: !!f.icon, padL: f.icon ? '12px' : '16px', bg: on ? t.altBg : t.card, fg: on ? t.altFg : t.ink, ring: on ? 'transparent' : t.line, ic: on ? t.altFg : (f.color || t.ink), go: () => this.setState({ filter: f.slug }) }; });
    return {
      t, h1: mob ? '32px' : '44px',
      isAreas: route === 'areas', isArea: route === 'area', isMentes: route === 'mentes', isAstro: route === 'area' && area.slug === 'astrologia', showGrid: route !== 'areas',
      areaCols: mob ? '1fr' : 'repeat(auto-fill,minmax(230px,1fr))', areaH: mob ? '150px' : '190px',
      areas: E.areas.map(ar => ({ ...ar, bg: t.pastel[ar.p], go: () => nav('area', ar.slug) })),
      area: { ...area, tint: E.hexA(area.color, .14), ring: E.hexA(area.color, .35) }, bigIcon: mob ? '72px' : '96px', bigIconInner: mob ? '34' : '44', headDir: mob ? 'column' : 'row', headAlign: mob ? 'flex-start' : 'center',
      actCols: mob ? '1fr' : '1fr 1fr', goAreas: () => nav('areas'), goConselho: () => nav('conselho', area.slug), goMaestroArea: () => nav('maestro', '', 'area:' + area.slug),
      astroPad: mob ? '24px' : '36px', signSize: mob ? '88px' : '120px', signGlyph: mob ? '56px' : '76px', signCols: mob ? '1fr' : 'repeat(4,1fr)',
      signTags: signoCard((a.user || {}).signo).tags, signoNome: (a.user || {}).signo || 'Sagitário', signoSym: ((a.user || {}).signoSym || '♐') + '︎',
      signBlocks: signoCard((a.user || {}).signo).blocks,
      chipMargin: mob ? '0 -16px' : '0', chipPad: mob ? '0 16px' : '0',
      filters, minds: list.map(card), gridCols: mob ? '1fr 1fr' : 'repeat(auto-fill,minmax(240px,1fr))', imgH: mob ? '170px' : '230px',
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        {v.isAreas ? (
          <>
            <section data-screen-label={"07 Áreas"} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "620px" }}>
                <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                  {"Áreas da "}
                  <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                    vida
                  </span>
                </h1>
                <p style={{ margin: "0", font: "500 17px/1.5 Urbanist", color: v.t?.muted }}>
                  Escolha a área do que você está vivendo. Em cada uma, você conversa com uma mente, abre o Conselho ou pede ao Maestro que escolha por você.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.areaCols, gap: "12px" }}>
                {(v.areas || []).map((a, $index) => (
                  <Fragment key={$index}>
                    <button onClick={a?.go} style={{ minHeight: v.areaH, borderRadius: "26px", border: "0", background: a?.bg, color: "#15130E", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "16px", textAlign: "left", cursor: "pointer", transition: "transform .25s cubic-bezier(.25,.1,.25,1)" }} className="expl-h1">
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span style={{ width: "48px", height: "48px", borderRadius: "15px", background: "rgba(21,19,14,.08)", display: "grid", placeItems: "center" }}>
                          <Icon n={a?.icon} s={"23"} />
                        </span>
                        <span style={{ font: "700 13px Urbanist", opacity: ".7" }}>
                          {a?.n}{" mentes"}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "700 19px/1.15 Urbanist", letterSpacing: "-.01em" }}>
                          {a?.name}
                        </span>
                        <span style={{ font: "500 14px/1.45 Urbanist", opacity: ".72" }}>
                          {a?.phrase}
                        </span>
                      </div>
                    </button>
                  </Fragment>
                ))}
              </div>
            </section>
          </>
        ) : null}
        {v.isArea ? (
          <>
            <section data-screen-label={"08 Área"} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              <button onClick={v.goAreas} style={{ alignSelf: "flex-start", height: "36px", padding: "0 12px 0 6px", borderRadius: "999px", border: "0", background: "transparent", color: v.t?.muted, font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                <Icon n={"chevron-left"} s={"18"} />
                Áreas da vida
              </button>
              <div style={{ display: "flex", gap: "20px", alignItems: v.headAlign, flexDirection: v.headDir }}>
                <span style={{ flex: "none", width: v.bigIcon, height: v.bigIcon, borderRadius: "28px", background: v.area?.tint, boxShadow: `inset 0 0 0 1px ${v.area?.ring ?? ''}`, display: "grid", placeItems: "center" }}>
                  <Icon n={v.area?.icon} s={v.bigIconInner} c={v.area?.color} />
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                    {v.area?.name}
                  </h1>
                  <p style={{ margin: "0", font: "500 17px/1.5 Urbanist", color: v.t?.muted }}>
                    {v.area?.phrase}{" · "}{v.area?.n}{" mentes"}
                  </p>
                </div>
              </div>
              {v.isAstro ? (
                <>
                  <div style={{ position: "relative", borderRadius: "32px", overflow: "hidden", background: "radial-gradient(1.5px 1.5px at 12% 18%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 27% 62%,#fff 50%,transparent 51%),radial-gradient(1.2px 1.2px at 41% 28%,#E0C78E 50%,transparent 51%),radial-gradient(1px 1px at 58% 74%,#fff 50%,transparent 51%),radial-gradient(1.6px 1.6px at 71% 22%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 84% 58%,#E0C78E 50%,transparent 51%),radial-gradient(1px 1px at 92% 12%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 8% 82%,#fff 50%,transparent 51%),radial-gradient(1.2px 1.2px at 35% 90%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 66% 44%,#fff 50%,transparent 51%),radial-gradient(700px 400px at 85% 0%,rgba(185,166,242,.28),transparent 70%),radial-gradient(500px 300px at 0% 100%,rgba(224,199,142,.16),transparent 70%),#0C0B14", color: "#F3EFE6", padding: v.astroPad, display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ flex: "none", width: v.signSize, height: v.signSize, borderRadius: "50%", boxShadow: "inset 0 0 0 1px rgba(224,199,142,.45),0 0 60px rgba(185,166,242,.3)", display: "grid", placeItems: "center", font: `400 ${v.signGlyph ?? ''}/1 'EB Garamond',serif`, color: "#E0C78E" }}>
                        {v.signoSym}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                        <span style={{ font: "700 12px Urbanist", letterSpacing: ".16em", color: "#B9A6F2" }}>
                          SEU SIGNO SOLAR
                        </span>
                        <span style={{ font: `700 ${v.h1 ?? ''}/1 Urbanist`, letterSpacing: "-.025em" }}>
                          {v.signoNome}
                        </span>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                          {(v.signTags || []).map((g, $index) => (
                            <Fragment key={$index}>
                              <span style={{ height: "28px", padding: "0 12px", borderRadius: "999px", background: "rgba(255,255,255,.08)", font: "600 13px Urbanist", display: "flex", alignItems: "center" }}>
                                {g}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: v.signCols, gap: "10px" }}>
                      {(v.signBlocks || []).map((b, $index) => (
                        <Fragment key={$index}>
                          <div style={{ borderRadius: "22px", background: "rgba(255,255,255,.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)", padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <Icon n={b?.icon} s={"17"} c={b?.color} />
                              <span style={{ font: "700 15px Urbanist" }}>
                                {b?.title}
                              </span>
                            </div>
                            <span style={{ font: "500 14px/1.55 Urbanist", color: "#C9C3B8" }}>
                              {b?.text}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <span style={{ font: "500 12.5px/1.5 Urbanist", color: "#8A847A" }}>
                      Uma lente simbólica para conversar sobre o seu jeito de ser. Calculado pela sua data de nascimento.
                    </span>
                  </div>
                </>
              ) : null}
              <div style={{ display: "grid", gridTemplateColumns: v.actCols, gap: "12px" }}>
                <button onClick={v.goConselho} style={{ borderRadius: "26px", border: "0", background: v.t?.hero, color: v.t?.heroInk, padding: "24px", display: "flex", alignItems: "center", gap: "18px", textAlign: "left", cursor: "pointer", transition: "transform .2s" }} className="expl-h2">
                  <span style={{ flex: "none", width: "56px", height: "56px", borderRadius: "18px", background: "#E0C78E", color: "#14110A", display: "grid", placeItems: "center" }}>
                    <Icon n={"users-round"} s={"26"} />
                  </span>
                  <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ font: "700 19px Urbanist" }}>
                      Abrir o Conselho
                    </span>
                    <span style={{ font: "500 14.5px/1.45 Urbanist", color: v.t?.heroMuted }}>
                      Leve sua situação a várias mentes ao mesmo tempo.
                    </span>
                  </span>
                  <Icon n={"arrow-right"} s={"20"} c={"#E0C78E"} />
                </button>
                <button onClick={v.goMaestroArea} style={{ borderRadius: "26px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, padding: "24px", display: "flex", alignItems: "center", gap: "18px", textAlign: "left", cursor: "pointer", transition: "transform .2s" }} className="expl-h3">
                  <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "56px", height: "56px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                  <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ font: "700 19px Urbanist" }}>
                      Não sabe com quem falar?
                    </span>
                    <span style={{ font: "500 14.5px/1.45 Urbanist", color: v.t?.muted }}>
                      Conte ao Maestro, ele encaminha para a mente ideal.
                    </span>
                  </span>
                  <Icon n={"arrow-right"} s={"20"} c={v.t?.muted} />
                </button>
              </div>
              <h2 style={{ margin: "8px 0 0", font: "700 22px Urbanist" }}>
                Mentes desta área
              </h2>
            </section>
          </>
        ) : null}
        {v.isMentes ? (
          <>
            <section data-screen-label={"09 Todas as mentes"} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                  {"Todas as "}
                  <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                    mentes
                  </span>
                </h1>
                <p style={{ margin: "0", font: "500 17px/1.5 Urbanist", color: v.t?.muted }}>
                  61 cápsulas de grandes mentes da humanidade, cada uma alimentada com todos os livros e materiais do seu autor.
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", margin: v.chipMargin, padding: v.chipPad }}>
                {(v.filters || []).map((f, $index) => (
                  <Fragment key={$index}>
                    <button onClick={f?.go} style={{ flex: "none", height: "42px", padding: `0 16px 0 ${f?.padL ?? ''}`, borderRadius: "999px", border: "0", background: f?.bg, boxShadow: `inset 0 0 0 1px ${f?.ring ?? ''}`, color: f?.fg, font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", transition: "background .2s,color .2s" }}>
                      {f?.hasIcon ? (
                        <>
                          <Icon n={f?.icon} s={"16"} c={f?.ic} />
                        </>
                      ) : null}
                      {f?.label}
                    </button>
                  </Fragment>
                ))}
              </div>
            </section>
          </>
        ) : null}
        {v.showGrid ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: v.gridCols, gap: "14px" }}>
              {(v.minds || []).map((m, $index) => (
                <Fragment key={$index}>
                  <article style={{ borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "8px 8px 16px", display: "flex", flexDirection: "column", gap: "12px", animation: "etIn .45s both", animationDelay: m?.delay, transition: "transform .3s cubic-bezier(.25,.1,.25,1)" }} className="expl-h4">
                    <div style={{ position: "relative", height: v.imgH, borderRadius: "20px", overflow: "hidden", background: "#1A1510" }}>
                      <div style={{ position: "absolute", inset: "0", filter: m?.filter }}>
                        <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"rect"} placeholder={m?.name} />
                      </div>
                      {m?.inspired ? (
                        <>
                          <span title={"Cápsula de um especialista nas ideias desta pessoa — não é uma simulação dela."} style={{ position: "absolute", left: "10px", top: "10px", height: "26px", padding: "0 10px", borderRadius: "999px", background: "rgba(11,11,12,.72)", color: "#E0C78E", font: "700 11px Urbanist", display: "flex", alignItems: "center", gap: "5px" }}>
                            <Icon n={"feather"} s={"12"} />
                            Inspirado em
                          </span>
                        </>
                      ) : null}
                      {m?.locked ? (
                        <>
                          <span style={{ position: "absolute", left: "10px", bottom: "10px", height: "28px", padding: "0 11px", borderRadius: "999px", background: "rgba(11,11,12,.75)", color: "#F3EFE6", font: "700 11.5px Urbanist", display: "flex", alignItems: "center", gap: "6px", pointerEvents: "none" }}>
                            <Icon n={"lock"} s={"13"} />
                            Premium
                          </span>
                        </>
                      ) : null}
                      <button onClick={m?.fav} aria-label={"Favoritar"} style={{ position: "absolute", top: "8px", right: "8px", width: "40px", height: "40px", borderRadius: "50%", border: "0", background: m?.starBg, color: m?.starFg, display: "grid", placeItems: "center", cursor: "pointer", backdropFilter: "blur(8px)", transition: "background .2s,transform .2s" }} className="expl-a5">
                        <Icon n={"star"} s={"17"} />
                      </button>
                    </div>
                    <div style={{ padding: "0 8px", display: "flex", flexDirection: "column", gap: "6px", flex: "1" }}>
                      <span style={{ font: "700 11px/1.35 Urbanist", letterSpacing: ".1em", color: v.t?.accentText, textTransform: "uppercase" }}>
                        {m?.spec}
                      </span>
                      <h3 style={{ margin: "0", font: "700 20px/1.15 Urbanist", letterSpacing: "-.01em" }}>
                        {m?.name}
                      </h3>
                      <span style={{ font: "500 13px Urbanist", color: v.t?.faint }}>
                        {m?.period}
                      </span>
                      <p style={{ margin: "4px 0 0", font: "italic 400 17px/1.35 'EB Garamond',serif", color: v.t?.muted, flex: "1" }}>
                        {m?.quote}
                      </p>
                      <button onClick={m?.go} style={{ marginTop: "10px", height: "44px", borderRadius: "999px", border: "0", background: m?.btnBg, boxShadow: `inset 0 0 0 1px ${m?.btnRing ?? ''}`, color: m?.btnFg, font: "700 14px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", transition: "background .2s" }}>
                        {m?.locked ? (
                          <>
                            <Icon n={"lock"} s={"14"} />
                          </>
                        ) : null}
                        {m?.cta}
                      </button>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
