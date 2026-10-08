import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

const STEPS = [
  { type: 'intro', stage: -1 },
  { type: 'q', stage: 0, id: 'trabalho', mode: 'single', title: 'Com o que você trabalha?', hint: 'Escolha a opção mais próxima.', opts: [['Criatividade e design', 'palette'], ['Tecnologia', 'cpu'], ['Saúde e cuidado', 'stethoscope'], ['Educação', 'graduation-cap'], ['Meu próprio negócio', 'store'], ['Comércio e serviços', 'shopping-bag'], ['Estudo', 'book-open'], ['Outra coisa', 'ellipsis']] },
  { type: 'q', stage: 0, id: 'gosta', mode: 'multi', title: 'O que você gosta de fazer?', hint: 'Escolha quantas quiser.', opts: [['Dançar', 'music'], ['Cozinhar', 'cooking-pot'], ['Ler poesia e livros', 'book-heart'], ['Estar na natureza', 'trees'], ['Praticar esportes', 'bike'], ['Viajar', 'plane'], ['Arte e cinema', 'clapperboard'], ['Estar com amigos', 'users']] },
  { type: 'q', stage: 0, id: 'naogosta', mode: 'multi', optional: true, title: 'E o que você não gosta de fazer?', hint: 'Opcional. Escolha quantas quiser.', opts: [['Reuniões longas', 'calendar-x'], ['Rotina repetitiva', 'repeat'], ['Lidar com conflitos', 'swords'], ['Acordar cedo', 'alarm-clock'], ['Burocracia', 'file-stack'], ['Ficar sozinho(a)', 'user-round-x']] },
  { type: 'inter', stage: 0, mind: 'seneca', mindName: 'Sêneca', quote: 'Não é que tenhamos pouco tempo; é que perdemos muito dele.', text: 'Ótimo começo, Ana. Agora vamos falar do que pesa.' },
  { type: 'q', stage: 1, id: 'dificuldades', mode: 'multi', title: 'Quais são as suas maiores dificuldades hoje?', hint: 'Escolha quantas quiser.', opts: [['Ansiedade', 'wind'], ['Solidão', 'user-round'], ['Falta de rumo na carreira', 'compass'], ['Cansaço e exaustão', 'battery-low'], ['Relacionamentos', 'heart'], ['Luto ou uma perda', 'feather'], ['Dinheiro', 'wallet'], ['Autoestima', 'sparkle']] },
  { type: 'q', stage: 1, id: 'estresse', mode: 'single', title: 'O que mais deixa você estressado(a) num dia?', hint: 'Escolha uma.', opts: [['Excesso de trabalho', 'layers'], ['Prazos apertados', 'timer'], ['Pessoas difíceis', 'messages-square'], ['Incerteza sobre o futuro', 'cloud-fog'], ['Notícias e redes sociais', 'smartphone'], ['Falta de tempo para mim', 'hourglass']] },
  { type: 'q', stage: 1, id: 'desgaste', mode: 'single', title: 'Qual é a maior causa do seu desgaste?', hint: 'Escolha uma.', opts: [['Trabalho', 'briefcase'], ['Família', 'house'], ['Saúde', 'activity'], ['Dinheiro', 'wallet'], ['Um relacionamento', 'heart-crack'], ['As minhas próprias cobranças', 'scale']] },
  { type: 'inter', stage: 1, mind: 'frankl', mindName: 'Viktor Frankl', quote: 'Quem tem um porquê enfrenta qualquer como.', text: 'Obrigado pela confiança. O que você contou fica só entre você e o Etternum.' },
  { type: 'q', stage: 2, id: 'come', mode: 'multi', title: 'O que você gosta de comer?', hint: 'Escolha quantas quiser.', opts: [['Açaí', 'cherry'], ['Comida japonesa', 'fish'], ['Comida caseira', 'soup'], ['Massas', 'wheat'], ['Vegetariana', 'salad'], ['Doces', 'cake-slice'], ['Churrasco', 'beef'], ['Frutos do mar', 'shell']] },
  { type: 'q', stage: 2, id: 'naocome', mode: 'multi', optional: true, title: 'E o que você não gosta de comer?', hint: 'Escolha quantas quiser.', opts: [['Fígado', 'ban'], ['Pimenta', 'flame'], ['Coentro', 'leaf'], ['Frutos do mar', 'shell'], ['Carne vermelha', 'beef'], ['Como de tudo', 'smile']] },
  { type: 'inter', stage: 2, mind: 'epicuro', mindName: 'Epicuro', quote: 'O prazer simples como base de uma vida feliz.', text: 'Pequenos prazeres também contam. O Maestro vai lembrar disso.' },
  { type: 'q', stage: 3, id: 'espera', mode: 'multi', title: 'O que você espera encontrar no Etternum?', hint: 'Escolha quantas quiser.', opts: [['Alguém para conversar', 'message-circle-heart'], ['Clareza para decidir', 'signpost'], ['Calma', 'waves'], ['Sentido', 'compass'], ['Aprender com grandes mentes', 'library'], ['Crescer no trabalho', 'trending-up']] },
  { type: 'q', stage: 3, id: 'areas', mode: 'multi', areas: true, title: 'Quais áreas da vida mais interessam a você?', hint: 'Vamos priorizar essas áreas no seu Início.' },
  { type: 'build', stage: 4 },
  { type: 'done', stage: 4 },
];
const STAGES = ['Sua rotina', 'O que pesa', 'Sabores', 'Seu caminho'];
const BUILD = [['Lendo suas respostas', 'book-open'], ['Escolhendo suas primeiras mentes', 'users'], ['Preparando o Maestro', 'infinity'], ['Organizando suas áreas da vida', 'layout-grid']];

