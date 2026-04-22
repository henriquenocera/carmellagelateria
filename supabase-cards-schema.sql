create extension if not exists "pgcrypto";

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null check (status in ('freezer-estoque', 'vitrine-atual', 'cubas-saidas-vitrine')),
  production_date date not null,
  entry_date date null,
  exit_date date null,
  created_by text not null default 'A definir',
  last_edited_by text not null default 'A definir',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.cards enable row level security;

create policy if not exists "Allow read cards"
  on public.cards for select
  to anon, authenticated
  using (true);

create policy if not exists "Allow insert cards"
  on public.cards for insert
  to anon, authenticated
  with check (true);

create policy if not exists "Allow update cards"
  on public.cards for update
  to anon, authenticated
  using (true)
  with check (true);
