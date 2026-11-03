alter table public.ordem_producao
  add column if not exists insumos_enviados boolean not null default false,
  add column if not exists ordem_informada boolean not null default false;
