-- Execute no SQL Editor do Supabase antes de importar o relatório vendas-data.
-- NULL indica que a quantidade do dia ainda não foi importada.
ALTER TABLE public.conciliacao_vendas
  ADD COLUMN IF NOT EXISTS qntd_total_vendas integer
  CHECK (qntd_total_vendas >= 0);
