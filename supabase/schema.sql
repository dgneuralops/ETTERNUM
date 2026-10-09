-- Etternum — banco no Supabase.
-- Como usar: painel do Supabase → SQL Editor → New query → cole este arquivo inteiro → Run.
-- Pode rodar de novo sem problema (é idempotente).
-- Segurança: Row Level Security em todas as tabelas — cada pessoa só lê e altera os próprios dados.

-- ============ PERFIS ============
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  nome text not null default '',
  nascimento date,
  cpf text,
  plano text not null default 'trial' check (plano in ('trial', 'free', 'premium')),
  trial_ate timestamptz not null default now() + interval '14 days',
  capsula text not null default 'seneca',
  favoritos text[] not null default '{}',
  triagem jsonb,
  recomendadas text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "perfil: dono lê" on public.profiles;
create policy "perfil: dono lê" on public.profiles for select using (auth.uid() = id);
drop policy if exists "perfil: dono altera" on public.profiles;
create policy "perfil: dono altera" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- O plano só muda pelo servidor (pagamento), nunca pelo app.
create or replace function public.protege_plano() returns trigger language plpgsql as $$
begin
  if new.plano is distinct from old.plano and coalesce(auth.role(), '') <> 'service_role' then
    new.plano := old.plano;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists protege_plano on public.profiles;
create trigger protege_plano before update on public.profiles for each row execute function public.protege_plano();

-- Cria o perfil no cadastro, com os dados enviados pelo app.
create or replace function public.novo_usuario() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, nascimento, cpf)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', ''),
    nullif(new.raw_user_meta_data->>'nascimento', '')::date,
    nullif(new.raw_user_meta_data->>'cpf', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists novo_usuario on auth.users;
create trigger novo_usuario after insert on auth.users for each row execute function public.novo_usuario();

-- ============ CONVERSAS ============
create table if not exists public.conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  tipo text not null check (tipo in ('maestro', 'mente', 'conselho')),
  slug text not null,
  titulo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists conversas_user on public.conversas (user_id, updated_at desc);
alter table public.conversas enable row level security;
drop policy if exists "conversas: dono" on public.conversas;
create policy "conversas: dono" on public.conversas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.mensagens (
  id bigint generated always as identity primary key,
  conversa_id uuid not null references public.conversas on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index if not exists mensagens_conversa on public.mensagens (conversa_id, id);
alter table public.mensagens enable row level security;
drop policy if exists "mensagens: dono" on public.mensagens;
create policy "mensagens: dono" on public.mensagens for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Toda mensagem nova sobe a conversa para o topo da lista.
create or replace function public.toca_conversa() returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.conversas set updated_at = now() where id = new.conversa_id;
  return new;
end $$;
drop trigger if exists toca_conversa on public.mensagens;
create trigger toca_conversa after insert on public.mensagens for each row execute function public.toca_conversa();

-- ============ CLUBE DO LIVRO ============
create table if not exists public.admins (user_id uuid primary key references auth.users on delete cascade);
alter table public.admins enable row level security;
drop policy if exists "admins: própria linha" on public.admins;
create policy "admins: própria linha" on public.admins for select using (auth.uid() = user_id);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table if not exists public.livros (
  id text primary key,
  dados jsonb not null,
  status text not null default 'rascunho' check (status in ('rascunho', 'publicado')),
  ordem int not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.livros enable row level security;
drop policy if exists "livros: leitura" on public.livros;
create policy "livros: leitura" on public.livros for select using (status = 'publicado' or public.is_admin());
drop policy if exists "livros: admin escreve" on public.livros;
create policy "livros: admin escreve" on public.livros for all using (public.is_admin()) with check (public.is_admin());

-- Capas e materiais: leitura pública, escrita só de admin.
insert into storage.buckets (id, name, public) values ('clube', 'clube', true) on conflict (id) do nothing;
drop policy if exists "clube: leitura" on storage.objects;
create policy "clube: leitura" on storage.objects for select using (bucket_id = 'clube');
drop policy if exists "clube: admin envia" on storage.objects;
create policy "clube: admin envia" on storage.objects for insert with check (bucket_id = 'clube' and public.is_admin());
drop policy if exists "clube: admin altera" on storage.objects;
create policy "clube: admin altera" on storage.objects for update using (bucket_id = 'clube' and public.is_admin());
drop policy if exists "clube: admin apaga" on storage.objects;
create policy "clube: admin apaga" on storage.objects for delete using (bucket_id = 'clube' and public.is_admin());

-- ============ EXCLUIR CONTA ============
-- A própria pessoa apaga a conta; perfil, conversas e mensagens vão junto (on delete cascade).
create or replace function public.excluir_conta() returns void language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.excluir_conta() from public, anon;
grant execute on function public.excluir_conta() to authenticated;

-- ============ TORNAR ALGUÉM ADMIN ============
-- Depois de criar sua conta no app, rode (trocando o e-mail):
--   insert into public.admins (user_id) select id from auth.users where email = 'seu@email.com';
