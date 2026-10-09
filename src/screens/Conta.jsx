import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { supabase, listConversas, deleteConversa, quando } from '../lib/supabase.js';

// Perfil > Memória: o que o Etternum sabe da pessoa, montado a partir da triagem.
const T = { trabalho: 'Com o que você trabalha?', gosta: 'O que você gosta de fazer?', naogosta: 'E o que você não gosta de fazer?', dif: 'Quais são as suas maiores dificuldades hoje?', estresse: 'O que mais deixa você estressado(a) num dia?', desgaste: 'Qual é a maior causa do seu desgaste?', come: 'O que você gosta de comer?', naocome: 'E o que você não gosta de comer?', espera: 'O que você espera encontrar no Etternum?', areas: 'Quais áreas da vida mais interessam a você?' };
const DEMO_MEMORIA = [['Quem é', 'Designer numa agência, faz freelas à noite. Gosta de dançar, cozinhar e ler poesia.', 'user-round'], ['Momento atual', 'Exausta e em dúvida se continua no emprego.', 'clock'], ['Desafios em andamento', 'Ansiedade, solidão e falta de rumo na carreira.', 'mountain'], ['Preferências e valores', 'Valoriza criar coisas úteis. Ama açaí e comida japonesa; não gosta de fígado.', 'heart'], ['Progressos e decisões', 'Vai anotar três momentos em que se sentiu útil nesta semana.', 'flag'], ['Pontos de atenção', 'Noites com pouco sono costumam piorar a ansiedade.', 'triangle-alert']];
const DEMO_TRIAGEM = [['Com o que trabalha', 'Criatividade e design'], ['Gosta de fazer', 'Dançar, cozinhar, ler poesia'], ['Não gosta de fazer', 'Reuniões longas'], ['Maiores dificuldades', 'Ansiedade, solidão, falta de rumo na carreira'], ['O que mais estressa', 'Excesso de trabalho'], ['Maior causa de desgaste', 'Trabalho'], ['Gosta de comer', 'Açaí, comida japonesa'], ['Não gosta de comer', 'Fígado'], ['Espera encontrar', 'Alguém para conversar, clareza para decidir'], ['Áreas de interesse', 'Vida Interior, Relacionamentos, Negócios']];
const L = (tri, k) => (tri[T[k]] || []).join(', ');
const memoriaDe = tri => [
  ['Quem é', [L(tri, 'trabalho') && `Trabalha com ${L(tri, 'trabalho').toLowerCase()}.`, L(tri, 'gosta') && `Gosta de ${L(tri, 'gosta').toLowerCase()}.`].filter(Boolean).join(' '), 'user-round'],
  ['Momento atual', [L(tri, 'desgaste') && `Maior desgaste: ${L(tri, 'desgaste').toLowerCase()}.`, L(tri, 'estresse') && `O que mais estressa: ${L(tri, 'estresse').toLowerCase()}.`].filter(Boolean).join(' '), 'clock'],
  ['Desafios em andamento', L(tri, 'dif'), 'mountain'],
  ['Preferências', [L(tri, 'come') && `Gosta de comer: ${L(tri, 'come').toLowerCase()}.`, L(tri, 'naocome') && `Não gosta: ${L(tri, 'naocome').toLowerCase()}.`].filter(Boolean).join(' '), 'heart'],
  ['O que espera encontrar', L(tri, 'espera'), 'flag'],
  ['Áreas de interesse', L(tri, 'areas'), 'layout-grid'],
].filter(([, text]) => text);
import { Overlay } from '../components/Overlay.jsx';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

