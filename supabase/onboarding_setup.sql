-- ============================================================================
-- Carmella Gelateria - Onboarding
-- Script de correção da persistência das tarefas concluídas.
--
-- COMO USAR:
--   1. Abra o painel do Supabase do projeto.
--   2. Vá em "SQL Editor" > "New query".
--   3. Cole todo este arquivo e clique em "Run".
--
-- Pode ser executado mais de uma vez: não duplica dados.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Coluna que registra quem concluiu a tarefa (usada pelo front-end)
-- ----------------------------------------------------------------------------
alter table public.onboarding_completions
  add column if not exists completed_by_name text;

-- ----------------------------------------------------------------------------
-- 2. Garante uma única linha por colaborador + tópico.
--    É isso que faz o upsert com onConflict: "profile_id,topic_id" funcionar.
-- ----------------------------------------------------------------------------
delete from public.onboarding_completions a
using public.onboarding_completions b
where a.ctid < b.ctid
  and a.profile_id = b.profile_id
  and a.topic_id = b.topic_id;

create unique index if not exists onboarding_completions_profile_topic_uidx
  on public.onboarding_completions (profile_id, topic_id);

-- ----------------------------------------------------------------------------
-- 3. Categorias do onboarding
--    (os mesmos IDs usados pelo fallback local do front-end)
-- ----------------------------------------------------------------------------
insert into public.onboarding_categories (id, name, type, ordem) values
  (1, '1. Boas-Vindas & Cultura Carmella',      'checklist', 0),
  (2, '2. Documentação & Cadastro no RH',       'checklist', 1),
  (3, '3. Sistemas, PDV & Equipamentos',        'checklist', 2),
  (4, '4. Treinamento de Produtos & Gelatos',   'checklist', 3),
  (5, '5. Padrões de Qualidade & Higiene',      'checklist', 4),
  (6, 'Instruções Gerais de Atendimento',       'text',      5)
on conflict (id) do update
  set name  = excluded.name,
      type  = excluded.type,
      ordem = excluded.ordem;

-- ----------------------------------------------------------------------------
-- 4. Tópicos/tarefas do onboarding
-- ----------------------------------------------------------------------------
insert into public.onboarding_topics (id, category_id, title, ordem) values
  -- Categoria 1
  (101, 1, 'Apresentação da equipe e tour pela loja', 0),
  (102, 1, 'Leitura do Regulamento Interno da empresa', 1),
  (103, 1, 'Apresentação dos valores e padrão de atendimento Carmella', 2),

  -- Categoria 2
  (201, 2, 'Entrega de cópia dos documentos pessoais ao RH', 0),
  (202, 2, 'Assinatura do contrato de trabalho e ficha de registro', 1),
  (203, 2, 'Cadastro da biometria / registro de ponto', 2),

  -- Categoria 3
  (301, 3, 'Treinamento básico de uso do sistema PDV e caixa', 0),
  (302, 3, 'Operação da máquina de café espresso e moedor', 1),
  (303, 3, 'Procedimentos de abertura e fechamento da vitrine de gelatos', 2),

  -- Categoria 4
  (401, 4, 'Degustação técnica e memorização dos sabores de gelato', 0),
  (402, 4, 'Treinamento de montagem de waffles, brownies e sobremesas', 1),
  (403, 4, 'Padrão de porcionamento e peso das casquinhas/copos', 2),

  -- Categoria 5
  (501, 5, 'Treinamento de higienização de mãos e uso de uniformes', 0),
  (502, 5, 'Higienização de utensílios, cubas e mesas', 1),
  (503, 5, 'Conferência de temperatura das geladeiras e vitrine (-12°C a -15°C)', 2),

  -- Categoria 6 (texto)
  (601, 6, 'Sempre receba nossos clientes com um sorriso, ofereça amostras de gelatos com cortesia e mantenha a bancada limpa e organizada em todos os momentos.', 0)
on conflict (id) do update
  set category_id = excluded.category_id,
      title       = excluded.title,
      ordem       = excluded.ordem;

-- ----------------------------------------------------------------------------
-- 5. Ajusta as sequences após inserir IDs explícitos
-- ----------------------------------------------------------------------------
do $$
declare
  seq_name text;
begin
  seq_name := pg_get_serial_sequence('public.onboarding_categories', 'id');
  if seq_name is not null then
    perform setval(
      seq_name,
      greatest((select coalesce(max(id), 1) from public.onboarding_categories), 1),
      true
    );
  end if;

  seq_name := pg_get_serial_sequence('public.onboarding_topics', 'id');
  if seq_name is not null then
    perform setval(
      seq_name,
      greatest((select coalesce(max(id), 1) from public.onboarding_topics), 1),
      true
    );
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 6. RLS e permissões
--    Leitura: qualquer usuário autenticado.
--    Escrita nas conclusões: apenas admin ou líder (mesma regra da tela).
-- ----------------------------------------------------------------------------
alter table public.onboarding_categories  enable row level security;
alter table public.onboarding_topics      enable row level security;
alter table public.onboarding_completions enable row level security;

create or replace function public.can_manage_onboarding()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and (coalesce(is_admin, false) or coalesce(is_lider, false))
  );
$$;

grant execute on function public.can_manage_onboarding() to authenticated;

-- Categorias (leitura)
drop policy if exists onboarding_categories_select on public.onboarding_categories;
create policy onboarding_categories_select
  on public.onboarding_categories
  for select to authenticated
  using (true);

-- Tópicos (leitura)
drop policy if exists onboarding_topics_select on public.onboarding_topics;
create policy onboarding_topics_select
  on public.onboarding_topics
  for select to authenticated
  using (true);

-- Conclusões (leitura para todos os autenticados)
drop policy if exists onboarding_completions_select on public.onboarding_completions;
create policy onboarding_completions_select
  on public.onboarding_completions
  for select to authenticated
  using (true);

-- Conclusões (escrita somente admin/líder)
drop policy if exists onboarding_completions_insert on public.onboarding_completions;
create policy onboarding_completions_insert
  on public.onboarding_completions
  for insert to authenticated
  with check (public.can_manage_onboarding());

drop policy if exists onboarding_completions_update on public.onboarding_completions;
create policy onboarding_completions_update
  on public.onboarding_completions
  for update to authenticated
  using (public.can_manage_onboarding())
  with check (public.can_manage_onboarding());

drop policy if exists onboarding_completions_delete on public.onboarding_completions;
create policy onboarding_completions_delete
  on public.onboarding_completions
  for delete to authenticated
  using (public.can_manage_onboarding());

-- ----------------------------------------------------------------------------
-- 7. Conferência final
-- ----------------------------------------------------------------------------
select
  (select count(*) from public.onboarding_categories)  as categorias,
  (select count(*) from public.onboarding_topics)      as topicos,
  (select count(*) from public.onboarding_completions) as conclusoes;
