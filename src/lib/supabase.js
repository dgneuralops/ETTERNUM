// Supabase: contas, perfil, conversas e Clube do Livro.
// Com VITE_DEMO=1 o app roda em modo demonstração, sem Supabase.
import { createClient } from '@supabase/supabase-js';
import { signOf } from './signo.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const URL_ = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = URL_ && ANON && import.meta.env.VITE_DEMO !== '1'
  ? createClient(URL_, ANON, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

export const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

// Linha de `profiles` + e-mail -> o objeto `user` que as telas usam.
export function toUser(profile, email) {
  const nome = (profile?.nome || '').trim() || (email || '').split('@')[0];
  const partes = nome.split(/\s+/).filter(Boolean);
  const nasc = profile?.nascimento ? new Date(profile.nascimento + 'T12:00:00') : null;
  const [sym, signo] = nasc ? signOf(nasc.getDate(), nasc.getMonth() + 1) : ['', ''];
  const desde = profile?.created_at ? new Date(profile.created_at) : new Date();
  const idade = nasc ? Math.floor((Date.now() - nasc) / 3.15576e10) : null;
  const trialAte = profile?.trial_ate ? new Date(profile.trial_ate) : null;
  const plano = profile?.plano === 'trial' && trialAte && trialAte < new Date() ? 'free' : profile?.plano || 'trial';
  return {
    id: profile?.id, email, nome, primeiro: partes[0] || 'você',
    iniciais: (partes[0]?.[0] || '') + (partes.length > 1 ? partes[partes.length - 1][0] : ''),
    signoSym: sym, signo, nascimento: nasc ? nasc.toLocaleDateString('pt-BR') : '',
    idade, cpf: profile?.cpf ? profile.cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/, '***.$2.$3-**') : '',
    membroDesde: `${desde.getDate()} de ${MESES[desde.getMonth()]}`,
    plano, trialAte, diasTrial: trialAte ? Math.max(0, Math.ceil((trialAte - Date.now()) / 864e5)) : 14,
    capsula: profile?.capsula || 'seneca',
    favoritos: profile?.favoritos || [], triagem: profile?.triagem || null, recomendadas: profile?.recomendadas || [],
  };
}

// Perfil enviado ao modelo: nome, signo e triagem. Nunca CPF nem e-mail.
export function profileForAi(user) {
  if (!user) return '';
  const linhas = [`Nome: ${user.nome} (chame de ${user.primeiro}).`];
  if (user.signo) linhas.push(`Signo: ${user.signo}.`);
  if (user.idade) linhas.push(`Idade: ${user.idade} anos.`);
  for (const [k, v] of Object.entries(user.triagem || {})) linhas.push(`${k} ${Array.isArray(v) ? v.join(', ') : v}`);
  return linhas.join('\n');
}

export async function loadProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, patch) {
  const { error } = await supabase.from('profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

// ---- Conversas ----
export async function listConversas(filtro = {}) {
  let q = supabase.from('conversas').select('id,tipo,slug,titulo,updated_at').order('updated_at', { ascending: false }).limit(50);
  if (filtro.tipo) q = q.eq('tipo', filtro.tipo);
  if (filtro.slug) q = q.eq('slug', filtro.slug);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function loadMensagens(conversaId) {
  const { data, error } = await supabase.from('mensagens').select('role,content,meta').eq('conversa_id', conversaId).order('id');
  if (error) throw error;
  return data || [];
}

export async function createConversa(tipo, slug, titulo) {
  const { data, error } = await supabase.from('conversas').insert({ tipo, slug, titulo: titulo.slice(0, 120) }).select('id').single();
  if (error) throw error;
  return data.id;
}

export async function addMensagem(conversaId, role, content, meta) {
  const { error } = await supabase.from('mensagens').insert({ conversa_id: conversaId, role, content, meta: meta || null });
  if (error) throw error;
}

export async function deleteConversa(id) {
  const { error } = await supabase.from('conversas').delete().eq('id', id);
  if (error) throw error;
}

export async function apagarHistorico() {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('conversas').delete().eq('user_id', user.id);
  if (error) throw error;
}

// "Ontem, 22:14" / "30 set, 23:02"
export function quando(iso) {
  const d = new Date(iso), hoje = new Date();
  const hh = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dias = Math.floor((new Date(hoje.toDateString()) - new Date(d.toDateString())) / 864e5);
  if (dias === 0) return `Hoje, ${hh}`;
  if (dias === 1) return `Ontem, ${hh}`;
  return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}, ${hh}`;
}

// ---- Erros do Supabase Auth em português ----
export function authErro(e) {
  const m = (e && (e.message || e.error_description)) || '';
  if (/Invalid login credentials/i.test(m)) return 'E-mail ou senha incorretos.';
  if (/Email not confirmed/i.test(m)) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (/already registered|already been registered/i.test(m)) return 'Já existe uma conta com este e-mail. Tente entrar.';
  if (/Password should be at least/i.test(m)) return 'A senha precisa ter pelo menos 8 caracteres.';
  if (/rate limit|too many/i.test(m)) return 'Muitas tentativas. Aguarde um minuto e tente de novo.';
  if (/valid email|invalid.*email/i.test(m)) return 'Confira o e-mail digitado.';
  return 'Não foi possível concluir agora. Tente de novo em instantes.';
}
