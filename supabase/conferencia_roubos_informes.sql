-- ==============================================================================
-- SCRIPT SQL: Tabela "Conferência Roubos - Informes de Qntd Atual"
-- Salva a quantidade atual informada por item + data respectiva (+ loja)
-- Executar no Editor SQL do Supabase
-- ==============================================================================

-- 1. Criação da tabela
CREATE TABLE IF NOT EXISTS public.conferencia_roubos_informes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  item_id TEXT NOT NULL REFERENCES public.conferencia_roubos_itens(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  loja TEXT NOT NULL DEFAULT 'Alto da XV',
  qntd TEXT NOT NULL,
  created_by TEXT
);

-- 2. Índices para consulta por item/data/loja
CREATE INDEX IF NOT EXISTS idx_conferencia_roubos_informes_item_id ON public.conferencia_roubos_informes(item_id);
CREATE INDEX IF NOT EXISTS idx_conferencia_roubos_informes_data ON public.conferencia_roubos_informes(data);
CREATE INDEX IF NOT EXISTS idx_conferencia_roubos_informes_loja ON public.conferencia_roubos_informes(loja);

-- 3. Habilitar RLS
ALTER TABLE public.conferencia_roubos_informes ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura conferencia_roubos_informes" ON public.conferencia_roubos_informes;
DROP POLICY IF EXISTS "Permitir inserção conferencia_roubos_informes" ON public.conferencia_roubos_informes;
DROP POLICY IF EXISTS "Permitir atualização conferencia_roubos_informes" ON public.conferencia_roubos_informes;
DROP POLICY IF EXISTS "Permitir deleção conferencia_roubos_informes" ON public.conferencia_roubos_informes;

-- 5. Políticas abertas (controle admin feito no app)
CREATE POLICY "Permitir leitura conferencia_roubos_informes" ON public.conferencia_roubos_informes FOR SELECT USING (true);
CREATE POLICY "Permitir inserção conferencia_roubos_informes" ON public.conferencia_roubos_informes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização conferencia_roubos_informes" ON public.conferencia_roubos_informes FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção conferencia_roubos_informes" ON public.conferencia_roubos_informes FOR DELETE USING (true);

-- 6. Permissões
GRANT ALL ON TABLE public.conferencia_roubos_informes TO anon, authenticated, service_role;
