import React, { Fragment } from 'react';
import { ETT } from '../data.js';
import { Icon } from '../components/Icon.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';

const SIGNS_ = [['♑', 'Capricórnio', 120], ['♒', 'Aquário', 219], ['♓', 'Peixes', 320], ['♈', 'Áries', 420], ['♉', 'Touro', 521], ['♊', 'Gêmeos', 621], ['♋', 'Câncer', 722], ['♌', 'Leão', 823], ['♍', 'Virgem', 923], ['♎', 'Libra', 1023], ['♏', 'Escorpião', 1122], ['♐', 'Sagitário', 1222], ['♑', 'Capricórnio', 1232]];
const signOf = (d, m) => { const v = m * 100 + d; return SIGNS_.find(s => v < s[2]) || SIGNS_[0]; };
const isoDate = br => { const [d, m, y] = br.split('/').map(Number); if (!d || !m || !y || y < 1900 || m > 12 || d > 31) return ''; return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`; };
const idade = iso => (Date.now() - new Date(iso + 'T12:00:00')) / 3.15576e10;
// Alerta (erro ou informação) dentro dos formulários de conta.
const Aviso = ({ t, kind, children }) => (
  <div role={kind === 'erro' ? 'alert' : 'status'} style={{ padding: '14px 18px', borderRadius: 16, background: kind === 'erro' ? t.dangerBg : t.accentSoft, color: kind === 'erro' ? t.dangerInk : t.accentText, boxShadow: kind === 'erro' ? 'none' : `inset 0 0 0 1px ${t.accentLine}`, font: '600 14px/1.45 Urbanist', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <Icon n={kind === 'erro' ? 'circle-alert' : 'circle-check'} s={17} />
    <span>{children}</span>
  </div>
);
const cpfMask = v => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const dateMask = v => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
const cpfValid = c => { const d = c.replace(/\D/g, ''); if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false; const calc = n => { let s = 0; for (let i = 0; i < n; i++) s += +d[i] * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; }; return calc(9) === +d[9] && calc(10) === +d[10]; };
const TERMOS = [
  ['O que é o Etternum', 'O Etternum é uma plataforma de conversas com cápsulas de inteligência artificial inspiradas no pensamento de grandes mentes da humanidade, e com o Maestro, um assistente que acompanha você ao longo do tempo.'],
  ['O que o Etternum não é', 'O Etternum não oferece terapia, diagnóstico ou tratamento e não substitui psicólogos, médicos ou outros profissionais. Em situações de crise, procure ajuda imediata: CVV 188, SAMU 192, Polícia 190 ou Central de Atendimento à Mulher 180.'],
  ['Cápsulas e “Inspirado em”', 'As cápsulas são recriações feitas por IA, alimentadas com os livros e materiais de cada autor, e não representam as pessoas reais. Cápsulas marcadas como “Inspirado em” são especialistas que falam sobre as ideias de uma pessoa viva ou figura religiosa, nunca como ela.'],
  ['Sua conta e seus dados', 'Para usar o Etternum você precisa ter 18 anos ou mais. Guardamos o histórico das suas conversas e um resumo do que você compartilha para personalizar a experiência. Você pode ver e apagar essa memória a qualquer momento no seu Perfil.'],
  ['Planos e cobrança', 'Toda conta começa com 14 dias de teste com acesso completo. Depois, a conta passa ao plano Gratuito (uma cápsula e cinco mensagens por dia) ou ao Premium, com acesso ilimitado.'],
];

export default class Publico extends React.Component {
  carRef = React.createRef(); testiRef = React.createRef(); mentesRef = React.createRef(); comoRef = React.createRef(); listaRef = React.createRef(); topRef = React.createRef();
  state = { faq: 0, f: this.props.app?.demo ? { nome: 'Ana Clara Souza', email: 'ana@exemplo.com', senha: 'etternum26', cpf: '', nasc: '12/12/1992', termos: false } : { nome: '', email: '', senha: '', cpf: '', nasc: '', termos: false }, busy: false, msg: '', info: '', err: {}, pw: false, waitDone: false, init: '' };
  componentDidMount() { this.applyVariant(); }
  componentDidUpdate() { this.applyVariant(); }
  applyVariant() {
    const a = this.props.app || {}; const key = a.route + a.variant;
    if (this.state.init === key) return;
    if (a.variant === 'erro') this.setState({ init: key, err: a.route === 'entrar' ? { login: true } : { cpf: true, termos: true }, f: { ...this.state.f, cpf: '123.456.789-00' } });
    else if (a.variant === 'sucesso') this.setState({ init: key, waitDone: true });
    else this.setState({ init: key, err: {} });
  }
  scrollTo(ref) { const el = ref.current; if (!el) return; let p = el.parentElement; while (p && p.scrollHeight <= p.clientHeight) p = p.parentElement; if (p) p.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }); }
  set(k, v) { this.setState(s => ({ f: { ...s.f, [k]: v } })); }
  renderVals() {
    const a = this.props.app || {}; const E = ETT; const t = a.t || {}; const s = this.state; const mob = !!a.mobile;
    if (!E) return {};
    const route = a.route || 'landing';
    const [dd, mm] = s.f.nasc.split('/').map(Number);
    const sg = dd && mm ? signOf(dd, mm) : ['♐', 'Sagitário'];
    const nav = (r, p) => a.nav && a.nav(r, p);
    return {
      t: { ...t, pastel0: (t.pastel || [])[0] }, desktop: !mob, px: mob ? '20px' : '32px',
      heroPad: mob ? '56px 20px 48px' : '112px 32px 72px', h1: mob ? '44px' : 'clamp(56px,7vw,92px)', h2: mob ? '34px' : '52px', lead: mob ? '18px' : '21px',
      secGap: mob ? '80px' : '128px', clubeStageH: mob ? '400px' : '520px', boxPad: mob ? '28px' : '56px', authPad: mob ? '32px 20px 56px' : '56px 32px 80px',
      cols2: mob ? '1fr' : '1fr 1fr', cols3: mob ? '1fr' : 'repeat(3,1fr)', cols4: mob ? '1fr' : 'repeat(4,1fr)', colsAreas: mob ? '1fr 1fr' : 'repeat(5,1fr)',
      cardW: mob ? '78vw' : '268px', carPad: mob ? '20px' : 'max(32px,calc((100% - 1176px)/2))',
      isLanding: route === 'landing', isAuth: route === 'cadastro' || route === 'entrar', isCadastro: route === 'cadastro', isEntrar: route === 'entrar',
      isTermos: route === 'termos' || route === 'privacidade', is404: route === '404',
      carousel: E.carousel, carRef: this.carRef, mentesRef: this.mentesRef, comoRef: this.comoRef, listaRef: this.listaRef, topRef: this.topRef,
      carPrev: () => this.carRef.current?.scrollBy({ left: -282 }), carNext: () => this.carRef.current?.scrollBy({ left: 282 }),
      toMentes: () => this.scrollTo(this.mentesRef), toComo: () => this.scrollTo(this.comoRef), toLista: () => this.scrollTo(this.listaRef),
      pilares: [['Conexão com o Conhecimento', 'Cada mente é alimentada com todos os livros e materiais do seu autor. Converse com a obra completa de filósofos, psicólogos, teólogos e empresários.', 'library'], ['Interação Personalizada', 'Cada resposta considera a sua história, o seu momento e o que você já contou.', 'messages-square'], ['Enriquecimento Pessoal', 'Clareza para decidir, calma para atravessar e sentido para seguir.', 'sprout']].map(([title, text, icon], i) => ({ title, text, icon, bg: t.pastel[[0, 1, 4][i]] })),
      passos: [['Faça sua triagem', 'Algumas perguntas rápidas sobre a sua rotina e o que pesa hoje.'], ['Converse com o Maestro', 'Seu amigo pessoal eterno, que ouve e lembra de tudo.'], ['Escolha uma área ou uma mente', 'Dez áreas da vida e 61 grandes mentes.'], ['Abra o Conselho', 'Leve uma situação a até quatro mentes ao mesmo tempo.']].map(([title, text], i) => ({ n: i + 1, roman: ['I','II','III','IV'][i] + '.', title, text, bg: t.pastel[i] })),
      areas: E.areas.map((ar, i) => ({ ...ar, roman: ["I","II","III","IV","V","VI","VII","VIII","IX","X"][i], tint: E.hexA(ar.color, .16), ring: E.hexA(ar.color, .45) })),
      comoCols: mob ? '1fr' : '400px 1fr', comoGap: mob ? '36px' : '96px', stickyPos: mob ? 'static' : 'sticky', h2serif: mob ? '42px' : '64px', stepCols: mob ? '52px 1fr' : '96px 1fr', stepGap: mob ? '12px' : '24px', stepPad: mob ? '28px 0' : '40px 0', romanSize: mob ? '36px' : '52px', stepTitle: mob ? '26px' : '34px', areasGap: mob ? '36px' : '56px', areaName: mob ? '22px' : '26px',
      sobreMinds: ['seneca', 'jung', 'arendt', 'rumi', 'frankl', 'beauvoir'].map((k, i) => ({ ...E.bySlug[k], offset: i % 3 === 1 ? '28px' : '0px' })),

      depoimentos: [['Eu chegava em casa exausta e sem vontade de falar com ninguém. Conversar com o Maestro à noite virou o meu momento de colocar a cabeça no lugar. Ele lembra do que eu contei e me ajuda a ver as coisas com mais calma.','Marina Albuquerque','Designer · desde 2026'],['Perdi meu pai no ano passado. As conversas com Sêneca e Elisabeth Kübler-Ross me deram palavras para um luto que eu não conseguia explicar nem para a minha família.','Rafael Menezes','Professor · desde 2026'],['Levei ao Conselho a decisão de abrir minha loja. Ouvir Drucker, Christensen e Jobs sobre o mesmo problema, com uma síntese no final, me deu mais clareza do que meses de planilhas.','Juliana Prado','Empreendedora · desde 2026'],['Achei que seria só mais um app. Mas a triagem acertou em cheio: em poucos minutos o Etternum entendeu que eu precisava falar de ansiedade, e não de produtividade.','Carlos Eduardo Lima','Engenheiro · desde 2026'],['Leio Jung há anos. Poder conversar sobre as ideias dele aplicadas à minha vida, no meu idioma, é uma experiência que eu não esperava ter.','Beatriz Nogueira','Psicóloga em formação · desde 2026']].map(([text, name, meta], i) => { const f = i === 0; return { text, name, meta, ini: name.split(' ').map(w => w[0]).slice(0, 2).join(''), bg: f ? 'linear-gradient(160deg,#B79A68,#7E6440)' : t.card, fg: f ? '#FBF6EA' : t.ink, sub: f ? 'rgba(251,246,234,.75)' : t.faint, mark: f ? 'rgba(251,246,234,.6)' : t.accentText, line: f ? 'rgba(251,246,234,.25)' : t.line, ring: f ? '0 30px 60px -30px rgba(126,100,64,.6)' : 'inset 0 0 0 1px ' + t.line, avBg: t.pastel[i % 6] }; }),
      testiRef: this.testiRef, tPrev: () => this.testiRef.current?.scrollBy({ left: -340 }), tNext: () => this.testiRef.current?.scrollBy({ left: 340 }),
      testiW: mob ? '82vw' : '320px', testiJustify: mob ? 'start' : 'end', faqH: mob ? '30px' : '46px', faqH2: mob ? '34px' : '52px',
      faq: [['O Etternum substitui terapia ou acompanhamento médico?','Não. O Etternum é um espaço de reflexão e conversa. Ele não oferece diagnóstico nem tratamento e não substitui psicólogos, médicos ou outros profissionais. Em uma crise, ligue 188 (CVV, gratuito, 24 horas).'],['De onde vem o conhecimento de cada mente?','Cada cápsula é alimentada com todos os livros e materiais do autor: obras completas, ensaios, cartas, palestras e entrevistas. É por isso que as respostas trazem os conceitos, o vocabulário e o modo de pensar de cada mente.'],['As mentes são as pessoas reais?','Não. Cada cápsula é uma recriação feita por inteligência artificial a partir de toda a obra de cada pensador. Ela conversa no estilo e com os conceitos dessa pessoa, mas não é ela.'],['O que significa “Inspirado em”?','Em pessoas vivas e figuras religiosas, a cápsula é um especialista que fala sobre as ideias daquela pessoa, nunca como ela. O selo aparece sempre no card e na conversa.'],['Quem é o Maestro?','Aurelius, o Maestro, é o Guardião das Mentes do Etternum. Ele conhece a sua história, conversa com você sobre qualquer assunto e, quando faz sentido, apresenta a grande mente ideal para o seu momento.'],['O que o Etternum guarda sobre mim?','O histórico das suas conversas e um resumo do que você compartilha, para personalizar as respostas. Só você vê. No Perfil, você pode ler essa memória e apagá-la quando quiser.'],['Como funcionam o teste grátis e os planos?','Toda conta começa com 14 dias de acesso completo. Depois, você pode seguir no plano Gratuito, com uma cápsula e cinco mensagens por dia, ou assinar o Premium para ter todas as mentes sem limite.'],['Posso cancelar quando quiser?','Sim. Você cancela o Premium a qualquer momento no Plano e continua com acesso até o fim do período já pago.']].map(([q, a], i) => { const open = s.faq === i; return { q, a, open, rows: open ? '1fr' : '0fr', rot: open ? '180deg' : '0deg', bg: open ? t.card : 'transparent', ring: open ? t.accentLine : t.line, toggle: () => this.setState({ faq: open ? -1 : i }) }; }),
      waitDone: s.waitDone, waitForm: !s.waitDone, submitWait: e => { e.preventDefault(); this.setState({ waitDone: true }); },
      authTitle: route === 'entrar' ? 'Bem-vindo de volta' : 'Crie sua conta', authSub: route === 'entrar' ? 'Suas mentes e o Maestro estão esperando por você.' : '14 dias grátis com acesso a todas as mentes.',
      f: s.f, err: s.err,
      on: { nome: e => this.set('nome', e.target.value), email: e => this.set('email', e.target.value), senha: e => this.set('senha', e.target.value), cpf: e => { this.set('cpf', cpfMask(e.target.value)); if (s.err.cpf) this.setState({ err: { ...s.err, cpf: false } }); }, nasc: e => this.set('nasc', dateMask(e.target.value)) },
      pwType: s.pw ? 'text' : 'password', pwIcon: s.pw ? 'eye-off' : 'eye', togglePw: () => this.setState({ pw: !s.pw }),
      cpfBg: s.err.cpf ? t.dangerBg : t.card2, cpfRing: s.err.cpf ? t.danger : t.line, cpfRingW: s.err.cpf ? '2px' : '1px',
      signo: { sym: sg[0], name: sg[1] },
      chkBg: s.f.termos ? '#E0C78E' : t.card2, chkRing: s.err.termos ? t.danger : t.line2, chkRingW: s.err.termos ? '2px' : '1.5px',
      toggleTermos: () => this.setState(st => ({ f: { ...st.f, termos: !st.f.termos }, err: { ...st.err, termos: false } })),
      submitCadastro: async e => {
        e.preventDefault();
        if (s.busy) return;
        const nasc = isoDate(s.f.nasc);
        const err = { cpf: !cpfValid(s.f.cpf), termos: !s.f.termos };
        const msg = !s.f.nome.trim() ? 'Conte como podemos chamar você.' : !/.+@.+\..+/.test(s.f.email) ? 'Confira o e-mail digitado.' : s.f.senha.length < 8 ? 'A senha precisa ter pelo menos 8 caracteres.' : !nasc ? 'Confira a data de nascimento (dd/mm/aaaa).' : idade(nasc) < 18 ? 'O Etternum é para maiores de 18 anos.' : '';
        if (err.cpf || err.termos || msg) return this.setState({ err, msg, info: '' });
        if (a.demo || !a.auth) return nav('triagem');
        this.setState({ busy: true, msg: '', info: '', err: {} });
        const r = await a.auth.signUp({ email: s.f.email.trim(), senha: s.f.senha, nome: s.f.nome.trim(), nascimento: nasc, cpf: s.f.cpf });
        this.setState({ busy: false, msg: r.error || '', info: r.confirm ? `Enviamos um link de confirmação para ${s.f.email.trim()}. Abra o e-mail para ativar sua conta e começar a triagem.` : '' });
      },
      submitEntrar: async e => {
        e.preventDefault();
        if (s.busy) return;
        if (a.demo || !a.auth) { if (!s.f.email || s.f.senha.length < 8 || a.variant === 'erro' && !s.retry) this.setState({ err: { login: true }, retry: true }); else nav('inicio'); return; }
        this.setState({ busy: true, err: {}, msg: '', info: '' });
        const r = await a.auth.signIn({ email: s.f.email.trim(), senha: s.f.senha });
        this.setState({ busy: false, err: r.error ? { login: true } : {}, msg: r.error || '' });
      },
      esqueci: async () => {
        if (!/.+@.+\..+/.test(s.f.email)) return this.setState({ err: { login: true }, msg: 'Digite seu e-mail acima e toque de novo em "Esqueci minha senha".' });
        if (a.demo || !a.auth) return this.setState({ info: 'No modo demonstração não há envio de e-mail.' });
        const r = await a.auth.reset(s.f.email.trim());
        this.setState(r.error ? { err: { login: true }, msg: r.error } : { err: {}, msg: '', info: `Se existir uma conta com ${s.f.email.trim()}, você vai receber um link para criar uma nova senha.` });
      },
      loginMsg: s.msg || 'E-mail ou senha incorretos.', cadMsg: s.msg, info: s.info, busy: s.busy,
      cadLabel: s.busy ? 'Criando sua conta…' : 'Criar conta e começar a triagem', entrarLabel: s.busy ? 'Entrando…' : 'Entrar',
      docTitle: route === 'privacidade' ? 'Política de Privacidade' : 'Termos de Uso',
      docSecs: TERMOS.map(([h, p], i) => ({ n: i + 1, h, p })),
      goLanding: () => nav('landing'), goCadastro: () => nav('cadastro'), goEntrar: () => nav('entrar'), goTermos: () => nav('termos'), goPriv: () => nav('privacidade'), goMaestro: () => nav('maestro'),
      toggleTheme: a.toggleTheme,
    };
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    return (
      <>
      <div style={{ minHeight: "100%", background: v.t?.bg, color: v.t?.ink, fontFamily: "Urbanist,sans-serif" }}>
        <header style={{ position: "sticky", top: "0", paddingTop: "env(safe-area-inset-top)", zIndex: "20", background: v.t?.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${v.t?.line ?? ''}` }}>
          <div style={{ maxWidth: "1240px", margin: "0 auto", height: "68px", padding: `0 ${v.px ?? ''}`, display: "flex", alignItems: "center", gap: "28px" }}>
            <button onClick={v.goLanding} style={{ display: "flex", alignItems: "center", gap: "9px", border: "0", background: "transparent", color: v.t?.ink, cursor: "pointer", padding: "0" }}>
              <Icon n={"infinity"} s={"28"} c={"#E0C78E"} />
              <span style={{ font: "800 16px Urbanist", letterSpacing: ".22em" }}>
                ETTERNUM
              </span>
            </button>
            <span style={{ flex: "1" }}></span>
            {v.desktop ? (
              <>
                <nav style={{ display: "flex", gap: "28px", font: "600 15px Urbanist" }}>
                  <button onClick={v.toMentes} style={{ border: "0", background: "transparent", color: v.t?.muted, cursor: "pointer", font: "inherit" }}>
                    Mentes
                  </button>
                  <button onClick={v.toComo} style={{ border: "0", background: "transparent", color: v.t?.muted, cursor: "pointer", font: "inherit" }}>
                    Como funciona
                  </button>
                </nav>
              </>
            ) : null}
            <button onClick={v.toggleTheme} aria-label={"Alternar tema"} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "0", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer" }}>
              <Icon n={v.t?.themeIcon} s={"17"} />
            </button>
            <button onClick={v.goEntrar} style={{ height: "44px", padding: "0 6px", border: "0", background: "transparent", color: v.t?.ink, font: "600 15px Urbanist", cursor: "pointer" }}>
              Entrar
            </button>
            <button onClick={v.goCadastro} style={{ height: "44px", padding: "0 20px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 15px Urbanist", cursor: "pointer", transition: "background .2s" }}>
              Começar grátis
            </button>
          </div>
        </header>
        {v.isLanding ? (
          <>
            <div ref={v.topRef}></div>
            <section data-screen-label={"01 Landing"} style={{ maxWidth: "1240px", margin: "0 auto", padding: v.heroPad, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "24px" }}>
              <span style={{ height: "32px", padding: "0 14px", borderRadius: "999px", background: v.t?.pillBg, color: v.t?.pillFg, font: "700 11.5px Urbanist", letterSpacing: ".16em", display: "flex", alignItems: "center" }}>
                ETTERNUM · A INTELIGÊNCIA DAS MEMÓRIAS
              </span>
              <h1 style={{ margin: "0", font: `700 ${v.h1 ?? ''}/1 Urbanist`, letterSpacing: "-.035em", maxWidth: "1000px", textWrap: "balance" }}>
                {"Converse com Grandes Mentes. "}
                <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", letterSpacing: "-.02em", color: v.t?.accentText }}>
                  Cultive sua sabedoria na era da IA.
                </span>
              </h1>
              <p style={{ margin: "0", maxWidth: "640px", font: `500 ${v.lead ?? ''}/1.5 Urbanist`, color: v.t?.muted, textWrap: "pretty" }}>
                Cápsulas interativas de pensadores históricos — e um amigo pessoal eterno que conhece você, ouve sem julgamento e está sempre por perto para aconselhar.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
                <button onClick={v.goCadastro} style={{ height: "56px", padding: "0 30px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 17px Urbanist", cursor: "pointer", transition: "transform .15s,background .2s" }} className="publ-a1">
                  Testar grátis por 14 dias
                </button>
                <button onClick={v.toLista} style={{ height: "56px", padding: "0 28px", borderRadius: "999px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "600 17px Urbanist", cursor: "pointer" }}>
                  Entrar na lista de espera
                </button>
              </div>
            </section>
            <section ref={v.mentesRef} style={{ padding: `0 0 ${v.secGap ?? ''}`, display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ maxWidth: "1240px", width: "100%", margin: "0 auto", padding: `0 ${v.px ?? ''}`, display: "flex", justifyContent: "space-between", alignItems: "end", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ font: "700 13px Urbanist", letterSpacing: ".14em", color: v.t?.accentText }}>
                    AS CÁPSULAS
                  </span>
                  <h2 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                    25 grandes mentes, à sua espera.
                  </h2>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 16px/1.5 Urbanist", color: v.t?.muted }}>
                    <Icon n={"library"} s={"17"} c={v.t?.accentText} />
                    Cada uma alimentada com todos os livros e materiais do seu autor.
                  </span>
                </div>
                {v.desktop ? (
                  <>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={v.carPrev} aria-label={"Anterior"} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer" }}>
                        <Icon n={"chevron-left"} s={"20"} />
                      </button>
                      <button onClick={v.carNext} aria-label={"Próximo"} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "0", background: v.t?.accent, color: v.t?.onAccent, display: "grid", placeItems: "center", cursor: "pointer" }}>
                        <Icon n={"chevron-right"} s={"20"} />
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
              <div ref={v.carRef} style={{ display: "flex", gap: "14px", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", scrollbarWidth: "none", padding: `4px ${v.carPad ?? ''} 8px`, scrollPadding: `0 ${v.carPad ?? ''}` }}>
                {(v.carousel || []).map((m, $index) => (
                  <Fragment key={$index}>
                    <article style={{ flex: "none", width: v.cardW, scrollSnapAlign: "start", borderRadius: "26px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform .3s cubic-bezier(.25,.1,.25,1)" }} className="publ-h2">
                      <div style={{ position: "relative", height: "280px", background: "#1A1510" }}>
                        <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                          <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"rect"} placeholder={m?.name} />
                        </div>
                        <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: `linear-gradient(180deg,rgba(0,0,0,0) 45%,${v.t?.card ?? ''} 100%),radial-gradient(120% 80% at 50% 25%,transparent 55%,rgba(0,0,0,.4))` }}></div>
                        {m?.inspired ? (
                          <>
                            <span title={"Cápsula de um especialista nas ideias desta pessoa — não é uma simulação dela."} style={{ position: "absolute", top: "12px", left: "12px", height: "26px", padding: "0 11px", borderRadius: "999px", background: "rgba(11,11,12,.7)", backdropFilter: "blur(8px)", color: "#E0C78E", font: "700 11px Urbanist", display: "flex", alignItems: "center", gap: "5px" }}>
                              <Icon n={"feather"} s={"12"} />
                              Inspirado em
                            </span>
                          </>
                        ) : null}
                      </div>
                      <div style={{ padding: "0 20px 20px", marginTop: "-22px", position: "relative", display: "flex", flexDirection: "column", gap: "6px", flex: "1" }}>
                        <h3 style={{ margin: "0", font: "700 22px/1.1 Urbanist", letterSpacing: "-.015em" }}>
                          {m?.name}
                        </h3>
                        <span style={{ font: "600 13px Urbanist", color: v.t?.accentText }}>
                          {m?.spec}
                        </span>
                        <p style={{ margin: "6px 0 0", font: "italic 400 17px/1.35 'EB Garamond',serif", color: v.t?.muted, flex: "1" }}>
                          “{m?.quote}”
                        </p>
                        <button onClick={v.goCadastro} style={{ marginTop: "14px", height: "44px", borderRadius: "999px", border: `1px solid ${v.t?.accentLine ?? ''}`, background: "transparent", color: v.t?.accentText, font: "700 14px Urbanist", cursor: "pointer", transition: "background .2s" }}>
                          Acessar esta mente
                        </button>
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
            </section>
            <section style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}` }}>
              <div style={{ display: "grid", gridTemplateColumns: v.cols3, gap: "14px" }}>
                {(v.pilares || []).map((p, $index) => (
                  <Fragment key={$index}>
                    <div style={{ borderRadius: "26px", background: p?.bg, color: "#15130E", padding: "28px", display: "flex", flexDirection: "column", gap: "40px", minHeight: "220px", justifyContent: "space-between" }}>
                      <span style={{ width: "52px", height: "52px", borderRadius: "16px", background: "rgba(21,19,14,.08)", display: "grid", placeItems: "center" }}>
                        <Icon n={p?.icon} s={"24"} />
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "700 22px/1.15 Urbanist", letterSpacing: "-.015em" }}>
                          {p?.title}
                        </span>
                        <span style={{ font: "500 15px/1.5 Urbanist", opacity: ".75" }}>
                          {p?.text}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
            <section style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}` }}>
              <div style={{ borderRadius: "36px", background: v.t?.hero, color: v.t?.heroInk, padding: v.boxPad, display: "grid", gridTemplateColumns: v.cols2, gap: "48px", alignItems: "center", overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div role={"img"} aria-label={"Aurelius, o Maestro"} style={{ width: "112px", height: "112px", borderRadius: "50%", display: "grid", placeItems: "center", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", animation: "etGlow 4s ease-in-out infinite", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></div>
                  <span style={{ font: "700 13px Urbanist", letterSpacing: ".14em", color: "#E0C78E" }}>
                    O MAESTRO · AURELIUS, GUARDIÃO DAS MENTES
                  </span>
                  <h2 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.02 Urbanist`, letterSpacing: "-.03em" }}>
                    {"Seu amigo pessoal "}
                    <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: "#E0C78E" }}>
                      eterno.
                    </span>
                  </h2>
                  <p style={{ margin: "0", font: "500 18px/1.55 Urbanist", color: v.t?.heroMuted, maxWidth: "460px" }}>
                    Ele acolhe, aconselha e lembra de tudo o que você já contou. Quando faz sentido, apresenta você à grande mente ideal para o que está vivendo.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "24px", borderRadius: "28px", background: "rgba(255,255,255,.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}>
                  <div style={{ alignSelf: "flex-end", maxWidth: "85%", padding: "13px 18px", borderRadius: "22px 22px 6px 22px", background: "#E0C78E", color: "#14110A", font: "600 15px/1.45 Urbanist" }}>
                    Estou exausta e sem saber se continuo no meu emprego.
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span role={"img"} aria-label={"Aurelius, o Maestro"} style={{ flex: "none", width: "30px", height: "30px", borderRadius: "50%", background: "#2A2118 url(/portraits/maestro-face.webp) center/cover no-repeat", display: "grid", placeItems: "center", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: "0 0 0 1.5px rgba(224,199,142,.7)" }}></span>
                    <p style={{ margin: "0", font: "500 15px/1.6 Urbanist", color: "#E9E4DA" }}>
                      Ana, obrigado por me contar. Antes de decidir, vamos olhar para o que está te esvaziando. Acho que Viktor Frankl pode te ajudar a reencontrar o seu porquê.
                    </p>
                  </div>
                  <div style={{ marginLeft: "40px", display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px 10px 10px", borderRadius: "20px", background: "rgba(255,255,255,.06)" }}>
                    <div style={{ position: "relative", flex: "none", width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", background: "#2A2118", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                      <ImageSlot id={"mind-frankl"} shape={"circle"} compact placeholder={"VF"} />
                    </div>
                    <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                      <span style={{ font: "700 15px Urbanist" }}>
                        Continuar com Viktor Frankl
                      </span>
                      <span style={{ font: "500 12.5px Urbanist", color: "#A7A197" }}>
                        Sentido da vida · Psicologia
                      </span>
                    </div>
                    <Icon n={"arrow-right"} s={"18"} c={"#E0C78E"} />
                  </div>
                </div>
              </div>
            </section>
            <section data-screen-label={"Landing · Clube do Livro"} style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}`, display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ position: "relative", borderRadius: "40px", background: "radial-gradient(900px 520px at 78% 55%,rgba(224,199,142,.22),transparent 62%),radial-gradient(600px 400px at 0% 100%,rgba(110,43,34,.35),transparent 70%),#0E0E10", color: "#F3EFE6", padding: v.boxPad, display: "grid", gridTemplateColumns: v.cols2, gap: "40px", alignItems: "center", overflow: "hidden" }}>
                <div style={{ position: "relative", zIndex: "2", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <span style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "10px", height: "34px", padding: "0 16px 0 6px", borderRadius: "999px", background: "rgba(224,199,142,.12)", font: "700 12px Urbanist", letterSpacing: ".16em", color: "#E0C78E" }}>
                    <span style={{ height: "24px", padding: "0 10px", borderRadius: "999px", background: "#E0C78E", color: "#14110A", display: "flex", alignItems: "center", letterSpacing: ".08em" }}>
                      NOVO
                    </span>
                    CLUBE DO LIVRO
                  </span>
                  <h2 style={{ margin: "0", font: "400 clamp(44px,5.6vw,76px)/.98 'EB Garamond',serif", letterSpacing: "-.015em", textWrap: "balance" }}>
                    {"Os livros que mudam vidas, "}
                    <span style={{ fontStyle: "italic", color: "#E0C78E" }}>
                      em minutos.
                    </span>
                  </h2>
                  <p style={{ margin: "0", font: "500 18px/1.6 Urbanist", color: "#B9B2A5", maxWidth: "480px", textWrap: "pretty" }}>
                    Resumos com as ideias centrais de cada obra, insights para aplicar no dia a dia e uma leitura do mês para viver em comunidade. Leia com as mesmas mentes com quem você conversa.
                  </p>
                  <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ font: "400 34px/1 'EB Garamond',serif", color: "#F3EFE6" }}>
                        15 min
                      </span>
                      <span style={{ font: "600 12.5px Urbanist", color: "#8A847A" }}>
                        por resumo
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ font: "400 34px/1 'EB Garamond',serif", color: "#F3EFE6" }}>
                        1 livro
                      </span>
                      <span style={{ font: "600 12.5px Urbanist", color: "#8A847A" }}>
                        em destaque por mês
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ font: "400 34px/1 'EB Garamond',serif", color: "#F3EFE6" }}>
                        Destaques
                      </span>
                      <span style={{ font: "600 12.5px Urbanist", color: "#8A847A" }}>
                        e notas salvas
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button onClick={v.goCadastro} style={{ height: "56px", padding: "0 30px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 16px Urbanist", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", boxShadow: "0 18px 40px -16px rgba(224,199,142,.6)", transition: "transform .2s" }} className="publ-h3">
                      Entrar para o clube
                      <Icon n={"arrow-right"} s={"18"} />
                    </button>
                    <button onClick={v.goCadastro} style={{ height: "56px", padding: "0 24px", borderRadius: "999px", border: "0", background: "rgba(255,255,255,.08)", color: "#F3EFE6", font: "600 16px Urbanist", cursor: "pointer" }}>
                      Ver a biblioteca
                    </button>
                  </div>
                </div>
                <div style={{ position: "relative", height: v.clubeStageH, display: "flex", justifyContent: "center", alignItems: "center", perspective: "1400px" }} className="publ-h4">
                  <div style={{ position: "absolute", left: "50%", top: "52%", width: "70%", height: "70%", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(closest-side,rgba(224,199,142,.35),transparent)", filter: "blur(30px)" }}></div>
                  <div style={{ position: "absolute", width: "clamp(130px,15vw,190px)", aspectRatio: "2/3", transform: "translateX(-62%) rotate(-9deg) translateY(16px)", zIndex: "1", transition: "transform .6s cubic-bezier(.2,.8,.2,1)" }}>
                    <img src={"/covers/cartas-a-lucilio.jpg"} alt={"Capa de Cartas a Lucílio, de Sêneca"} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px 10px 10px 4px", boxShadow: "0 50px 70px -28px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.06),inset 0 0 0 1px rgba(255,255,255,.1)" }} />
                    <span style={{ position: "absolute", inset: "0", borderRadius: "4px 10px 10px 4px", background: "linear-gradient(90deg,rgba(0,0,0,.35) 0,rgba(255,255,255,.12) 3%,transparent 7%,transparent 100%)", pointerEvents: "none" }}></span>
                  </div>
                  <div style={{ position: "absolute", width: "clamp(130px,15vw,190px)", aspectRatio: "2/3", transform: "translateX(62%) rotate(9deg) translateY(16px)", zIndex: "1", transition: "transform .6s cubic-bezier(.2,.8,.2,1)" }}>
                    <img src={"/covers/habitos-atomicos.jpg"} alt={"Capa de Hábitos Atômicos, de James Clear"} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px 10px 10px 4px", boxShadow: "0 50px 70px -28px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.06),inset 0 0 0 1px rgba(255,255,255,.1)" }} />
                    <span style={{ position: "absolute", inset: "0", borderRadius: "4px 10px 10px 4px", background: "linear-gradient(90deg,rgba(0,0,0,.35) 0,rgba(255,255,255,.12) 3%,transparent 7%,transparent 100%)", pointerEvents: "none" }}></span>
                  </div>
                  <div style={{ position: "absolute", width: "clamp(160px,19vw,240px)", aspectRatio: "2/3", transform: "translateY(-8px)", zIndex: "3", transition: "transform .6s cubic-bezier(.2,.8,.2,1)" }}>
                    <img src={"/covers/em-busca-de-sentido.webp"} alt={"Capa de Em Busca de Sentido, de Viktor Frankl"} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px 10px 10px 4px", boxShadow: "0 50px 70px -28px rgba(0,0,0,.95),0 0 0 1px rgba(255,255,255,.06),inset 0 0 0 1px rgba(255,255,255,.1)" }} />
                    <span style={{ position: "absolute", inset: "0", borderRadius: "4px 10px 10px 4px", background: "linear-gradient(90deg,rgba(0,0,0,.35) 0,rgba(255,255,255,.12) 3%,transparent 7%,transparent 100%)", pointerEvents: "none" }}></span>
                  </div>
                  <div style={{ position: "absolute", zIndex: "4", top: "6%", right: "2%", display: "flex", alignItems: "center", gap: "8px", height: "38px", padding: "0 14px", borderRadius: "999px", background: "rgba(18,18,20,.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 14px 30px -12px rgba(0,0,0,.8)", font: "700 12.5px Urbanist", color: "#E0C78E" }}>
                    <Icon n={"sparkles"} s={"14"} />
                    Leitura do mês
                  </div>
                  <div style={{ position: "absolute", zIndex: "4", bottom: "2%", left: "0", maxWidth: "280px", padding: "16px 18px", borderRadius: "20px", background: "rgba(18,18,20,.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 24px 50px -18px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "7px", font: "700 11px Urbanist", letterSpacing: ".14em", color: "#8A847A" }}>
                      <Icon n={"highlighter"} s={"13"} c={"#E0C78E"} />
                      SEU DESTAQUE
                    </span>
                    <span style={{ font: "italic 400 17px/1.35 'EB Garamond',serif", color: "#F3EFE6", paddingLeft: "10px", boxShadow: "inset 2px 0 0 #E0C78E" }}>
                      Tudo pode ser tirado de uma pessoa, exceto a escolha da atitude.
                    </span>
                  </div>
                  <div style={{ position: "absolute", zIndex: "4", top: "14%", left: "0", width: "190px", padding: "14px 16px", borderRadius: "18px", background: "rgba(18,18,20,.88)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", boxShadow: "0 24px 50px -18px rgba(0,0,0,.9)", display: "flex", flexDirection: "column", gap: "9px" }}>
                    <span style={{ display: "flex", justifyContent: "space-between", font: "700 12.5px Urbanist", color: "#F3EFE6" }}>
                      Capítulo 2 de 3
                      <span style={{ color: "#E0C78E" }}>
                        66%
                      </span>
                    </span>
                    <span style={{ height: "4px", borderRadius: "2px", background: "#26262A", overflow: "hidden" }}>
                      <span style={{ display: "block", width: "66%", height: "100%", background: "#E0C78E" }}></span>
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.cols3, gap: "14px" }}>
                <div style={{ padding: "28px 4px 0", borderTop: `1px solid ${v.t?.line2 ?? ''}`, display: "flex", flexDirection: "column", gap: "16px" }}>
                  <span style={{ font: "400 40px/1 'EB Garamond',serif", color: v.t?.accentText }}>
                    01
                  </span>
                  <span style={{ font: "700 20px/1.2 Urbanist", letterSpacing: "-.01em" }}>
                    Resumos de 10 a 15 minutos
                  </span>
                  <span style={{ font: "500 15px/1.55 Urbanist", color: v.t?.muted }}>
                    Capítulo a capítulo, com o essencial de cada livro. Toque em um parágrafo para guardar como destaque.
                  </span>
                </div>
                <div style={{ padding: "28px 4px 0", borderTop: `1px solid ${v.t?.line2 ?? ''}`, display: "flex", flexDirection: "column", gap: "16px" }}>
                  <span style={{ font: "400 40px/1 'EB Garamond',serif", color: v.t?.accentText }}>
                    02
                  </span>
                  <span style={{ font: "700 20px/1.2 Urbanist", letterSpacing: "-.01em" }}>
                    Insights para aplicar
                  </span>
                  <span style={{ font: "500 15px/1.55 Urbanist", color: v.t?.muted }}>
                    As ideias mais fortes de cada obra, explicadas de forma direta, prontas para levar para a sua vida.
                  </span>
                </div>
                <div style={{ padding: "28px 4px 0", borderTop: `1px solid ${v.t?.line2 ?? ''}`, display: "flex", flexDirection: "column", gap: "16px" }}>
                  <span style={{ font: "400 40px/1 'EB Garamond',serif", color: v.t?.accentText }}>
                    03
                  </span>
                  <span style={{ font: "700 20px/1.2 Urbanist", letterSpacing: "-.01em" }}>
                    Uma leitura do mês
                  </span>
                  <span style={{ font: "500 15px/1.55 Urbanist", color: v.t?.muted }}>
                    Um livro escolhido para todo o clube, com guia de discussão e materiais de apoio.
                  </span>
                </div>
              </div>
            </section>
            <section ref={v.comoRef} style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}`, display: "grid", gridTemplateColumns: v.comoCols, gap: v.comoGap, alignItems: "start" }}>
              <div style={{ position: v.stickyPos, top: "96px", display: "flex", flexDirection: "column", gap: "22px" }}>
                <span style={{ font: "600 12px Urbanist", letterSpacing: ".32em", color: v.t?.accentText }}>
                  COMO FUNCIONA
                </span>
                <h2 style={{ margin: "0", font: `400 ${v.h2serif ?? ''}/1.02 'EB Garamond',serif`, letterSpacing: "-.01em", textWrap: "balance" }}>
                  {"Quatro passos. "}
                  <em style={{ color: v.t?.accentText }}>
                    No seu tempo.
                  </em>
                </h2>
                <p style={{ margin: "0", maxWidth: "380px", font: "500 17px/1.6 Urbanist", color: v.t?.muted }}>
                  Do primeiro encontro com o Maestro ao conselho de várias mentes, cada etapa respeita o seu ritmo.
                </p>
                {v.desktop ? (
                  <>
                    <div role={"img"} aria-label={"Aurelius, o Maestro"} style={{ marginTop: "12px", width: "300px", aspectRatio: "3/4", borderRadius: "150px 150px 6px 6px", background: "#2A2118 url(/portraits/maestro.webp) 52% 20%/cover no-repeat", filter: "sepia(.2) saturate(.85) contrast(1.05) brightness(.95)", boxShadow: `0 0 0 1px ${v.t?.accentLine ?? ''},0 0 0 8px ${v.t?.bg ?? ''},0 0 0 9px ${v.t?.line ?? ''}` }}></div>
                    <span style={{ font: "italic 400 16px 'EB Garamond',serif", color: v.t?.faint }}>
                      Aurelius, Guardião das Mentes
                    </span>
                  </>
                ) : null}
              </div>
              <ol style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", borderTop: `1px solid ${v.t?.line2 ?? ''}` }}>
                {(v.passos || []).map((p, $index) => (
                  <Fragment key={$index}>
                    <li style={{ display: "grid", gridTemplateColumns: v.stepCols, gap: v.stepGap, padding: v.stepPad, borderBottom: `1px solid ${v.t?.line2 ?? ''}`, alignItems: "baseline" }}>
                      <span style={{ font: `italic 400 ${v.romanSize ?? ''}/1 'EB Garamond',serif`, color: v.t?.accentText }}>
                        {p?.roman}
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <span style={{ font: `400 ${v.stepTitle ?? ''}/1.1 'EB Garamond',serif`, letterSpacing: "-.005em" }}>
                          {p?.title}
                        </span>
                        <span style={{ maxWidth: "460px", font: "500 16px/1.6 Urbanist", color: v.t?.muted }}>
                          {p?.text}
                        </span>
                      </div>
                    </li>
                  </Fragment>
                ))}
              </ol>
            </section>
            <section style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}`, display: "flex", flexDirection: "column", gap: v.areasGap }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", color: v.t?.accentText }}>
                  <span style={{ width: "56px", height: "1px", background: v.t?.accentLine }}></span>
                  <Icon n={"infinity"} s={"18"} />
                  <span style={{ width: "56px", height: "1px", background: v.t?.accentLine }}></span>
                </div>
                <span style={{ font: "600 12px Urbanist", letterSpacing: ".32em", color: v.t?.accentText }}>
                  TODAS AS ÁREAS DA VIDA
                </span>
                <h2 style={{ margin: "0", font: `400 ${v.h2serif ?? ''}/1.02 'EB Garamond',serif`, letterSpacing: "-.01em" }}>
                  {"Do luto "}
                  <em style={{ color: v.t?.accentText }}>
                    aos negócios.
                  </em>
                </h2>
                <p style={{ margin: "0", maxWidth: "520px", font: "500 17px/1.6 Urbanist", color: v.t?.muted }}>
                  Dez salas de um mesmo museu. Em cada uma, as mentes que mais pensaram sobre aquele tema da vida.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.cols2, columnGap: "72px", borderTop: `1px solid ${v.t?.line2 ?? ''}` }}>
                {(v.areas || []).map((a, $index) => (
                  <Fragment key={$index}>
                    <button onClick={v.goCadastro} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: "18px", alignItems: "center", padding: "24px 4px", border: "0", borderBottom: `1px solid ${v.t?.line2 ?? ''}`, background: "transparent", color: v.t?.ink, textAlign: "left", cursor: "pointer", transition: "padding .35s cubic-bezier(.25,.1,.25,1),background .35s" }} className="publ-h5">
                      <span style={{ width: "44px", height: "44px", borderRadius: "50%", boxShadow: `inset 0 0 0 1px ${a?.ring ?? ''}`, display: "grid", placeItems: "center" }}>
                        <Icon n={a?.icon} s={"19"} c={a?.color} />
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                        <span style={{ font: "italic 400 15px/1 'EB Garamond',serif", color: v.t?.faint }}>
                          {a?.roman}
                        </span>
                        <span style={{ font: `400 ${v.areaName ?? ''}/1.15 'EB Garamond',serif`, textWrap: "balance" }}>
                          {a?.name}
                        </span>
                        <span style={{ font: "500 14px/1.5 Urbanist", color: v.t?.muted }}>
                          {a?.phrase}
                        </span>
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flex: "none" }}>
                        <span style={{ font: "400 26px/1 'EB Garamond',serif", color: v.t?.accentText }}>
                          {a?.n}
                        </span>
                        <span style={{ font: "600 10.5px Urbanist", letterSpacing: ".16em", color: v.t?.faint }}>
                          MENTES
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </section>
            <section style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}`, display: "flex", flexDirection: "column", gap: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", textAlign: "center" }}>
                <span style={{ font: "700 13px Urbanist", letterSpacing: ".14em", color: v.t?.accentText }}>
                  PLANOS
                </span>
                <h2 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                  Comece com 14 dias de tudo.
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: v.cols2, gap: "14px", maxWidth: "920px", width: "100%", margin: "0 auto" }}>
                <div style={{ borderRadius: "30px", background: v.t?.card, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <span style={{ font: "700 14px Urbanist", color: v.t?.muted }}>
                    Teste grátis
                  </span>
                  <span style={{ font: "800 44px/1 Urbanist", letterSpacing: "-.03em" }}>
                    14 dias
                  </span>
                  <span style={{ font: "500 15px/1.5 Urbanist", color: v.t?.muted }}>
                    Acesso completo a todas as mentes, ao Maestro e ao Conselho.
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", font: "500 15px Urbanist" }}>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"check"} s={"17"} c={v.t?.accentText} />
                      Tudo liberado durante o teste
                    </span>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"check"} s={"17"} c={v.t?.accentText} />
                      Depois: plano Gratuito com 1 cápsula
                    </span>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"check"} s={"17"} c={v.t?.accentText} />
                      e 5 mensagens por dia
                    </span>
                  </div>
                  <div style={{ flex: "1" }}></div>
                  <button onClick={v.goCadastro} style={{ height: "52px", borderRadius: "999px", border: "0", background: v.t?.card3, color: v.t?.ink, font: "700 16px Urbanist", cursor: "pointer" }}>
                    Testar grátis por 14 dias
                  </button>
                </div>
                <div style={{ borderRadius: "30px", background: v.t?.hero, color: v.t?.heroInk, boxShadow: "inset 0 0 0 1px rgba(224,199,142,.4)", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ font: "700 14px Urbanist", color: "#E0C78E" }}>
                      Premium
                    </span>
                    <Icon n={"crown"} s={"20"} c={"#E0C78E"} />
                  </div>
                  <span style={{ font: "800 44px/1 Urbanist", letterSpacing: "-.03em" }}>
                    Ilimitado
                  </span>
                  <span style={{ font: "500 15px/1.5 Urbanist", color: v.t?.heroMuted }}>
                    Para quem quer ter as grandes mentes sempre por perto.
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", font: "500 15px Urbanist" }}>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"check"} s={"17"} c={"#E0C78E"} />
                      Todas as mentes, sem limite
                    </span>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"check"} s={"17"} c={"#E0C78E"} />
                      Conselho com até 4 mentes
                    </span>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"check"} s={"17"} c={"#E0C78E"} />
                      Memória completa
                    </span>
                    <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <Icon n={"clock"} s={"17"} c={"#E0C78E"} />
                      Em breve: Cápsula de Memória Viva
                    </span>
                  </div>
                  <button onClick={v.goCadastro} style={{ height: "52px", borderRadius: "999px", border: "0", background: "#E0C78E", color: "#14110A", font: "700 16px Urbanist", cursor: "pointer" }}>
                    Começar grátis
                  </button>
                </div>
              </div>
            </section>
            <section style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}` }}>
              <div style={{ display: "grid", gridTemplateColumns: v.cols2, gap: "48px", alignItems: "center" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
                  {(v.sobreMinds || []).map((m, $index) => (
                    <Fragment key={$index}>
                      <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "20px", overflow: "hidden", background: "#1A1510", marginTop: m?.offset }}>
                        <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                          <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"rect"} placeholder={m?.name} />
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <span style={{ font: "700 13px Urbanist", letterSpacing: ".14em", color: v.t?.accentText }}>
                    SOBRE O ETTERNUM
                  </span>
                  <h2 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                    {"Um "}
                    <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                      museu emocional
                    </span>
                    {" vivo."}
                  </h2>
                  <p style={{ margin: "0", font: "500 17px/1.6 Urbanist", color: v.t?.muted }}>
                    Reunimos as ideias de quem pensou profundamente sobre a vida para que elas voltem a conversar com a gente, no nosso tempo e na nossa língua.
                  </p>
                  <p style={{ margin: "0", font: "500 17px/1.6 Urbanist", color: v.t?.muted }}>
                    Em breve, as Cápsulas de Memória Viva vão permitir eternizar a sua própria história, ou a de alguém que você ama.
                  </p>
                </div>
              </div>
            </section>
            <section style={{ padding: `0 0 ${v.secGap ?? ''}`, display: "flex", flexDirection: "column", gap: "40px" }}>
              <div style={{ maxWidth: "1240px", width: "100%", margin: "0 auto", padding: `0 ${v.px ?? ''}`, display: "grid", gridTemplateColumns: v.cols2, gap: "28px", alignItems: "end" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <span style={{ font: "600 12px Urbanist", letterSpacing: ".32em", color: v.t?.accentText }}>
                    HISTÓRIAS REAIS
                  </span>
                  <h2 style={{ margin: "0", font: `400 ${v.h2serif ?? ''}/1.04 'EB Garamond',serif`, letterSpacing: "-.01em", textWrap: "balance" }}>
                    {"Calma, clareza "}
                    <em style={{ color: v.t?.accentText }}>
                      e sentido
                    </em>
                    , uma conversa de cada vez.
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "18px", justifySelf: v.testiJustify, maxWidth: "380px" }}>
                  <p style={{ margin: "0", font: "500 17px/1.6 Urbanist", color: v.t?.muted }}>
                    O que dizem as pessoas que já atravessaram uma fase difícil com o Maestro e as grandes mentes.
                  </p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button onClick={v.goCadastro} style={{ height: "46px", padding: "0 22px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 15px Urbanist", cursor: "pointer" }}>
                      Começar grátis
                    </button>
                    {v.desktop ? (
                      <>
                        <button onClick={v.tPrev} aria-label={"Anterior"} style={{ width: "46px", height: "46px", borderRadius: "50%", border: "0", background: "transparent", boxShadow: `inset 0 0 0 1px ${v.t?.line2 ?? ''}`, color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer" }}>
                          <Icon n={"arrow-left"} s={"18"} />
                        </button>
                        <button onClick={v.tNext} aria-label={"Próximo"} style={{ width: "46px", height: "46px", borderRadius: "50%", border: "0", background: "transparent", boxShadow: `inset 0 0 0 1px ${v.t?.line2 ?? ''}`, color: v.t?.ink, display: "grid", placeItems: "center", cursor: "pointer" }}>
                          <Icon n={"arrow-right"} s={"18"} />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div ref={v.testiRef} style={{ display: "flex", gap: "16px", overflowX: "auto", scrollSnapType: "x mandatory", scrollBehavior: "smooth", scrollbarWidth: "none", padding: `4px ${v.carPad ?? ''} 8px`, scrollPadding: `0 ${v.carPad ?? ''}` }}>
                {(v.depoimentos || []).map((d, $index) => (
                  <Fragment key={$index}>
                    <figure style={{ flex: "none", width: v.testiW, minHeight: "380px", margin: "0", scrollSnapAlign: "start", borderRadius: "28px", background: d?.bg, boxShadow: d?.ring, color: d?.fg, padding: "30px 28px 26px", display: "flex", flexDirection: "column", gap: "22px" }}>
                      <span style={{ font: "400 72px/.6 'EB Garamond',serif", color: d?.mark, height: "30px" }}>
                        “
                      </span>
                      <blockquote style={{ margin: "0", flex: "1", font: "400 21px/1.45 'EB Garamond',serif", textWrap: "pretty" }}>
                        {d?.text}
                      </blockquote>
                      <figcaption style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "18px", borderTop: `1px solid ${d?.line ?? ''}` }}>
                        <span style={{ flex: "none", width: "42px", height: "42px", borderRadius: "50%", background: d?.avBg, color: "#15130E", display: "grid", placeItems: "center", font: "700 14px Urbanist" }}>
                          {d?.ini}
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                          <span style={{ font: "700 15px Urbanist" }}>
                            {d?.name}
                          </span>
                          <span style={{ font: "500 13px Urbanist", color: d?.sub }}>
                            {d?.meta}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  </Fragment>
                ))}
              </div>
            </section>
            <section style={{ maxWidth: "880px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}`, display: "flex", flexDirection: "column", gap: "44px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
                <h2 style={{ margin: "0", font: `600 ${v.faqH ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                  Ainda com dúvidas sobre como funciona?
                </h2>
                <span style={{ font: `italic 400 ${v.faqH2 ?? ''}/1.1 'EB Garamond',serif`, color: v.t?.accentText }}>
                  A gente explica.
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(v.faq || []).map((q, $index) => (
                  <Fragment key={$index}>
                    <div style={{ borderRadius: "20px", background: q?.bg, boxShadow: `inset 0 0 0 1px ${q?.ring ?? ''}`, transition: "background .3s,box-shadow .3s" }}>
                      <button onClick={q?.toggle} aria-expanded={q?.open} style={{ width: "100%", minHeight: "64px", padding: "16px 22px", border: "0", background: "transparent", color: v.t?.ink, font: "600 16.5px/1.4 Urbanist", textAlign: "left", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" }}>
                        <span style={{ flex: "1" }}>
                          {q?.q}
                        </span>
                        <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", boxShadow: `inset 0 0 0 1px ${v.t?.line2 ?? ''}`, display: "grid", placeItems: "center", transform: `rotate(${q?.rot ?? ''})`, transition: "transform .3s cubic-bezier(.25,.1,.25,1)" }}>
                          <Icon n={"chevron-down"} s={"16"} c={v.t?.accentText} />
                        </span>
                      </button>
                      <div style={{ display: "grid", gridTemplateRows: q?.rows, transition: "grid-template-rows .35s cubic-bezier(.25,.1,.25,1)" }}>
                        <div style={{ overflow: "hidden" }}>
                          <p style={{ margin: "0", padding: "0 70px 22px 22px", font: "500 15.5px/1.65 Urbanist", color: v.t?.muted, textWrap: "pretty" }}>
                            {q?.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
            <section ref={v.listaRef} style={{ maxWidth: "1240px", margin: "0 auto", padding: `0 ${v.px ?? ''} ${v.secGap ?? ''}` }}>
              <div style={{ borderRadius: "36px", background: v.t?.pastel0, color: "#15130E", padding: v.boxPad, display: "grid", gridTemplateColumns: v.cols2, gap: "40px", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h2 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.02 Urbanist`, letterSpacing: "-.03em" }}>
                    Entre para nossa lista de espera.
                  </h2>
                  <p style={{ margin: "0", font: "500 18px/1.5 Urbanist", opacity: ".75" }}>
                    Seja um dos primeiros a explorar o poder transformador das cápsulas de IA.
                  </p>
                </div>
                {v.waitDone ? (
                  <>
                    <div style={{ borderRadius: "24px", background: "rgba(21,19,14,.08)", padding: "28px", display: "flex", gap: "14px", alignItems: "center", animation: "etIn .4s both" }}>
                      <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#15130E", color: "#E0C78E", display: "grid", placeItems: "center" }}>
                        <Icon n={"check"} s={"22"} />
                      </span>
                      <span style={{ font: "700 19px/1.3 Urbanist" }}>
                        Pronto! Você está na lista de espera do Etternum.
                      </span>
                    </div>
                  </>
                ) : null}
                {v.waitForm ? (
                  <>
                    <form onSubmit={v.submitWait} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <input required placeholder={"Nome"} style={{ height: "56px", padding: "0 22px", borderRadius: "999px", border: "0", background: "rgba(255,255,255,.6)", color: "#15130E", font: "500 16px Urbanist", outline: "none" }} className="publ-f6" />
                      <input required type={"email"} placeholder={"E-mail"} style={{ height: "56px", padding: "0 22px", borderRadius: "999px", border: "0", background: "rgba(255,255,255,.6)", color: "#15130E", font: "500 16px Urbanist", outline: "none" }} className="publ-f7" />
                      <button type={"submit"} style={{ height: "56px", borderRadius: "999px", border: "0", background: "#15130E", color: "#F3EFE6", font: "700 16px Urbanist", cursor: "pointer" }}>
                        Entrar na lista de espera
                      </button>
                    </form>
                  </>
                ) : null}
              </div>
            </section>
          </>
        ) : null}
        {v.isAuth ? (
          <>
            <section data-screen-label={"02 Cadastro / 03 Entrar"} style={{ maxWidth: "1240px", margin: "0 auto", padding: v.authPad, display: "grid", gridTemplateColumns: v.cols2, gap: "40px", alignItems: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "28px", maxWidth: "480px", width: "100%", margin: "0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h1 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                    {v.authTitle}
                  </h1>
                  <p style={{ margin: "0", font: "500 17px/1.5 Urbanist", color: v.t?.muted }}>
                    {v.authSub}
                  </p>
                </div>
                {v.isCadastro ? (
                  <>
                    <form onSubmit={v.submitCadastro} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "600 14px Urbanist" }}>
                          Nome
                        </span>
                        <input value={v.f?.nome ?? ''} onChange={v.on?.nome} placeholder={"Seu nome"} style={{ height: "56px", padding: "0 20px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none" }} className="publ-f8" />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "600 14px Urbanist" }}>
                          E-mail
                        </span>
                        <input type={"email"} value={v.f?.email ?? ''} onChange={v.on?.email} placeholder={"voce@exemplo.com"} style={{ height: "56px", padding: "0 20px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none" }} className="publ-f9" />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "600 14px Urbanist" }}>
                          Senha
                        </span>
                        <div style={{ position: "relative", display: "flex" }}>
                          <input type={v.pwType} value={v.f?.senha ?? ''} onChange={v.on?.senha} style={{ flex: "1", minWidth: "0", height: "56px", padding: "0 56px 0 20px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none" }} className="publ-f10" />
                          <button type={"button"} onClick={v.togglePw} aria-label={"Mostrar senha"} style={{ position: "absolute", right: "6px", top: "6px", width: "44px", height: "44px", border: "0", background: "transparent", color: v.t?.muted, display: "grid", placeItems: "center", cursor: "pointer" }}>
                            <Icon n={v.pwIcon} s={"19"} />
                          </button>
                        </div>
                        <span style={{ font: "500 13px Urbanist", color: v.t?.faint }}>
                          Pelo menos 8 caracteres.
                        </span>
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "600 14px Urbanist" }}>
                          CPF
                        </span>
                        <input value={v.f?.cpf ?? ''} onChange={v.on?.cpf} inputMode={"numeric"} placeholder={"000.000.000-00"} style={{ height: "56px", padding: "0 20px", borderRadius: "18px", border: "0", background: v.cpfBg, boxShadow: `inset 0 0 0 ${v.cpfRingW ?? ''} ${v.cpfRing ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none", fontVariantNumeric: "tabular-nums" }} />
                        {v.err?.cpf ? (
                          <>
                            <span style={{ display: "flex", gap: "6px", alignItems: "center", font: "600 13px Urbanist", color: v.t?.danger }}>
                              <Icon n={"circle-alert"} s={"14"} />
                              CPF inválido. Confira os números.
                            </span>
                          </>
                        ) : null}
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <label style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                            <span style={{ font: "600 14px Urbanist" }}>
                              Data de nascimento
                            </span>
                            <input value={v.f?.nasc ?? ''} onChange={v.on?.nasc} inputMode={"numeric"} placeholder={"dd/mm/aaaa"} style={{ minWidth: "0", height: "56px", padding: "0 18px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none", fontVariantNumeric: "tabular-nums" }} className="publ-f11" />
                          </label>
                          <label style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
                            <span style={{ font: "600 14px Urbanist" }}>
                              Signo
                            </span>
                            <div style={{ height: "56px", padding: "0 18px", borderRadius: "18px", background: v.t?.accentSoft, boxShadow: `inset 0 0 0 1px ${v.t?.accentLine ?? ''}`, font: "600 16px Urbanist", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                              <span>
                                <span style={{ fontFamily: "'EB Garamond',serif", color: v.t?.accentText }}>
                                  {v.signo?.sym}︎
                                </span>
                                {" "}{v.signo?.name}
                              </span>
                              <Icon n={"chevron-down"} s={"16"} c={v.t?.muted} />
                            </div>
                          </label>
                        </div>
                        <span style={{ font: "500 13px Urbanist", color: v.t?.faint }}>
                          O signo é preenchido pela data de nascimento; ajuste se preferir.
                        </span>
                      </div>
                      <button type={"button"} onClick={v.toggleTermos} style={{ display: "flex", gap: "14px", alignItems: "flex-start", textAlign: "left", border: "0", background: "transparent", padding: "0", cursor: "pointer", color: v.t?.muted, font: "500 14px/1.55 Urbanist" }}>
                        <span style={{ flex: "none", width: "24px", height: "24px", marginTop: "1px", borderRadius: "8px", background: v.chkBg, boxShadow: `inset 0 0 0 ${v.chkRingW ?? ''} ${v.chkRing ?? ''}`, color: "#14110A", display: "grid", placeItems: "center", transition: "background .2s" }}>
                          {v.f?.termos ? (
                            <>
                              <Icon n={"check"} s={"15"} />
                            </>
                          ) : null}
                        </span>
                        <span>
                          {"Tenho 18 anos ou mais, li e aceito os "}
                          <span style={{ color: v.t?.ink, textDecoration: "underline" }}>
                            Termos de Uso
                          </span>
                          {" e a "}
                          <span style={{ color: v.t?.ink, textDecoration: "underline" }}>
                            Política de Privacidade
                          </span>
                          , e autorizo o tratamento dos meus dados — inclusive informações sobre meu bem-estar emocional — para personalizar minhas conversas.
                        </span>
                      </button>
                      {v.err?.termos ? (
                        <>
                          <span style={{ marginTop: "-8px", paddingLeft: "38px", font: "600 13px Urbanist", color: v.t?.danger }}>
                            Para continuar, aceite os termos e a política de privacidade.
                          </span>
                        </>
                      ) : null}
                      {v.cadMsg ? <Aviso t={v.t} kind="erro">{v.cadMsg}</Aviso> : null}
                      {v.info ? <Aviso t={v.t} kind="info">{v.info}</Aviso> : null}
                      <button type={"submit"} disabled={v.busy} style={{ height: "58px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 17px Urbanist", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "background .2s" }}>
                        {v.cadLabel}
                        <Icon n={"arrow-right"} s={"18"} />
                      </button>
                      <button type={"button"} onClick={v.goEntrar} style={{ border: "0", background: "transparent", color: v.t?.muted, font: "500 15px Urbanist", cursor: "pointer" }}>
                        {"Já tem conta? "}
                        <span style={{ color: v.t?.accentText, fontWeight: "700" }}>
                          Entrar
                        </span>
                      </button>
                    </form>
                  </>
                ) : null}
                {v.isEntrar ? (
                  <>
                    <form onSubmit={v.submitEntrar} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      <button type={"button"} disabled style={{ height: "56px", borderRadius: "999px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.faint, font: "600 15px Urbanist", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "not-allowed" }}>
                        <span style={{ font: "800 17px Urbanist" }}>
                          G
                        </span>
                        Entrar com Google · em breve
                      </button>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: v.t?.faint, font: "500 13px Urbanist" }}>
                        <span style={{ flex: "1", height: "1px", background: v.t?.line }}></span>
                        ou
                        <span style={{ flex: "1", height: "1px", background: v.t?.line }}></span>
                      </div>
                      {v.err?.login ? (
                        <>
                          <div role={"alert"} style={{ padding: "14px 18px", borderRadius: "16px", background: v.t?.dangerBg, color: v.t?.dangerInk, font: "600 14px Urbanist", display: "flex", gap: "10px", alignItems: "center" }}>
                            <Icon n={"circle-alert"} s={"17"} />
                            {v.loginMsg}
                          </div>
                        </>
                      ) : null}
                      {v.info ? <Aviso t={v.t} kind="info">{v.info}</Aviso> : null}
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <span style={{ font: "600 14px Urbanist" }}>
                          E-mail
                        </span>
                        <input type={"email"} value={v.f?.email ?? ''} onChange={v.on?.email} placeholder={"voce@exemplo.com"} style={{ height: "56px", padding: "0 20px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none" }} className="publ-f12" />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ font: "600 14px Urbanist" }}>
                            Senha
                          </span>
                          <button type="button" onClick={v.esqueci} style={{ border: 0, padding: 0, background: 'transparent', font: "600 13px Urbanist", color: v.t?.faint, cursor: 'pointer' }}>
                            Esqueci minha senha
                          </button>
                        </div>
                        <input type={"password"} value={v.f?.senha ?? ''} onChange={v.on?.senha} style={{ height: "56px", padding: "0 20px", borderRadius: "18px", border: "0", background: v.t?.card2, boxShadow: `inset 0 0 0 1px ${v.t?.line ?? ''}`, color: v.t?.ink, font: "500 16px Urbanist", outline: "none" }} className="publ-f13" />
                      </label>
                      <button type={"submit"} style={{ height: "58px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 17px Urbanist", cursor: "pointer" }}>
                        {v.entrarLabel}
                      </button>
                      <button type={"button"} onClick={v.goCadastro} style={{ border: "0", background: "transparent", color: v.t?.muted, font: "500 15px Urbanist", cursor: "pointer" }}>
                        {"Ainda não tem conta? "}
                        <span style={{ color: v.t?.accentText, fontWeight: "700" }}>
                          Cadastre-se grátis
                        </span>
                      </button>
                    </form>
                  </>
                ) : null}
              </div>
              {v.desktop ? (
                <>
                  <div style={{ position: "relative", borderRadius: "36px", overflow: "hidden", background: v.t?.hero, minHeight: "680px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "40px" }}>
                    <div style={{ position: "absolute", inset: "24px 24px 200px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
                      {(v.sobreMinds || []).map((m, $index) => (
                        <Fragment key={$index}>
                          <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", background: "#1A1510", marginTop: m?.offset }}>
                            <div style={{ position: "absolute", inset: "0", filter: "grayscale(1) sepia(.38) contrast(1.08) brightness(.88)" }}>
                              <ImageSlot id={`mind-${m?.slug ?? ''}`} shape={"rect"} placeholder={m?.name} />
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: "linear-gradient(180deg,transparent 40%,rgba(11,11,12,.95) 75%)" }}></div>
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "12px", pointerEvents: "none" }}>
                      <span style={{ font: "italic 400 30px/1.25 'EB Garamond',serif", color: "#F3EFE6" }}>
                        “Quem tem um porquê enfrenta qualquer como.”
                      </span>
                      <span style={{ font: "600 14px Urbanist", color: "#E0C78E" }}>
                        Viktor Frankl · uma das 61 mentes do Etternum
                      </span>
                    </div>
                  </div>
                </>
              ) : null}
            </section>
          </>
        ) : null}
        {v.isTermos ? (
          <>
            <article data-screen-label={"15 Termos"} style={{ maxWidth: "720px", margin: "0 auto", padding: v.authPad, display: "flex", flexDirection: "column", gap: "28px" }}>
              <div style={{ padding: "14px 18px", borderRadius: "16px", background: v.t?.accentSoft, boxShadow: `inset 0 0 0 1px ${v.t?.accentLine ?? ''}`, color: v.t?.accentText, font: "700 14px Urbanist", display: "flex", gap: "10px", alignItems: "center" }}>
                <Icon n={"file-warning"} s={"17"} />
                Rascunho — revisão jurídica pendente
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ font: "600 14px Urbanist", color: v.t?.faint }}>
                  Atualizado em 4 de outubro de 2026
                </span>
                <h1 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                  {v.docTitle}
                </h1>
              </div>
              <nav style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(v.docSecs || []).map((d, $index) => (
                  <Fragment key={$index}>
                    <span style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: v.t?.card2, color: v.t?.muted, font: "600 13px Urbanist", display: "flex", alignItems: "center" }}>
                      {d?.n}{". "}{d?.h}
                    </span>
                  </Fragment>
                ))}
              </nav>
              {(v.docSecs || []).map((d, $index) => (
                <Fragment key={$index}>
                  <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <h2 style={{ margin: "0", font: "700 22px/1.25 Urbanist" }}>
                      {d?.n}{". "}{d?.h}
                    </h2>
                    <p style={{ margin: "0", font: "500 17px/1.75 Urbanist", color: v.t?.muted, textWrap: "pretty" }}>
                      {d?.p}
                    </p>
                  </section>
                </Fragment>
              ))}
            </article>
          </>
        ) : null}
        {v.is404 ? (
          <>
            <section data-screen-label={"16 404"} style={{ minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "20px", padding: `40px ${v.px ?? ''}` }}>
              <span style={{ font: "800 clamp(120px,22vw,240px)/.85 Urbanist", letterSpacing: "-.06em", color: v.t?.card3 }}>
                404
              </span>
              <h1 style={{ margin: "0", font: `700 ${v.h2 ?? ''}/1.05 Urbanist`, letterSpacing: "-.03em" }}>
                {"Esta página se perdeu "}
                <span style={{ fontFamily: "'EB Garamond',serif", fontStyle: "italic", fontWeight: "400", color: v.t?.accentText }}>
                  no tempo.
                </span>
              </h1>
              <p style={{ margin: "0", font: "500 17px/1.5 Urbanist", color: v.t?.muted, maxWidth: "420px" }}>
                O endereço pode ter mudado. O Maestro continua aqui, se quiser conversar.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={v.goLanding} style={{ height: "52px", padding: "0 26px", borderRadius: "999px", border: "0", background: v.t?.accent, color: v.t?.onAccent, font: "700 16px Urbanist", cursor: "pointer" }}>
                  Voltar ao início
                </button>
                <button onClick={v.goMaestro} style={{ height: "52px", padding: "0 26px", borderRadius: "999px", border: "0", background: v.t?.card2, color: v.t?.ink, font: "600 16px Urbanist", cursor: "pointer" }}>
                  Falar com o Maestro
                </button>
              </div>
            </section>
          </>
        ) : null}
        <footer style={{ borderTop: `1px solid ${v.t?.line ?? ''}` }}>
          <div style={{ maxWidth: "1240px", margin: "0 auto", padding: `40px ${v.px ?? ''} 48px`, display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <Icon n={"infinity"} s={"24"} c={"#E0C78E"} />
                <span style={{ font: "800 14px Urbanist", letterSpacing: ".22em" }}>
                  ETTERNUM
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", font: "600 14px Urbanist", color: v.t?.muted }}>
                <button onClick={v.goLanding} style={{ border: "0", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" }}>
                  Sobre o Etternum
                </button>
                <span style={{ color: v.t?.faint }}>
                  |
                </span>
                <button onClick={v.goTermos} style={{ border: "0", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" }}>
                  Termos de Uso
                </button>
                <span style={{ color: v.t?.faint }}>
                  |
                </span>
                <button onClick={v.goPriv} style={{ border: "0", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" }}>
                  Política de Privacidade
                </button>
              </div>
            </div>
            <p style={{ margin: "0", font: "500 13px/1.6 Urbanist", color: v.t?.faint, maxWidth: "860px" }}>
              O Etternum não substitui psicólogos, médicos ou outros profissionais. As cápsulas são recriações feitas por inteligência artificial a partir de ideias públicas e não representam as pessoas reais. Em crise, ligue 188 (CVV, 24 horas, gratuito).
            </p>
            <span style={{ font: "500 13px Urbanist", color: v.t?.faint }}>
              © 2026 Etternum. Todos os direitos reservados.
            </span>
          </div>
        </footer>
      </div>
      </>
    );
  }
}