export default class Triagem extends React.Component {
  state = { i: 0, ans: { trabalho: ['Criatividade e design'], dificuldades: ['Ansiedade', 'Solidão', 'Falta de rumo na carreira'], areas: ['vida-interior', 'relacionamentos', 'negocios'] }, pct: 0 };
  componentDidMount() { const v = (this.props.app || {}).variant; if (v === 'build') this.go(STEPS.length - 2); else if (v === 'done') this.setState({ i: STEPS.length - 1, pct: 100 }); else if (v && /^\d+$/.test(v)) this.setState({ i: +v }); }
  componentWillUnmount() { clearInterval(this.bt); clearTimeout(this.at); }
  go(i) {
    clearInterval(this.bt); this.setState({ i, pct: 0 });
    if (STEPS[i] && STEPS[i].type === 'build') this.bt = setInterval(() => this.setState(s => { const pct = Math.min(100, s.pct + 1); if (pct === 100) { clearInterval(this.bt); setTimeout(() => this.setState({ i: i + 1 }), 700); } return { pct }; }), 36);
  }
  next = () => this.go(Math.min(STEPS.length - 1, this.state.i + 1));
  back = () => { if (this.state.i > 0) this.go(Math.max(0, this.state.i - 1 - (STEPS[this.state.i - 1].type === 'build' ? 1 : 0))); };
  pick(step, val) {
    const cur = this.state.ans[step.id] || [];
    if (step.mode === 'single') { this.setState(s => ({ ans: { ...s.ans, [step.id]: [val] } })); clearTimeout(this.at); this.at = setTimeout(this.next, 380); }
    else this.setState(s => ({ ans: { ...s.ans, [step.id]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] } }));
  }
  renderVals() {
    const a = this.props.app || {}, E = ETT, t = a.t || {}, s = this.state, mob = !!a.mobile;
    if (!E) return {};
    const step = STEPS[s.i], type = step.type, chosen = s.ans[step.id] || [];
    const stageIdx = step.stage;
    const qInStage = STEPS.filter(x => x.stage === stageIdx && x.type !== 'intro');
    const pos = qInStage.indexOf(step) + 1;
    const bars = STAGES.map((_, k) => ({ w: k < stageIdx || stageIdx === 4 ? '100%' : k === stageIdx ? Math.round(pos / qInStage.length * 100) + '%' : '0%' }));
    let opts = [];
    if (type === 'q') {
      const src = step.areas ? E.areas.map(ar => ({ label: ar.name, val: ar.slug, icon: ar.icon, color: ar.color })) : step.opts.map(([label, icon], k) => ({ label, val: label, icon, color: null, k }));
      opts = src.map((o, k) => { const on = chosen.includes(o.val); return { label: o.label, icon: o.icon,
        bg: on ? t.card2 : t.card, ring: on ? t.accent : t.line, ringW: on ? '2px' : '1px',
        iconBg: o.color ? E.hexA(o.color, .16) : t.pastel[k % 6], iconFg: o.color || '#15130E',
        markR: step.mode === 'single' ? '50%' : '9px', markBg: on ? t.accent : 'transparent', markRing: on ? t.accent : t.line2, markShow: on ? 'block' : 'none',
        pick: () => this.pick(step, o.val) }; });
    }
    const multiOk = type !== 'q' || step.mode === 'single' ? true : (chosen.length > 0 || step.optional);
    const areasSel = s.ans.areas || [];
    const recSlugs = ['frankl', 'seneca', 'jung'];
    if (areasSel.includes('negocios')) recSlugs[1] = 'drucker';
    const ctaLabel = { intro: 'Começar', q: step.id === 'areas' ? 'Concluir triagem' : 'Continuar', inter: 'Continuar', done: 'Conhecer o Maestro' }[type] || '';
    return {
      t, is: { intro: type === 'intro', q: type === 'q', inter: type === 'inter', build: type === 'build', done: type === 'done' },
      step: { ...step, hint: step.hint || '' }, opts, bars, stepKey: 'k' + s.i,
      stageLabel: stageIdx >= 0 && stageIdx < 4 ? `Etapa ${stageIdx + 1} de 4 · ${STAGES[stageIdx]}` : stageIdx === 4 ? 'Quase lá' : 'Triagem',
      showTop: type !== 'done', backOp: s.i === 0 ? 0 : 1, back: this.back, next: this.next,
      topPad: mob ? 'calc(8px + env(safe-area-inset-top)) 20px 4px' : '20px 32px 8px', mainPad: mob ? '20px 20px 120px' : '48px 32px 130px', ctaPad: mob ? '16px 20px max(28px, env(safe-area-inset-bottom))' : '20px 32px 40px',
      hq: mob ? '32px' : '48px', introW: mob ? '100%' : '560px', introRatio: mob ? '4/3' : '16/10', hquote: mob ? '28px' : '38px', optCols: mob ? '1fr' : '1fr 1fr',
      pct: s.pct, ringOffset: String(502.65 * (1 - s.pct / 100)),
      buildItems: BUILD.map(([label, icon], k) => { const on = s.pct >= 15 + k * 22; return { label, icon: on && s.pct >= 30 + k * 22 ? 'check' : icon, op: on ? 1 : 0.0, y: on ? '0px' : '10px', bg: on ? '#E0C78E' : t.track }; }),
      recs: recSlugs.map(k => ({ ...E.bySlug[k], short: E.bySlug[k].spec.split(' · ')[0] })),
      showCta: type !== 'build', showSecondary: type === 'done',
      ctaLabel, ctaDisabled: !multiOk, ctaBg: multiOk ? t.accent : t.card3, ctaFg: multiOk ? t.onAccent : t.faint, ctaCursor: multiOk ? 'pointer' : 'not-allowed',
      cta: () => { if (type === 'done') a.nav && a.nav('maestro', '', 'novo'); else this.next(); },
      goInicio: () => a.nav && a.nav('inicio'), toggleTheme: a.toggleTheme,
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div data-screen-label={"04 Triagem"} style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: v.t?.bg, color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        {v.showTop ? (
          <>
            <header style={{ position: "sticky", top: "0", zIndex: "5", background: v.t?.bg, padding: v.topPad }}>
              <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px" }}>
                  <button onClick={v.back} aria-label={"Voltar"} style={{ width: "44px", height: "44px", marginLeft: "-10px", borderRadius: "50%", border: "0", background: "transparent", color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer", opacity: v.backOp }}>
                    <Icon n={"chevron-left"} s={"24"} />
                  </button>
                  <span style={{ flex: "1", textAlign: "center", font: "700 13.5px Urbanist", color: v.t?.muted }}>
                    {v.stageLabel}
                  </span>
                  <button onClick={v.toggleTheme} aria-label={"Alternar tema"} style={{ width: "44px", height: "44px", marginRight: "-10px", borderRadius: "50%", border: "0", background: "transparent", color: v.t?.muted, display: "grid", placeItems: "center", cursor: "pointer" }}>
                    <Icon n={v.t?.themeIcon} s={"18"} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" }}>
                  {(v.bars || []).map((b, $index) => (
                    <Fragment key={$index}>
                      <span style={{ height: "6px", borderRadius: "3px", background: v.t?.track, overflow: "hidden" }}>
                        <span style={{ display: "block", height: "100%", width: b?.w, borderRadius: "3px", background: v.t?.accent, transition: "width .5s cubic-bezier(.25,.1,.25,1)" }}></span>
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
            </header>
          </>
        ) : null}
        <main style={{ flex: "1", display: "flex", flexDirection: "column", padding: v.mainPad }}>
          <div key={v.stepKey} style={{ maxWidth: "720px", width: "100%", margin: "0 auto", flex: "1", display: "flex", flexDirection: "column", animation: "etIn .45s cubic-bezier(.25,.1,.25,1) both" }}>
            {v.is?.intro ? (
              <>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "24px", padding: "24px 0" }}>
                  <div role={"img"} aria-label={"Aurelius, o Maestro, na biblioteca do Etternum"} style={{ position: "relative", width: "100%", maxWidth: v.introW, aspectRatio: v.introRatio, borderRadius: "30px", overflow: "hidden", background: "#2A2118 url(/portraits/maestro.webp) 50% 18%/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1px rgba(224,199,142,.4),0 40px 80px -30px rgba(0,0,0,.7)", animation: "etIn .8s cubic-bezier(.25,.1,.25,1) both" }}>
                    <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,transparent 55%,rgba(11,11,12,.85))" }}></div>
                    <div style={{ position: "absolute", left: "20px", bottom: "18px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", textAlign: "left" }}>
                      <span style={{ font: "800 12px Urbanist", letterSpacing: ".2em", color: "#E0C78E" }}>
                        MAESTRO
                      </span>
                      <span style={{ font: "600 14px Urbanist", color: "#F3EFE6" }}>
                        Guardião das Mentes do Etternum
                      </span>
                    </div>
                  </div>
                  <h1 style={{ margin: "0", maxWidth: "600px", font: `italic 400 ${v.hquote ?? ''}/1.25 'EB Garamond',serif`, color: v.t?.ink, textWrap: "balance" }}>
                    {"“Bem-vindo ao Etternum. Meu nome é "}
                    <span style={{ color: v.t?.accentText }}>
                      Aurelius
                    </span>
                    . Mas aqui, todos me chamam de Maestro.”
                  </h1>
                  <p style={{ margin: "0", maxWidth: "520px", font: "500 19px/1.55 Urbanist", color: v.t?.muted, textWrap: "pretty" }}>
                    {"Para que as grandes mentes possam orientar você de verdade, conte um pouco sobre a sua vida... Já sabemos que você é de "}
                    <span style={{ color: v.t?.ink, fontWeight: "700" }}>
                      <span style={{ fontFamily: "'EB Garamond',serif", color: v.t?.accentText }}>
                        ♐︎
                      </span>
                      {" Sagitário"}
                    </span>
                    .
                  </p>
                  <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", justifyContent: "center", font: "600 14px Urbanist", color: v.t?.faint }}>
                    <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <Icon n={"clock"} s={"15"} />
                      Cerca de 3 minutos
                    </span>
                    <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <Icon n={"lock"} s={"15"} />
                      Só você e o Etternum veem
                    </span>
                  </div>
                </div>
              </>
            ) : null}
            {v.is?.q ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  <h1 style={{ margin: "0", font: `700 ${v.hq ?? ''}/1.08 Urbanist`, letterSpacing: "-.025em", textWrap: "balance" }}>
                    {v.step?.title}
                  </h1>
                  <span style={{ font: "500 16px Urbanist", color: v.t?.muted }}>
                    {v.step?.hint}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: v.optCols, gap: "10px" }}>
                  {(v.opts || []).map((o, $index) => (
                    <Fragment key={$index}>
                      <button onClick={o?.pick} style={{ minHeight: "66px", borderRadius: "20px", border: "0", background: o?.bg, boxShadow: `inset 0 0 0 ${o?.ringW ?? ''} ${o?.ring ?? ''}`, color: v.t?.ink, padding: "10px 16px 10px 10px", display: "flex", alignItems: "center", gap: "14px", font: "600 16.5px/1.25 Urbanist", cursor: "pointer", textAlign: "left", transition: "background .2s,box-shadow .2s,transform .15s" }} className="tria-a1">
                        <span style={{ flex: "none", width: "44px", height: "44px", borderRadius: "14px", background: o?.iconBg, display: "grid", placeItems: "center" }}>
                          <Icon n={o?.icon} s={"20"} c={o?.iconFg} />
                        </span>
                        <span style={{ flex: "1" }}>
                          {o?.label}
                        </span>
                        <span style={{ flex: "none", width: "26px", height: "26px", borderRadius: o?.markR, background: o?.markBg, boxShadow: `inset 0 0 0 1.5px ${o?.markRing ?? ''}`, color: v.t?.onAccent, display: "grid", placeItems: "center", transition: "background .2s" }}>
                          <span style={{ display: o?.markShow }}>
                            <Icon n={"check"} s={"15"} />
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                {v.step?.optional ? (
                  <>
                    <button onClick={v.next} style={{ marginTop: "16px", alignSelf: "center", height: "44px", border: "0", background: "transparent", color: v.t?.muted, font: "700 15px Urbanist", cursor: "pointer" }}>
                      Pular esta pergunta
                    </button>
                  </>
                ) : null}
              </>
            ) : null}
            {v.is?.inter ? (
              <>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "28px", padding: "24px 0" }}>
                  <div style={{ position: "relative", width: "180px", height: "220px", borderRadius: "30px", overflow: "hidden", background: "#1A1510", boxShadow: "0 30px 60px -20px rgba(0,0,0,.6)" }}>
                    <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                      <ImageSlot id={`mind-${v.step?.mind ?? ''}`} shape={"rect"} placeholder={v.step?.mindName} />
                    </div>
                  </div>
                  <blockquote style={{ margin: "0", maxWidth: "560px", font: `italic 400 ${v.hquote ?? ''}/1.25 'EB Garamond',serif`, color: v.t?.ink }}>
                    “{v.step?.quote}”
                  </blockquote>
                  <span style={{ font: "700 14px Urbanist", color: v.t?.accentText }}>
                    {v.step?.mindName}
                  </span>
                  <p style={{ margin: "0", maxWidth: "440px", font: "500 17px/1.55 Urbanist", color: v.t?.muted }}>
                    {v.step?.text}
                  </p>
                </div>
              </>
            ) : null}
            {v.is?.build ? (
              <>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "32px", padding: "48px 0" }}>
                  <div style={{ position: "relative", width: "180px", height: "180px" }}>
                    <svg width={"180"} height={"180"} viewBox={"0 0 180 180"} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={"90"} cy={"90"} r={"80"} fill={"none"} stroke={v.t?.track} strokeWidth={"8"}></circle>
                      <circle cx={"90"} cy={"90"} r={"80"} fill={"none"} stroke={"#E0C78E"} strokeWidth={"8"} strokeLinecap={"round"} strokeDasharray={"502.65"} strokeDashoffset={v.ringOffset} style={{ transition: "stroke-dashoffset .12s linear" }}></circle>
                    </svg>
                    <div style={{ position: "absolute", inset: "0", display: "grid", placeItems: "center" }}>
                      <span style={{ font: "800 44px Urbanist", letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>
                        {v.pct}%
                      </span>
                    </div>
                  </div>
                  <h1 style={{ margin: "0", font: `700 ${v.hq ?? ''}/1.08 Urbanist`, letterSpacing: "-.025em" }}>
                    {"Montando seu "}
                    <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                      Etternum…
                    </span>
                  </h1>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "380px" }}>
                    {(v.buildItems || []).map((b, $index) => (
                      <Fragment key={$index}>
                        <div style={{ height: "56px", borderRadius: "18px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "0 16px", display: "flex", alignItems: "center", gap: "12px", font: "600 15.5px Urbanist", opacity: b?.op, transform: `translateY(${b?.y ?? ''})`, transition: "opacity .4s,transform .4s", color: v.t?.ink }}>
                          <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: b?.bg, color: v.t?.onAccent, display: "grid", placeItems: "center" }}>
                            <Icon n={b?.icon} s={"14"} />
                          </span>
                          {b?.label}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {v.is?.done ? (
              <>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "24px", padding: "40px 0" }}>
                  <span style={{ height: "32px", padding: "0 14px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 12px Urbanist", letterSpacing: ".12em", display: "flex", alignItems: "center" }}>
                    TRIAGEM CONCLUÍDA
                  </span>
                  <h1 style={{ margin: "0", font: `700 ${v.hq ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                    {"Pronto, "}
                    <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                      Ana.
                    </span>
                  </h1>
                  <p style={{ margin: "0", maxWidth: "480px", font: "500 18px/1.55 Urbanist", color: v.t?.muted }}>
                    O Maestro já conhece um pouco da sua história. Separamos três mentes para começar:
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", width: "100%", maxWidth: "520px" }}>
                    {(v.recs || []).map((m, $index) => (
                      <Fragment key={$index}>
                        <div style={{ borderRadius: "22px", overflow: "hidden", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, display: "flex", flexDirection: "column", textAlign: "left" }}>
                          <div style={{ position: "relative", aspectRatio: "4/5", background: "#1A1510" }}>
                            <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                              <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"rect"} placeholder={m?.name} />
                            </div>
                          </div>
                          <div style={{ padding: "10px 12px 14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <span style={{ font: "700 14px/1.2 Urbanist" }}>
                              {m?.name}
                            </span>
                            <span style={{ font: "600 11.5px/1.3 Urbanist", color: v.t?.accentText }}>
                              {m?.short}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </main>
        {v.showCta ? (
          <>
            <footer style={{ position: "sticky", bottom: "0", marginTop: "-110px", padding: v.ctaPad, background: `linear-gradient(180deg,transparent,${v.t?.bg ?? ''} 28%)` }}>
              <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", gap: "10px" }}>
                {v.showSecondary ? (
                  <>
                    <button onClick={v.goInicio} style={{ flex: "1", height: "58px", borderRadius: "999px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "700 16px Urbanist", cursor: "pointer" }}>
                      Ir para o Início
                    </button>
                  </>
                ) : null}
                <button onClick={v.cta} disabled={v.ctaDisabled} style={{ flex: "2", height: "58px", borderRadius: "999px", border: "0", background: v.ctaBg, color: v.ctaFg, font: "700 17px Urbanist", cursor: v.ctaCursor, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "background .2s,transform .15s" }} className="tria-a2">
                  {v.ctaLabel}
                  <Icon n={"arrow-right"} s={"18"} />
                </button>
              </div>
            </footer>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
