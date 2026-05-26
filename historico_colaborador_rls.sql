-- Script SQL para configurar o RLS na tabela "historico_colaborador"
-- Execute no SQL Editor do seu Supabase para liberar o acesso de leitura/escrita:

-- =========================================================================
-- OPÇÃO 1 (Recomendada): Desativar RLS para esta tabela (Assim como em Checklist, Vales, etc.)
-- =========================================================================
ALTER TABLE public.historico_colaborador DISABLE ROW LEVEL SECURITY;

-- =========================================================================
-- OPÇÃO 2: Se preferir manter RLS ativado, execute as políticas de acesso abaixo:
-- =========================================================================
/*
ALTER TABLE public.historico_colaborador ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read historico_colaborador" ON public.historico_colaborador;
CREATE POLICY "Allow read historico_colaborador" ON public.historico_colaborador FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert historico_colaborador" ON public.historico_colaborador;
CREATE POLICY "Allow insert historico_colaborador" ON public.historico_colaborador FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update historico_colaborador" ON public.historico_colaborador;
CREATE POLICY "Allow update historico_colaborador" ON public.historico_colaborador FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete historico_colaborador" ON public.historico_colaborador;
CREATE POLICY "Allow delete historico_colaborador" ON public.historico_colaborador FOR DELETE TO anon, authenticated USING (true);
*/
