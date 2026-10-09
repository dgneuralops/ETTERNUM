import React, { Fragment, Suspense, lazy } from 'react';
import { ETT } from '../data.js';
import { Icon } from '../components/Icon.jsx';
import { supabase, toUser, loadProfile, updateProfile, profileForAi, authErro } from '../lib/supabase.js';

// Screens load on demand; the shell (sidebar, header, nav) stays mounted while a chunk loads.
const Chat = lazy(() => import('./Chat.jsx'));
const Clube = lazy(() => import('./Clube.jsx'));
const Conselho = lazy(() => import('./Conselho.jsx'));
const Conta = lazy(() => import('./Conta.jsx'));
const Explorar = lazy(() => import('./Explorar.jsx'));
const Inicio = lazy(() => import('./Inicio.jsx'));
const Publico = lazy(() => import('./Publico.jsx'));
const Triagem = lazy(() => import('./Triagem.jsx'));

const ROUTES = [
  ['landing', 'Landing', '/'], ['cadastro', 'Cadastro', '/cadastro'], ['entrar', 'Entrar', '/entrar'], ['triagem', 'Triagem', '/triagem'],
  ['inicio', 'Início', '/inicio'], ['maestro', 'Maestro', '/maestro'], ['areas', 'Áreas da vida', '/areas'], ['area:negocios', 'Área · Negócios', '/area/negocios'],
  ['area:astrologia', 'Área · Astrologia', '/area/astrologia'], ['mentes', 'Todas as mentes', '/mentes'], ['clube', 'Clube do Livro', '/clube'], ['admin', 'Admin · Login', '/admin'], ['mente:frankl', 'Conversa · Frankl', '/mente/frankl'],
  ['mente:mate', 'Conversa · Gabor Maté', '/mente/mate'], ['conselho:negocios', 'Conselho', '/conselho/negocios'], ['conversas', 'Minhas conversas', '/conversas'],
  ['perfil', 'Perfil', '/perfil'], ['plano', 'Plano', '/plano'], ['termos', 'Termos', '/termos'], ['privacidade', 'Privacidade', '/privacidade'],
  ['estados', 'Estados globais', '/estados'], ['memoria', 'Memória Viva', '/memoria-viva'], ['404', '404', '/qualquer'],
];
const TITLES = { inicio: 'Início', maestro: 'Maestro', mente: 'Conversa', areas: 'Áreas da vida', area: 'Área', mentes: 'Todas as mentes', conselho: 'Conselho', clube: 'Clube do Livro', conversas: 'Minhas conversas', perfil: 'Perfil', plano: 'Plano', memoria: 'Em breve', estados: 'Estados globais' };
const PUBLIC = ['landing', 'cadastro', 'entrar', 'termos', 'privacidade', '404'];
const PRIVATE = ['admin', 'triagem', 'inicio', 'maestro', 'mente', 'areas', 'area', 'mentes', 'conselho', 'clube', 'conversas', 'perfil', 'plano', 'memoria', 'estados'];
const THEME_KEY = 'ett-theme';
// Telas que não exigem conta.
const OPEN = ['landing', 'cadastro', 'entrar', 'termos', 'privacidade', '404', 'admin'];
// Usuário do modo demonstração (sem Supabase).
const DEMO_USER = { id: null, email: 'ana@exemplo.com', nome: 'Ana Clara Souza', primeiro: 'Ana', iniciais: 'AC', signoSym: '♐', signo: 'Sagitário', nascimento: '12/12/1992', idade: 33, cpf: '***.982.247-**', membroDesde: '20 de setembro', plano: 'trial', diasTrial: 14, capsula: 'seneca', favoritos: ['frankl', 'seneca', 'jung'], triagem: null, recomendadas: [], demo: true };
// URL <-> route. Routes are `name` or `name:param` (e.g. mente:frankl -> /mente/frankl).
const pathFor = (route, param) => route === 'landing' ? '/' : route === 'memoria' ? '/memoria-viva' : '/' + route + (param ? '/' + param : '');
const parsePath = pathname => {
  const [r = '', p = ''] = pathname.replace(/^\/+|\/+$/g, '').split('/').map(decodeURIComponent);
  if (!r) return { route: 'landing', param: '' };
  if (r === 'memoria-viva') return { route: 'memoria', param: '' };
  if (r === 'admin') return { route: 'admin', param: '' };
  return PUBLIC.includes(r) || PRIVATE.includes(r) ? { route: r, param: p } : { route: '404', param: '' };
};