const CONVS = [
  ['mind', 'frankl', 'Reencontrar o porquê no trabalho', 'Ontem, 22:14'],
  ['maestro', 'maestro', 'Estou exausta e sem saber se continuo no meu emprego.', 'Ontem, 21:58'],
  ['conselho', 'negocios', 'Largar a agência e viver de freelas?', 'Ontem, 20:31'],
  ['mind', 'seneca', 'Como parar de adiar a vida', '30 set, 23:02'],
  ['mind', 'rumi', 'Saudade de quem foi embora', '28 set, 00:12'],
  ['maestro', 'maestro', 'Hoje eu só preciso desabafar.', '22 set, 22:40'],
];
export default class Conta extends React.Component {
  state = { convs: CONVS.map((c, i) => i), modal: null, typed: '', memory: true, capsula: ((this.props.app || {}).user || {}).capsula || 'seneca' };
  componentDidMount() {
    const a = this.props.app || {};
    if (a.variant === 'vazio') this.setState({ convs: [] });
    if (a.loggedIn) listConversas().then(db => this.setState({ db })).catch(() => this.setState({ db: [] }));
    if (a.variant === 'nova-senha') this.ask({ title: 'Crie uma nova senha', text: 'Digite a nova senha da sua conta (pelo menos 8 caracteres).', cta: 'Salvar nova senha', kind: 'senha', run: async () => { const r = await a.auth.newPassword(this.state.typed); a.toast(r.error || 'Senha atualizada.'); } });
  }
  sk(w, h, r) { return React.createElement('div', { style: { position: 'relative', overflow: 'hidden', width: w, height: h, borderRadius: r, background: ((this.props.app || {}).t || {}).card2, flex: 'none' } }, React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(224,199,142,.1),transparent)', animation: 'etShimmer 1.6s ease-in-out infinite' } })); }
  ask(m) { this.setState({ modal: m, typed: '' }); }
  renderVals() {
    const a = this.props.app || {}, E = ETT, t = a.t || {}, s = this.state, mob = !!a.mobile;
    if (!E) return {};
    const nav = (r, p, v) => a.nav && a.nav(r, p, v), toast = m => a.toast && a.toast(m);
    const route = a.route, plan = a.plan || 'trial';
    const favSlugs = Object.keys(a.favs || {}).filter(k => a.favs[k] && E.bySlug[k]);
    const h = React.createElement;
    const skCard = () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, this.sk('100%', 110, 16), this.sk('70%', 12, 6), this.sk('45%', 10, 6));
    const m = s.modal; const u = a.user || {};
    return {
      t: { ...t, pastel0: t.pastel[0] }, mobile: mob, desktop: !mob, h1: mob ? '30px' : '42px', h2: mob ? '20px' : '24px', boxPad: mob ? '22px' : '32px',
      isConversas: route === 'conversas', isPerfil: route === 'perfil', isPlano: route === 'plano', isMemoria: route === 'memoria', isEstados: route === 'estados',
      convs: a.loggedIn ? (s.db || []).map(c => { const mind = E.bySlug[c.slug], area = E.areaBySlug[c.slug], type = c.tipo === 'mente' ? 'mind' : c.tipo;
        return { isMind: type === 'mind', isMaestro: type === 'maestro', isConselho: type === 'conselho', slug: c.slug, ini: mind ? E.initials(mind.name) : '', title: c.titulo, when: quando(c.updated_at),
          label: type === 'mind' ? (mind || {}).name : type === 'maestro' ? 'Maestro' : `Conselho · ${(area || {}).name || ''}`, tint: area ? E.hexA(area.color, .16) : '', color: area ? area.color : '',
          go: () => type === 'mind' ? nav('mente', c.slug) : type === 'maestro' ? nav('maestro') : nav('conselho', c.slug, 'id:' + c.id),
          del: () => this.ask({ title: 'Apagar esta conversa?', text: `“${c.titulo}” será removida do seu histórico. Essa ação não pode ser desfeita.`, cta: 'Apagar', run: async () => { try { await deleteConversa(c.id); this.setState(st => ({ db: st.db.filter(x => x.id !== c.id) })); toast('Conversa apagada.'); } catch (e) { toast('Não foi possível apagar agora.'); } } }) }; }) : s.convs.map(i => { const [type, slug, title, when] = CONVS[i]; const mind = E.bySlug[slug]; const area = E.areaBySlug[slug];
        return { isMind: type === 'mind', isMaestro: type === 'maestro', isConselho: type === 'conselho', slug, ini: mind ? E.initials(mind.name) : '', title, when,
          label: type === 'mind' ? mind.name : type === 'maestro' ? 'Maestro' : `Conselho · ${area.name}`, tint: area ? E.hexA(area.color, .16) : '', color: area ? area.color : '',
          go: () => type === 'mind' ? nav('mente', slug, 'conversa') : type === 'maestro' ? nav('maestro', '', 'recomendacao') : nav('conselho', slug, 'resultado'),
          del: () => this.ask({ title: 'Apagar esta conversa?', text: `“${title}” será removida do seu histórico. Essa ação não pode ser desfeita.`, cta: 'Apagar', run: () => { this.setState(st => ({ convs: st.convs.filter(x => x !== i) })); toast('Conversa apagada.'); } }) }; }),
      hasConvs: (a.loggedIn ? (s.db || []) : s.convs).length > 0, noConvs: a.loggedIn ? !!s.db && !s.db.length : s.convs.length === 0, goMaestro: () => nav('maestro'),
      avSize: mob ? '64px' : '84px', avFont: mob ? '22px' : '28px', perfilCols: mob ? '1fr' : 'minmax(0,1fr) 340px', dataCols: mob ? '1fr' : '1fr 1fr', memCols: mob ? '1fr' : 'repeat(3,1fr)', triCols: mob ? '1fr' : '240px 1fr',
      u, dados: [['Nome', u.nome], ['E-mail', u.email], ['CPF', u.cpf || '—'], ['Nascimento', u.nascimento || '—'], ['Signo', u.signo ? `${u.signoSym}︎ ${u.signo}` : '—'], ['Plano', { trial: 'Teste grátis', free: 'Gratuito', premium: 'Premium' }[plan]]].map(([k, v]) => ({ k, v })),
      hasMemory: u.demo ? s.memory : !!u.triagem, noMemory: u.demo ? !s.memory : !u.triagem,
      memoria: (u.demo ? DEMO_MEMORIA : memoriaDe(u.triagem || {})).map(([title, text, icon], i) => ({ title, text, icon, bg: t.pastel[i % 6] })),
      askMem: () => this.ask({ title: 'Apagar a memória?', text: 'O Etternum vai esquecer o resumo que aprendeu sobre você. Suas conversas continuam guardadas.', cta: 'Apagar memória', run: () => { if (u.demo) this.setState({ memory: false }); else a.saveProfile({ triagem: null, recomendadas: [] }); toast('Memória apagada.'); } }),
      triagem: (u.demo ? DEMO_TRIAGEM : Object.entries(u.triagem || {}).map(([k, v]) => [k.replace(/\?$/, ''), Array.isArray(v) ? v.join(', ') : String(v)])).map(([k, v]) => ({ k, v })),
      goTriagem: () => nav('triagem'),
      favs: favSlugs.map(k => ({ slug: k, name: E.bySlug[k].name, ini: E.initials(E.bySlug[k].name), go: () => nav('mente', k) })),
      toggleTheme: a.toggleTheme, themeLabel: t.name === 'dark' ? 'Escuro' : 'Claro', goSair: () => (a.auth && a.loggedIn ? a.auth.signOut() : nav('landing')),
      askDelete: () => this.ask({ title: 'Excluir sua conta?', text: 'Todos os seus dados, conversas e memória serão apagados de forma permanente. Para confirmar, digite EXCLUIR.', cta: 'Excluir minha conta', needType: true, run: async () => { if (a.loggedIn) { const { error } = await supabase.rpc('excluir_conta'); if (error) return toast('Não foi possível excluir agora.'); await a.auth.signOut(); } nav('landing'); } }),
      planTabs: [['trial', 'Teste'], ['free', 'Gratuito'], ['premium', 'Premium']].map(([k, label]) => ({ label, bg: plan === k ? t.altBg : 'transparent', fg: plan === k ? t.altFg : t.muted, go: () => a.setPlan(k) })),
      planName: { trial: `Teste grátis · ${u.diasTrial} dias`, free: 'Gratuito', premium: 'Premium' }[plan],
      planText: { trial: `Seu teste de 14 dias termina em ${(u.trialAte || new Date(Date.now() + 14 * 864e5)).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} (${u.diasTrial} dias restantes). Até lá, tudo está liberado.`, free: 'Você usou 3 de 5 mensagens hoje. Sua cápsula do plano gratuito é Sêneca. O Maestro está sempre disponível.', premium: 'Acesso ilimitado a todas as mentes. Obrigado!' }[plan],
      isTrial: plan === 'trial', isFree: plan === 'free', notPremium: plan !== 'premium',
      usage: [0, 1, 2, 3, 4].map(i => ({ bg: i < 3 ? '#E0C78E' : t.track })),
      premCols: mob ? '1fr' : '1fr 1fr',
      beneficios: [['Todas as 61 mentes, sem limite', 'users'], ['Conselho com até 4 mentes', 'users-round'], ['Memória completa', 'brain'], ['Mensagens ilimitadas', 'messages-square'], ['Em breve: Cápsula de Memória Viva', 'clock']].map(([text, icon]) => ({ text, icon })),
      assinar: () => { if (!u.demo) return toast('A assinatura Premium chega em breve. Por enquanto, aproveite o teste completo.'); a.setPlan('premium'); toast(`Boas-vindas ao Premium, ${u.primeiro}.`); },
      capCols: mob ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(150px,1fr))',
      capsulas: ['seneca', 'frankl', 'jung', 'rumi', 'arendt', 'drucker'].map(k => { const on = s.capsula === k; return { slug: k, name: E.bySlug[k].name, on, sub: on ? 'Sua cápsula' : E.bySlug[k].spec.split(' · ')[0], subColor: on ? t.accentText : t.faint, ring: on ? t.accent : t.line, ringW: on ? '2px' : '1px', pick: () => { this.setState({ capsula: k }); a.saveProfile && a.saveProfile({ capsula: k }); toast(`${E.bySlug[k].name} é a sua cápsula do plano gratuito.`); } }; }),
      memHeroH: mob ? 'auto' : '460px', hMem: mob ? '36px' : '56px', memStepCols: mob ? '1fr' : 'repeat(3,1fr)',
      wave: [10, 18, 26, 14, 22, 28, 12, 20, 24, 8, 16, 26, 20, 12, 22, 18, 10, 24, 14, 8].map(x => x + 'px'),
      memSteps: [['Reúna memórias', 'Histórias, fotos, cartas e áudios. Do jeito que você lembra.', 'archive'], ['Ensine o jeito de ser', 'Valores, expressões, o modo de aconselhar e de rir.', 'feather'], ['Converse e preserve', 'Revisite essa voz quando sentir saudade, e passe adiante.', 'infinity']].map(([title, text, icon], i) => ({ title, text, icon, bg: t.pastel[[0, 2, 1][i]] })),
      avisar: () => toast('Combinado. Avisaremos você quando chegar.'),
      estCols: mob ? '1fr' : 'repeat(auto-fit,minmax(300px,1fr))',
      skCard1: skCard(), skCard2: skCard(),
      skChat: h('div', { style: { display: 'flex', flexDirection: 'column', gap: 14 } }, h('div', { style: { alignSelf: 'flex-end' } }, this.sk(180, 40, 20)), h('div', { style: { display: 'flex', gap: 10 } }, this.sk(32, 32, 99), h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 8 } }, this.sk('90%', 12, 6), this.sk('75%', 12, 6), this.sk('55%', 12, 6)))),
      toastOk: () => toast('Tudo certo. Alterações salvas.'), toastErr: () => toast('A conexão caiu. Tente enviar de novo.'),
      askDemo: () => this.ask({ title: 'Apagar esta conversa?', text: 'Ela será removida do seu histórico. Essa ação não pode ser desfeita.', cta: 'Apagar', run: () => toast('Conversa apagada.') }),
      go404: () => nav('404'),
      modal: m ? { ...m, needType: !!m.needType || m.kind === 'senha' } : null, typed: s.typed, onTyped: e => this.setState({ typed: e.target.value }),
      confirmDisabled: !!(m && (m.kind === 'senha' ? s.typed.length < 8 : m.needType && s.typed.trim().toUpperCase() !== 'EXCLUIR')), confirmBg: m && (m.kind === 'senha' ? s.typed.length < 8 : m.needType && s.typed.trim().toUpperCase() !== 'EXCLUIR') ? t.card3 : m && m.kind === 'senha' ? t.accent : t.danger,
      modalType: m && m.kind === 'senha' ? 'password' : 'text', modalPh: m && m.kind === 'senha' ? 'Nova senha' : 'Digite EXCLUIR',
      confirm: () => { const run = m && m.run; this.setState({ modal: null }); run && run(); }, closeModal: () => this.setState({ modal: null }), stop: e => e.stopPropagation(),
      modalPlace: mob ? 'end center' : 'center', modalPadOuter: mob ? '12px' : '24px',
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div style={{ display: "flex", flexDirection: "column", gap: "22px", color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        {v.isConversas ? (
          <>
            <section data-screen-label={"12 Minhas conversas"} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "880px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                  {"Minhas "}
                  <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                    conversas
                  </span>
                </h1>
                <p style={{ margin: "0", font: "500 17px/1.5 Urbanist", color: v.t?.muted }}>
                  Tudo o que você conversou fica guardado aqui. Continue de onde parou.
                </p>
              </div>
              {v.hasConvs ? (
                <>
                  <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "8px", display: "flex", flexDirection: "column" }}>
                    {(v.convs || []).map((c, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", borderRadius: "20px", transition: "background .2s" }}>
                          <button onClick={c?.go} style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "14px", border: "0", background: "transparent", color: v.t?.ink, cursor: "pointer", textAlign: "left", padding: "0" }}>
                            {c?.isMaestro ? (
                              <>
                                <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "52px", height: "52px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                              </>
                            ) : null}
                            {c?.isMind ? (
                              <>
                                <div style={{ position: "relative", flex: "none", width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                                  <ImageSlot id={`mind-${c?.slug ?? ''}`} shape={"circle"} compact placeholder={c?.ini} />
                                </div>
                              </>
                            ) : null}
                            {c?.isConselho ? (
                              <>
                                <span style={{ flex: "none", width: "52px", height: "52px", borderRadius: "50%", background: c?.tint, display: "grid", placeItems: "center" }}>
                                  <Icon n={"users-round"} s={"24"} c={c?.color} />
                                </span>
                              </>
                            ) : null}
                            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                              <span style={{ font: "700 11.5px Urbanist", letterSpacing: ".1em", color: v.t?.accentText, textTransform: "uppercase" }}>
                                {c?.label}
                              </span>
                              <span style={{ font: "600 16px/1.3 Urbanist", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {c?.title}
                              </span>
                              {v.mobile ? (
                                <>
                                  <span style={{ font: "500 12.5px Urbanist", color: v.t?.faint }}>
                                    {c?.when}
                                  </span>
                                </>
                              ) : null}
                            </div>
                            {v.desktop ? (
                              <>
                                <span style={{ flex: "none", font: "500 13px Urbanist", color: v.t?.faint }}>
                                  {c?.when}
                                </span>
                              </>
                            ) : null}
                          </button>
                          <button onClick={c?.del} aria-label={"Apagar conversa"} style={{ flex: "none", width: "44px", height: "44px", borderRadius: "50%", border: "0", background: "transparent", color: v.t?.faint, display: "grid", placeItems: "center", cursor: "pointer", transition: "background .2s,color .2s" }}>
                            <Icon n={"trash-2"} s={"18"} />
                          </button>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              {v.noConvs ? (
                <>
                  <div style={{ borderRadius: "30px", boxShadow: `inset 0 0 0 1.5px ${v.t?.line2 ?? ''}`, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
                    <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ width: "96px", height: "96px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", animation: "etGlow 4s ease-in-out infinite", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                    <span style={{ font: "700 24px/1.25 Urbanist", maxWidth: "380px" }}>
                      Você ainda não conversou com ninguém. Comece pelo Maestro.
                    </span>
                    <button onClick={v.goMaestro} style={{ height: "50px", padding: "0 24px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 16px Urbanist", cursor: "pointer" }}>
                      Falar com o Maestro
                    </button>
                  </div>
                </>
              ) : null}
            </section>
          </>
        ) : null}
        {v.isPerfil ? (
          <>
            <section data-screen-label={"13 Perfil"} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <span style={{ flex: "none", width: v.avSize, height: v.avSize, borderRadius: "50%", background: v.t?.pastel0, color: "#15130E", display: "grid", placeItems: "center", font: `800 ${v.avFont ?? ''} Urbanist` }}>
                  {v.u?.iniciais}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                    {v.u?.nome}
                  </h1>
                  <span style={{ font: "500 15px Urbanist", color: v.t?.muted }}>
                    {v.u?.idade ? `${v.u.idade} anos · ` : ''}
                    <span style={{ fontFamily: "'EB Garamond',serif", color: v.t?.accentText }}>
                      {v.u?.signoSym}︎
                    </span>
                    {` ${v.u?.signo || ''} · membro desde ${v.u?.membroDesde || ''}`}
                  </span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.perfilCols, gap: "14px", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", minWidth: "0" }}>
                  <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ font: "700 18px Urbanist" }}>
                      Seus dados
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: v.dataCols, gap: "10px" }}>
                      {(v.dados || []).map((d, $index) => (
                        <Fragment key={$index}>
                          <div style={{ borderRadius: "18px", background: v.t?.card2, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                            <span style={{ font: "600 12.5px Urbanist", color: v.t?.faint }}>
                              {d?.k}
                            </span>
                            <span style={{ font: "600 15.5px Urbanist", fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {d?.v}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ font: "700 18px Urbanist" }}>
                          O que o Etternum lembra sobre você
                        </span>
                        <span style={{ font: "500 13.5px Urbanist", color: v.t?.muted }}>
                          Um resumo vivo, atualizado a cada conversa. Só você vê.
                        </span>
                      </div>
                    </div>
                    {v.hasMemory ? (
                      <>
                        <div style={{ display: "grid", gridTemplateColumns: v.memCols, gap: "10px" }}>
                          {(v.memoria || []).map((m, $index) => (
                            <Fragment key={$index}>
                              <div style={{ borderRadius: "20px", background: m?.bg, color: "#15130E", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                  <Icon n={m?.icon} s={"16"} />
                                  <span style={{ font: "700 14.5px Urbanist" }}>
                                    {m?.title}
                                  </span>
                                </div>
                                <span style={{ font: "500 14px/1.5 Urbanist", opacity: ".8" }}>
                                  {m?.text}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        <button onClick={v.askMem} style={{ alignSelf: "flex-start", height: "44px", padding: "0 18px", borderRadius: "999px", border: "0", background: v.t?.dangerBg, color: v.t?.dangerInk, font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                          <Icon n={"eraser"} s={"16"} />
                          Apagar memória
                        </button>
                      </>
                    ) : null}
                    {v.noMemory ? (
                      <>
                        <div style={{ borderRadius: "20px", boxShadow: `inset 0 0 0 1.5px ${v.t?.line2 ?? ''}`, padding: "24px", font: "500 15px/1.5 Urbanist", color: v.t?.muted }}>
                          A memória foi apagada. O Etternum vai começar a aprender sobre você de novo a partir da próxima conversa.
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                      <span style={{ font: "700 18px Urbanist" }}>
                        Sua triagem
                      </span>
                      <button onClick={v.goTriagem} style={{ height: "40px", padding: "0 16px", borderRadius: "999px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "700 13.5px Urbanist", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <Icon n={"refresh-cw"} s={"14"} />
                        Atualizar
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {(v.triagem || []).map((q, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "grid", gridTemplateColumns: v.triCols, gap: "4px 16px", padding: "12px 0", borderTop: `1px solid ${v.t?.line ?? ''}` }}>
                            <span style={{ font: "600 13.5px/1.4 Urbanist", color: v.t?.faint }}>
                              {q?.k}
                            </span>
                            <span style={{ font: "600 15px/1.45 Urbanist" }}>
                              {q?.v}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    <span style={{ font: "700 18px Urbanist" }}>
                      Seu Quadro Eterno
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
                      {(v.favs || []).map((f, $index) => (
                        <Fragment key={$index}>
                          <button onClick={f?.go} style={{ border: "0", background: "transparent", color: v.t?.ink, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer", padding: "0" }}>
                            <div style={{ position: "relative", width: "76px", height: "76px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", boxShadow: `0 0 0 2px ${v.t?.card ?? ''},0 0 0 3.5px #E0C78E`, filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                              <ImageSlot id={`mind-${f?.slug ?? ''}`} shape={"circle"} compact placeholder={f?.ini} />
                            </div>
                            <span style={{ font: "700 12.5px/1.2 Urbanist", textAlign: "center" }}>
                              {f?.name}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ font: "700 18px Urbanist" }}>
                      Conta
                    </span>
                    <button onClick={v.toggleTheme} style={{ height: "52px", padding: "0 16px", borderRadius: "16px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 15px Urbanist", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                      <Icon n={v.t?.themeIcon} s={"18"} />
                      <span style={{ flex: "1", textAlign: "left" }}>
                        Tema
                      </span>
                      <span style={{ color: v.t?.muted }}>
                        {v.themeLabel}
                      </span>
                    </button>
                    <button onClick={v.goSair} style={{ height: "52px", padding: "0 16px", borderRadius: "16px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 15px Urbanist", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                      <Icon n={"log-out"} s={"18"} />
                      Sair
                    </button>
                    <button onClick={v.askDelete} style={{ minHeight: "52px", padding: "10px 16px", borderRadius: "16px", border: "0", background: "transparent", boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.danger, font: "600 14.5px/1.35 Urbanist", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left" }}>
                      <Icon n={"trash-2"} s={"18"} />
                      Excluir minha conta e todos os meus dados
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null}
        {v.isPlano ? (
          <>
            <section data-screen-label={"14 Plano"} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
                <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                  {"Seu "}
                  <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                    plano
                  </span>
                </h1>
                <div title={"Simular plano (protótipo)"} style={{ display: "flex", padding: "4px", borderRadius: "999px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}` }}>
                  {(v.planTabs || []).map((p, $index) => (
                    <Fragment key={$index}>
                      <button onClick={p?.go} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "0", background: p?.bg, color: p?.fg, font: "700 13px Urbanist", cursor: "pointer" }}>
                        {p?.label}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ borderRadius: "30px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: v.boxPad, display: "flex", flexDirection: "column", gap: "18px" }}>
                <span style={{ alignSelf: "flex-start", height: "30px", padding: "0 13px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 12.5px Urbanist", display: "flex", alignItems: "center" }}>
                  {v.planName}
                </span>
                <p style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.25 Urbanist`, letterSpacing: "-.015em", maxWidth: "760px", textWrap: "pretty" }}>
                  {v.planText}
                </p>
                {v.isTrial ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "520px" }}>
                      <div style={{ height: "10px", borderRadius: "5px", background: v.t?.track, overflow: "hidden" }}>
                        <div style={{ width: "4%", height: "100%", background: "#E0C78E", borderRadius: "5px" }}></div>
                      </div>
                      <span style={{ font: "600 13.5px Urbanist", color: v.t?.muted }}>
                        Dia 1 de 14
                      </span>
                    </div>
                  </>
                ) : null}
                {v.isFree ? (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "520px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "6px" }}>
                        {(v.usage || []).map((u, $index) => (
                          <Fragment key={$index}>
                            <span style={{ height: "12px", borderRadius: "6px", background: u?.bg }}></span>
                          </Fragment>
                        ))}
                      </div>
                      <span style={{ font: "600 13.5px Urbanist", color: v.t?.muted }}>
                        3 de 5 mensagens hoje · renova à meia-noite
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              {v.notPremium ? (
                <>
                  <div style={{ borderRadius: "32px", background: v.t?.hero, color: v.t?.heroInk, boxShadow: "inset 0 0 0 1px rgba(224,199,142,.45)", padding: v.boxPad, display: "grid", gridTemplateColumns: v.premCols, gap: "28px", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Icon n={"crown"} s={"22"} c={"#E0C78E"} />
                        <span style={{ font: "700 14px Urbanist", color: "#E0C78E" }}>
                          Premium
                        </span>
                      </div>
                      <span style={{ font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                        {"Todas as mentes, "}
                        <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: "#E0C78E" }}>
                          sem limite.
                        </span>
                      </span>
                      <button onClick={v.assinar} style={{ alignSelf: "flex-start", marginTop: "8px", height: "56px", padding: "0 28px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 17px Urbanist", cursor: "pointer" }}>
                        Assinar o Premium
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {(v.beneficios || []).map((b, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: "flex", gap: "12px", alignItems: "center", font: "600 16px Urbanist" }}>
                            <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(224,199,142,.16)", display: "grid", placeItems: "center" }}>
                              <Icon n={b?.icon} s={"16"} c={"#E0C78E"} />
                            </span>
                            {b?.text}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h2 style={{ margin: "0", font: "700 22px Urbanist" }}>
                    Cápsula do plano gratuito
                  </h2>
                  <span style={{ font: "500 15px Urbanist", color: v.t?.muted }}>
                    No plano Gratuito, você conversa com uma mente à sua escolha. O Maestro está sempre disponível.
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: v.capCols, gap: "10px" }}>
                  {(v.capsulas || []).map((c, $index) => (
                    <Fragment key={$index}>
                      <button onClick={c?.pick} style={{ position: "relative", borderRadius: "22px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 ${c?.ringW ?? ''} ${c?.ring ?? ''}`, padding: "8px 8px 12px", display: "flex", flexDirection: "column", gap: "8px", cursor: "pointer", color: v.t?.ink, textAlign: "left", transition: "box-shadow .2s" }}>
                        <div style={{ position: "relative", aspectRatio: "1", borderRadius: "16px", overflow: "hidden", background: "#1A1510" }}>
                          <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                            <ImageSlot id={`mind-${c?.slug ?? ''}`} shape={"rect"} placeholder={c?.name} />
                          </div>
                          {c?.on ? (
                            <>
                              <span style={{ position: "absolute", top: "8px", right: "8px", width: "30px", height: "30px", borderRadius: "50%", background: "#E0C78E", color: "#14110A", display: "grid", placeItems: "center", pointerEvents: "none" }}>
                                <Icon n={"check"} s={"16"} />
                              </span>
                            </>
                          ) : null}
                        </div>
                        <span style={{ padding: "0 4px", font: "700 14px/1.2 Urbanist" }}>
                          {c?.name}
                        </span>
                        <span style={{ padding: "0 4px", font: "600 12px Urbanist", color: c?.subColor }}>
                          {c?.sub}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}
        {v.isMemoria ? (
          <>
            <section data-screen-label={"17 Cápsula de Memória Viva"} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ position: "relative", borderRadius: "34px", overflow: "hidden", background: v.t?.hero, color: v.t?.heroInk, minHeight: v.memHeroH, display: "grid", gridTemplateColumns: v.premCols }}>
                <div style={{ position: "relative", zIndex: "1", padding: v.boxPad, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "16px" }}>
                  <span style={{ alignSelf: "flex-start", height: "30px", padding: "0 13px", borderRadius: "999px", background: "rgba(224,199,142,.16)", color: "#E0C78E", font: "700 12px Urbanist", letterSpacing: ".12em", display: "flex", alignItems: "center" }}>
                    EM BREVE · PREMIUM
                  </span>
                  <h1 style={{ margin: "0", font: `700 ${v.hMem ?? ''}/1.02 Urbanist`, letterSpacing: "-.03em" }}>
                    {"Cápsula de "}
                    <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: "#E0C78E" }}>
                      Memória Viva
                    </span>
                  </h1>
                  <p style={{ margin: "0", maxWidth: "460px", font: "500 18px/1.55 Urbanist", color: v.t?.heroMuted }}>
                    Eternize a sua própria história ou a de alguém que você ama: memórias, valores, o jeito de falar, fotos e áudios. Para que uma voz querida continue por perto.
                  </p>
                  <button onClick={v.avisar} style={{ alignSelf: "flex-start", marginTop: "6px", height: "54px", padding: "0 26px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 16px Urbanist", cursor: "pointer" }}>
                    Quero ser avisado(a)
                  </button>
                </div>
                <div style={{ position: "relative", minHeight: "320px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "10px" }}>
                  <div style={{ position: "relative", gridRow: "span 2", borderRadius: "24px", overflow: "hidden", background: "#1A1510" }}>
                    <div style={{ position: "absolute", inset: "0", filter: "sepia(.35) contrast(1.02) brightness(.92)" }}>
                      <ImageSlot id={"memoria-foto-1"} shape={"rect"} placeholder={"Foto de família"} />
                    </div>
                  </div>
                  <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", background: "#1A1510" }}>
                    <div style={{ position: "absolute", inset: "0", filter: "sepia(.35) brightness(.92)" }}>
                      <ImageSlot id={"memoria-foto-2"} shape={"rect"} placeholder={"Foto antiga"} />
                    </div>
                  </div>
                  <div style={{ borderRadius: "24px", background: "rgba(255,255,255,.06)", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E0C78E", color: "#14110A", display: "grid", placeItems: "center" }}>
                        <Icon n={"play"} s={"16"} />
                      </span>
                      <span style={{ font: "700 13.5px/1.3 Urbanist" }}>
                        Áudio · “Receita do bolo da vó”
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "28px" }}>
                      {(v.wave || []).map((w, $index) => (
                        <Fragment key={$index}>
                          <span style={{ flex: "1", height: w, borderRadius: "2px", background: "rgba(224,199,142,.55)" }}></span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.memStepCols, gap: "12px" }}>
                {(v.memSteps || []).map((s, $index) => (
                  <Fragment key={$index}>
                    <div style={{ borderRadius: "26px", background: s?.bg, color: "#15130E", padding: "24px", display: "flex", flexDirection: "column", gap: "28px" }}>
                      <span style={{ width: "48px", height: "48px", borderRadius: "15px", background: "rgba(21,19,14,.08)", display: "grid", placeItems: "center" }}>
                        <Icon n={s?.icon} s={"22"} />
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <span style={{ font: "700 19px Urbanist" }}>
                          {s?.title}
                        </span>
                        <span style={{ font: "500 14.5px/1.5 Urbanist", opacity: ".78" }}>
                          {s?.text}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <Icon n={"shield-check"} s={"24"} c={v.t?.accentText} />
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ font: "700 17px Urbanist" }}>
                    Com cuidado e consentimento
                  </span>
                  <span style={{ font: "500 15px/1.6 Urbanist", color: v.t?.muted }}>
                    Uma Cápsula de Memória Viva só é criada com autorização de quem é lembrado, ou da família, no caso de quem já partiu. Ela não substitui ninguém nem o tempo do luto: é um lugar para guardar e revisitar. Você decide quem acessa e pode apagá-la quando quiser.
                  </span>
                </div>
              </div>
            </section>
          </>
        ) : null}
        {v.isEstados ? (
          <>
            <section data-screen-label={"16 Estados globais"} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1.05 Urbanist`, letterSpacing: "-.025em" }}>
                Estados globais
              </h1>
              <div style={{ display: "grid", gridTemplateColumns: v.estCols, gap: "14px" }}>
                <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ font: "700 13px Urbanist", color: v.t?.faint }}>
                    Carregando · cards
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {v.skCard1}{v.skCard2}
                  </div>
                </div>
                <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ font: "700 13px Urbanist", color: v.t?.faint }}>
                    Carregando · chat
                  </span>
                  {v.skChat}
                </div>
                <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", textAlign: "center" }}>
                  <span style={{ width: "56px", height: "56px", borderRadius: "50%", background: v.t?.dangerBg, display: "grid", placeItems: "center" }}>
                    <Icon n={"cloud-off"} s={"26"} c={v.t?.danger} />
                  </span>
                  <span style={{ font: "700 20px Urbanist" }}>
                    Algo saiu do lugar.
                  </span>
                  <span style={{ font: "500 14.5px/1.5 Urbanist", color: v.t?.muted, maxWidth: "280px" }}>
                    Não conseguimos carregar esta página agora. Suas conversas estão guardadas.
                  </span>
                  <button onClick={v.toastOk} style={{ height: "44px", padding: "0 20px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 14px Urbanist", cursor: "pointer" }}>
                    Tentar de novo
                  </button>
                </div>
                <div style={{ borderRadius: "28px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ font: "700 13px Urbanist", color: v.t?.faint }}>
                    Toasts e modal
                  </span>
                  <button onClick={v.toastOk} style={{ height: "48px", borderRadius: "16px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 14.5px Urbanist", cursor: "pointer" }}>
                    Mostrar toast de sucesso
                  </button>
                  <button onClick={v.toastErr} style={{ height: "48px", borderRadius: "16px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 14.5px Urbanist", cursor: "pointer" }}>
                    Mostrar toast de erro
                  </button>
                  <button onClick={v.askDemo} style={{ height: "48px", borderRadius: "16px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 14.5px Urbanist", cursor: "pointer" }}>
                    Abrir modal de confirmação
                  </button>
                  <button onClick={v.go404} style={{ height: "48px", borderRadius: "16px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 14.5px Urbanist", cursor: "pointer" }}>
                    Ver página 404
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : null}
        {v.modal ? (
          <>
            <Overlay>
            <div onClick={v.closeModal} style={{ position: "fixed", inset: "0", zIndex: "80", background: "rgba(0,0,0,.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", display: "grid", placeItems: v.modalPlace, padding: v.modalPadOuter }}>
              <div role={"dialog"} aria-modal={"true"} onClick={v.stop} style={{ width: "100%", maxWidth: "420px", borderRadius: "30px", background: v.t?.panel, boxShadow: "0 40px 80px -20px rgba(0,0,0,.7)", padding: "28px", display: "flex", flexDirection: "column", gap: "12px", animation: "etIn .3s both" }}>
                <span style={{ font: "700 23px/1.2 Urbanist", letterSpacing: "-.01em" }}>
                  {v.modal?.title}
                </span>
                <span style={{ font: "500 15px/1.55 Urbanist", color: v.t?.muted }}>
                  {v.modal?.text}
                </span>
                {v.modal?.needType ? (
                  <>
                    <input type={v.modalType} value={v.typed ?? ''} onChange={v.onTyped} placeholder={v.modalPh} style={{ height: "52px", padding: "0 18px", borderRadius: "16px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "700 16px Urbanist", letterSpacing: ".08em", outline: "none" }} />
                  </>
                ) : null}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  <button onClick={v.confirm} disabled={v.confirmDisabled} style={{ height: "52px", borderRadius: "999px", border: "0", background: v.confirmBg, color: "#fff", font: "700 16px Urbanist", cursor: "pointer" }}>
                    {v.modal?.cta}
                  </button>
                  <button onClick={v.closeModal} style={{ height: "52px", borderRadius: "999px", border: "0", background: "transparent", color: v.t?.ink, font: "700 16px Urbanist", cursor: "pointer" }}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
            </Overlay>
          </>
        ) : null}
      </div>
      </>
    );
  }
}