export default class Etternum extends React.Component {
  rootRef = el => { if (el && el !== this._rootEl) { this._rootEl = el; this.ro && this.ro.disconnect(); if (window.ResizeObserver) { this.ro = new ResizeObserver(e => { const w = Math.round(e[0].contentRect.width); if (w && w !== this.state.w) this.setState({ w }); }); this.ro.observe(el); } const w0 = Math.round(el.getBoundingClientRect().width); if (w0 && w0 !== this.state.w) setTimeout(() => this.setState({ w: w0 }), 0); } };
  scrollRef = React.createRef();
  constructor(p) {
    super(p);
    const loc = p.screen ? null : parsePath(window.location.pathname);
    const sp = (p.screen || 'landing').split(':');
    let theme = p.theme || 'dark';
    try { theme = p.theme || localStorage.getItem(THEME_KEY) || 'dark'; } catch (e) {}
    this.state = { route: loc ? loc.route : sp[0], param: loc ? loc.param : p.param || sp[1] || '', theme, plan: p.plan || 'trial', favs: { frankl: true, seneca: true, jung: true }, session: supabase ? undefined : null, user: supabase ? null : DEMO_USER, toast: '', w: window.innerWidth || 1440, mapOpen: false, nonce: 0, variant: (window.history.state || {}).variant || p.variant || '' };
  }
  componentDidMount() {
    window.addEventListener('popstate', this.onPop);
    this.syncTitle();
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => this.onSession(data.session));
      this.authSub = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') this.nav('perfil', '', 'nova-senha');
        if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'USER_UPDATED') this.onSession(session);
      }).data.subscription;
    }
  }
  // Carrega o perfil da pessoa logada; protege as telas internas.
  onSession = async session => {
    if (!session) return this.setState({ session: null, user: null }, () => this.guard());
    if (this.state.session && this.state.session.user.id === session.user.id && this.state.user) return this.setState({ session });
    let profile = null;
    try { profile = await loadProfile(session.user.id); } catch (e) { console.error('[perfil]', e.message); }
    const user = toUser(profile || { id: session.user.id, nome: session.user.user_metadata?.nome, created_at: session.user.created_at }, session.user.email);
    this.setState({ session, user, plan: user.plano, favs: Object.fromEntries(user.favoritos.map(k => [k, true])) });
    if (['entrar', 'cadastro'].includes(this.state.route)) this.nav(user.triagem ? 'inicio' : 'triagem');
  };
  guard() {
    const s = this.state;
    if (supabase && s.session === null && !OPEN.includes(s.route)) this.nav('entrar', '', 'voltar:' + window.location.pathname);
  }
  refreshUser = async () => {
    if (!this.state.session) return;
    const profile = await loadProfile(this.state.session.user.id);
    const user = toUser(profile, this.state.session.user.email);
    this.setState({ user, plan: user.plano, favs: Object.fromEntries(user.favoritos.map(k => [k, true])) });
  };
  saveProfile = async patch => {
    if (!this.state.user || this.state.user.demo) return;
    try { await updateProfile(this.state.user.id, patch); await this.refreshUser(); } catch (e) { console.error('[perfil]', e.message); this.toast('Não foi possível salvar agora.'); }
  };
  componentDidUpdate(pp, ps) {
    const p = this.props;
    if (pp.theme !== p.theme && p.theme) this.setState({ theme: p.theme });
    if (pp.plan !== p.plan && p.plan) this.setState({ plan: p.plan });
    if (pp.screen !== p.screen && p.screen) { const sp = p.screen.split(':'); this.setState({ route: sp[0], param: p.param || sp[1] || '' }); }
    if (ps.route !== this.state.route || ps.param !== this.state.param) { this.syncTitle(); this.guard(); }
    if (ps.theme !== this.state.theme) { try { localStorage.setItem(THEME_KEY, this.state.theme); } catch (e) {} }
  }
  componentWillUnmount() { this.authSub && this.authSub.unsubscribe(); clearTimeout(this.tt); this.ro && this.ro.disconnect(); window.removeEventListener('popstate', this.onPop); }
  onPop = e => {
    const { route, param } = parsePath(window.location.pathname);
    this.setState(s => ({ route, param, variant: (e.state || {}).variant || '', nonce: s.nonce + 1, mapOpen: false }));
  };
  syncTitle() {
    const s = this.state, mind = s.route === 'mente' && ETT.bySlug[s.param];
    const title = mind ? mind.name : s.route === 'landing' ? '' : TITLES[s.route] || { cadastro: 'Crie sua conta', entrar: 'Entrar', triagem: 'Triagem', termos: 'Termos de Uso', privacidade: 'Política de Privacidade', admin: 'Admin', '404': 'Página não encontrada' }[s.route] || '';
    document.title = title ? `${title} · Etternum` : 'Etternum · Converse com Grandes Mentes';
  }
  nav = (route, param, variant, path) => {
    const url = path || pathFor(route, param);
    if (!this.props.screen) window.history.pushState({ variant: variant || '' }, '', url);
    this.setState(s => ({ route, param: param || '', variant: variant || '', nonce: s.nonce + 1, mapOpen: false }));
    requestAnimationFrame(() => { if (this.scrollRef.current) this.scrollRef.current.scrollTop = 0; });
  };
  toast = msg => { clearTimeout(this.tt); this.setState({ toast: msg }); this.tt = setTimeout(() => this.setState({ toast: '' }), 2600); };
  renderVals() {
    const s = this.state, P = this.props;
    const E = ETT, t = { ...E.themes[s.theme], pastel1: E.themes[s.theme].pastel[0] };
    const mobile = P.device === 'mobile' || (P.device !== 'desktop' && s.w < 768);
    const desktop = !mobile;
    const route = s.route;
    const isPublic = PUBLIC.includes(route) || !PRIVATE.includes(route);
    const isTriagem = route === 'triagem', isAdminR = route === 'admin';
    const app = {
      t, mobile, w: s.w, route: isPublic && !PUBLIC.includes(route) ? '404' : route, param: s.param, variant: s.variant || P.variant || '', plan: s.plan, favs: s.favs, nonce: s.nonce,
      nav: this.nav, toast: this.toast,
      setPlan: plan => this.setState({ plan }),
      toggleFav: slug => { const on = !s.favs[slug]; const favs = { ...s.favs, [slug]: on }; this.setState({ favs }); this.saveProfile({ favoritos: Object.keys(favs).filter(k => favs[k]) }); const m = E.bySlug[slug]; if (m) this.toast(on ? `${m.name} entrou no seu Quadro Eterno.` : `${m.name} saiu do seu Quadro Eterno.`); },
      user: s.user || DEMO_USER, loggedIn: !!s.session, demo: !supabase, profileAi: profileForAi(s.user), saveProfile: this.saveProfile, refreshUser: this.refreshUser,
      auth: {
        signUp: async ({ email, senha, nome, nascimento, cpf }) => {
          const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome, nascimento, cpf }, emailRedirectTo: window.location.origin + '/triagem' } });
          if (error) return { error: authErro(error) };
          return { confirm: !data.session };
        },
        signIn: async ({ email, senha }) => { const { error } = await supabase.auth.signInWithPassword({ email, password: senha }); return error ? { error: authErro(error) } : {}; },
        reset: async email => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/perfil' }); return error ? { error: authErro(error) } : {}; },
        newPassword: async senha => { const { error } = await supabase.auth.updateUser({ password: senha }); return error ? { error: authErro(error) } : {}; },
        signOut: async () => { await supabase.auth.signOut(); this.nav('landing'); },
      },
      toggleTheme: () => this.setState({ theme: s.theme === 'dark' ? 'light' : 'dark' }),
    };
    const active = { inicio: 0, maestro: 1, areas: 2, area: 2, conselho: 2, mentes: 3, mente: 3, clube: 4, conversas: 5, perfil: 6, plano: 7 }[route];
    const side = [['Início', 'house', 'inicio'], ['Maestro', 'infinity', 'maestro'], ['Áreas da vida', 'layout-grid', 'areas'], ['Todas as mentes', 'users', 'mentes'], ['Clube do Livro', 'library', 'clube'], ['Minhas conversas', 'messages-square', 'conversas'], ['Perfil', 'user-round', 'perfil'], ['Plano', 'crown', 'plano']];
    const bottom = [['Início', 'house', 'inicio', 0], ['Maestro', 'infinity', 'maestro', 1], ['Áreas', 'layout-grid', 'areas', 2], ['Clube', 'library', 'clube', 4], ['Perfil', 'user-round', 'perfil', 6]];
    const mobActive = active === 3 ? 2 : active === 5 || active === 7 ? 6 : active;
    const isChat = route === 'maestro' || route === 'mente';
    return {
      ready: !(supabase && s.session === undefined && !OPEN.includes(route)), t, app, wide: s.w >= 1180, nameDisplay: s.w >= 1180 ? 'flex' : 'none', rootRef: this.rootRef, scrollRef: this.scrollRef, rootH: P.frameless ? '100%' : '100dvh',
      isPublic, isTriagem, isAdminR, isApp: !isPublic && !isTriagem && !isAdminR, desktop, mobile,
      shellDir: desktop ? 'row' : 'column', shellGap: desktop ? '14px' : '0px', shellPad: desktop ? '14px' : '0px',
      topH: desktop ? '64px' : 'calc(60px + env(safe-area-inset-top))', topPad: desktop ? '0 4px 0 12px' : 'env(safe-area-inset-top) 16px 0', topBg: desktop ? 'transparent' : t.glass, topBorder: desktop ? '0' : `1px solid ${t.line}`,
      contentPad: isChat ? '0' : desktop ? '8px 4px 40px 12px' : '16px 16px 32px',
      pageTitle: TITLES[route] || '',
      planLabel: { trial: `Teste grátis · ${app.user.diasTrial} dias`, free: 'Gratuito', premium: 'Premium' }[s.plan], u: app.user, signoLine: app.user.signo ? `${app.user.signoSym}︎ ${app.user.signo}` : app.user.email, showUpgrade: s.plan !== 'premium' && desktop,
      toggleTheme: app.toggleTheme,
      sideItems: side.map(([label, icon, r], i) => ({ k: label + (i === active ? '-on' : '-off') + s.theme, label, icon, bg: i === active ? t.navBg : 'transparent', fg: i === active ? t.navFg : t.muted, hover: i === active ? t.navFg : t.ink, go: () => this.nav(r) })),
      bottomItems: bottom.map(([label, icon, r, i]) => ({ k: label + (i === mobActive ? '-on' : '-off') + s.theme, label, icon, fg: i === mobActive ? t.ink : t.faint, bg: i === mobActive ? t.accentSoft : 'transparent', go: () => this.nav(r) })),
      goInicio: () => this.nav('inicio'), goMaestro: () => this.nav('maestro'), goSair: () => (supabase && s.session ? app.auth.signOut() : this.nav('landing')), goPlano: () => this.nav('plano'), goPerfil: () => this.nav('perfil'), goMentes: () => this.nav('mentes'),
      r: { inicio: route === 'inicio', chat: isChat, explorar: ['areas', 'area', 'mentes'].includes(route), conselho: route === 'conselho', clube: route === 'clube', conta: ['conversas', 'perfil', 'plano', 'memoria', 'estados'].includes(route) },
      routeKey: route + s.param + s.nonce, clubeMode: s.param === 'admin' ? 'admin' : 'leitor', notChat: !isChat,
      toast: s.toast, toastBottom: mobile && !isPublic && !isTriagem ? '104px' : '28px',
      showMap: !P.frameless && !isAdminR, goLanding: () => this.nav('landing'), mapOpen: s.mapOpen, toggleMap: () => this.setState({ mapOpen: !s.mapOpen }), mapBottom: mobile && !isPublic && !isTriagem ? '100px' : desktop && !isPublic && !isTriagem ? '72px' : '14px',
      mapItems: ROUTES.map(([k, label, path]) => { const [r, p] = k.split(':'); return { label, path, bg: r === route && (p || '') === (s.param || '') ? '#2A2A2E' : 'transparent', go: () => this.nav(r, p, '', path) }; }),
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div id="ett-app" ref={v.rootRef} style={{ position: "relative", transform: "translateZ(0)", height: v.rootH, overflow: "hidden", background: v.t?.bg, color: v.t?.ink, fontFamily: "Urbanist,system-ui,sans-serif", transition: "background .3s,color .3s" }}>
        {v.ready ? (
          <>
            {v.isPublic ? (
              <>
                <div ref={v.scrollRef} style={{ height: "100%", overflowY: "auto" }}>
                  <Suspense fallback={null}><Publico app={v.app} /></Suspense>
                </div>
              </>
            ) : null}
            {v.isTriagem ? (
              <>
                <div style={{ height: "100%", overflowY: "auto" }}>
                  <Suspense fallback={null}><Triagem app={v.app} /></Suspense>
                </div>
              </>
            ) : null}
            {v.isAdminR ? (
              <>
                <div style={{ height: "100%", overflowY: "auto" }}>
                  <Suspense fallback={null}><Clube mode={"admin"} onExit={v.goLanding} /></Suspense>
                </div>
              </>
            ) : null}
            {v.isApp ? (
              <>
                <div style={{ height: "100%", display: "flex", flexDirection: v.shellDir, gap: v.shellGap, padding: v.shellPad }}>
                  {v.desktop ? (
                    <>
                      <aside style={{ flex: "none", width: "236px", height: "100%", borderRadius: "26px", background: v.t?.panel, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "26px 14px 16px", display: "flex", flexDirection: "column", gap: "26px", overflowY: "auto", scrollbarWidth: "none" }}>
                        <button onClick={v.goInicio} style={{ flex: "none", display: "flex", alignItems: "center", gap: "9px", padding: "0 10px", border: "0", background: "transparent", color: v.t?.ink, cursor: "pointer" }}>
                          <Icon n={"infinity"} s={"26"} c={"#E0C78E"} />
                          <span style={{ font: "800 16px Urbanist", letterSpacing: ".22em" }}>
                            ETTERNUM
                          </span>
                        </button>
                        <nav style={{ flex: "none", display: "flex", flexDirection: "column", gap: "3px" }}>
                          {(v.sideItems || []).map((n, $index) => (
                            <Fragment key={$index}>
                              <button key={n?.k} onClick={n?.go} style={{ flex: "none", height: "42px", padding: "0 14px", borderRadius: "999px", border: "0", display: "flex", alignItems: "center", gap: "12px", font: "600 14.5px Urbanist", background: n?.bg, color: n?.fg, cursor: "pointer", textAlign: "left" }}>
                                <Icon n={n?.icon} s={"18"} />
                                {n?.label}
                              </button>
                            </Fragment>
                          ))}
                        </nav>
                        <button onClick={v.goMaestro} style={{ flex: "none", height: "44px", borderRadius: "999px", border: "0", background: v.t?.altBg, color: v.t?.altFg, font: "700 14px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", transition: "transform .15s" }} className="ette-a1">
                          <Icon n={"infinity"} s={"16"} />
                          Falar com o Maestro
                        </button>
                        <div style={{ flex: "1" }}></div>
                        <button onClick={v.goSair} style={{ flex: "none", height: "40px", padding: "0 14px", border: "0", background: "transparent", display: "flex", alignItems: "center", gap: "12px", font: "600 14.5px Urbanist", color: v.t?.muted, cursor: "pointer" }}>
                          <Icon n={"log-out"} s={"18"} />
                          Sair
                        </button>
                      </aside>
                    </>
                  ) : null}
                  <div style={{ flex: "1", minWidth: "0", minHeight: "0", display: "flex", flexDirection: "column" }}>
                    <header style={{ flex: "none", height: v.topH, display: "flex", alignItems: "center", gap: "12px", padding: v.topPad, background: v.topBg, borderBottom: v.topBorder }}>
                      {v.desktop ? (
                        <>
                          <span style={{ flex: "1 0 auto", font: "700 22px Urbanist", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {"Olá, "}
                            <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                              {v.u?.primeiro}
                            </span>
                          </span>
                          {v.wide ? (
                            <>
                              <button onClick={v.goMentes} style={{ width: "260px", height: "42px", borderRadius: "999px", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, display: "flex", alignItems: "center", gap: "10px", padding: "0 16px", color: v.t?.faint, font: "500 14px Urbanist", cursor: "pointer", whiteSpace: "nowrap" }}>
                                <Icon n={"search"} s={"16"} />
                                Mente, tema, área
                              </button>
                            </>
                          ) : null}
                        </>
                      ) : null}
                      {v.mobile ? (
                        <>
                          <button onClick={v.goInicio} aria-label={"Início"} style={{ width: "44px", height: "44px", marginLeft: "-10px", border: "0", background: "transparent", display: "grid", placeItems: "center", cursor: "pointer" }}>
                            <Icon n={"infinity"} s={"28"} c={"#E0C78E"} />
                          </button>
                          <span style={{ flex: "1" }}></span>
                        </>
                      ) : null}
                      <button onClick={v.goPlano} style={{ height: "32px", padding: "0 13px", borderRadius: "999px", border: "0", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 12.5px Urbanist", display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", whiteSpace: "nowrap" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: v.t?.pillFg }}></span>
                        {v.planLabel}
                      </button>
                      {v.showUpgrade ? (
                        <>
                          <button onClick={v.goPlano} style={{ height: "40px", padding: "0 18px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 14px Urbanist", display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .2s" }}>
                            <Icon n={"sparkles"} s={"15"} />
                            Fazer upgrade
                          </button>
                        </>
                      ) : null}
                      <button onClick={v.toggleTheme} aria-label={"Alternar tema"} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer", transition: "transform .3s" }} className="ette-h2">
                        <Icon n={v.t?.themeIcon} s={"18"} />
                      </button>
                      {v.desktop ? (
                        <>
                          <button onClick={v.goPerfil} style={{ display: "flex", alignItems: "center", gap: "10px", border: "0", background: "transparent", color: v.t?.ink, cursor: "pointer", padding: "0 0 0 6px", textAlign: "left" }}>
                            <span style={{ width: "40px", height: "40px", borderRadius: "50%", background: v.t?.pastel1, color: "#15130E", display: "grid", placeItems: "center", font: "700 15px Urbanist" }}>
                              {v.u?.iniciais}
                            </span>
                            <span style={{ display: v.nameDisplay, flexDirection: "column", whiteSpace: "nowrap" }}>
                              <span style={{ font: "700 14px Urbanist" }}>
                                {v.u?.nome.split(' ').slice(0, 2).join(' ')}
                              </span>
                              <span style={{ font: "500 12px Urbanist", color: v.t?.muted }}>
                                {v.signoLine}
                              </span>
                            </span>
                          </button>
                        </>
                      ) : null}
                    </header>
                    <div ref={v.scrollRef} style={{ position: "relative", flex: "1", minHeight: "0", overflowY: "auto", overflowX: "hidden", padding: v.contentPad }}>
                      {v.r?.chat ? (
                        <>
                          <div key={v.routeKey} style={{ position: "absolute", inset: "0" }}>
                            <Suspense fallback={null}><Chat app={v.app} /></Suspense>
                          </div>
                        </>
                      ) : null}
                      {v.notChat ? (
                        <>
                          <div key={v.routeKey} style={{ animation: "etIn .45s cubic-bezier(.25,.1,.25,1) both", minHeight: "100%" }}>
                            {v.r?.inicio ? (
                              <>
                                <Suspense fallback={null}><Inicio app={v.app} /></Suspense>
                              </>
                            ) : null}
                            {v.r?.explorar ? (
                              <>
                                <Suspense fallback={null}><Explorar app={v.app} /></Suspense>
                              </>
                            ) : null}
                            {v.r?.conselho ? (
                              <>
                                <Suspense fallback={null}><Conselho app={v.app} /></Suspense>
                              </>
                            ) : null}
                            {v.r?.conta ? (
                              <>
                                <Suspense fallback={null}><Conta app={v.app} /></Suspense>
                              </>
                            ) : null}
                            {v.r?.clube ? (
                              <>
                                <Suspense fallback={null}><Clube embedded={true} mode={"leitor"} /></Suspense>
                              </>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                    {v.mobile ? (
                      <>
                        <nav style={{ flex: "none", padding: "6px 6px max(26px, env(safe-area-inset-bottom))", display: "grid", gridTemplateColumns: "repeat(5,1fr)", background: v.t?.glass, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: `1px solid ${v.t?.line ?? ''}` }}>
                          {(v.bottomItems || []).map((b, $index) => (
                            <Fragment key={$index}>
                              <button key={b?.k} onClick={b?.go} style={{ height: "56px", border: "0", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", cursor: "pointer", color: b?.fg, font: "600 11px Urbanist" }}>
                                <span style={{ height: "30px", minWidth: "52px", borderRadius: "999px", background: b?.bg, display: "grid", placeItems: "center", transition: "background .2s" }}>
                                  <Icon n={b?.icon} s={"21"} />
                                </span>
                                {b?.label}
                              </button>
                            </Fragment>
                          ))}
                        </nav>
                      </>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
            {v.toast ? (
              <>
                <div role={"status"} style={{ position: "absolute", left: "50%", bottom: v.toastBottom, transform: "translateX(-50%)", zIndex: "60", display: "flex", alignItems: "center", gap: "10px", padding: "13px 20px", borderRadius: "999px", background: v.t?.altBg, color: v.t?.altFg, font: "600 14px Urbanist", boxShadow: "0 20px 40px -12px rgba(0,0,0,.6)", animation: "etPop .35s cubic-bezier(.25,.1,.25,1) both", whiteSpace: "nowrap", maxWidth: "92%" }}>
                  <Icon n={"circle-check"} s={"17"} />
                  {v.toast}
                </div>
              </>
            ) : null}
            {v.showMap ? (
              <>
                <div style={{ position: "absolute", left: "14px", bottom: v.mapBottom, zIndex: "70", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
                  {v.mapOpen ? (
                    <>
                      <div style={{ width: "250px", maxHeight: "420px", overflowY: "auto", padding: "10px", borderRadius: "20px", background: "#1F1F22", boxShadow: "0 30px 60px -20px rgba(0,0,0,.8),inset 0 0 0 1px rgba(255,255,255,.08)", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {(v.mapItems || []).map((m, $index) => (
                          <Fragment key={$index}>
                            <button onClick={m?.go} style={{ height: "36px", padding: "0 10px", border: "0", borderRadius: "10px", background: m?.bg, color: "#F3EFE6", font: "500 13px Urbanist", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: "8px" }} className="ette-h3">
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
          </>
        ) : null}
      </div>
      </>
    );
  }
}
