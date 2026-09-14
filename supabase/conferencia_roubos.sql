-- ==============================================================================
-- SCRIPT SQL: Tabela "Conferência Roubos - Itens Cadastrados"
-- Salva os itens do formulário: Nome + mapeamentos (Vendas/Vales/Entradas)
-- + dados da conferência (6 colunas): Último Informe, Vendas, Vales, Entradas, Previsto, Qntd Real
-- Executar no Editor SQL do Supabase
-- ==============================================================================

-- 1. Criação da tabela
CREATE TABLE IF NOT EXISTS public.conferencia_roubos_itens (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  nome TEXT NOT NULL,
  mapeamentos JSONB DEFAULT '[]'::jsonb,
  mapeamentos_vales JSONB DEFAULT '[]'::jsonb,
  mapeamentos_entradas JSONB DEFAULT '[]'::jsonb,
  ultimo_informe TEXT,
  vendas TEXT,
  vales TEXT,
  entradas TEXT,
  previsto TEXT,
  qntd_real TEXT,
  created_by TEXT
);

-- 2. Garantir colunas se a tabela já existia parcialmente
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='nome') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN nome TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='mapeamentos') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN mapeamentos JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='mapeamentos_vales') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN mapeamentos_vales JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='mapeamentos_entradas') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN mapeamentos_entradas JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='ultimo_informe') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN ultimo_informe TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='vendas') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN vendas TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='vales') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN vales TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='entradas') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN entradas TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='previsto') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN previsto TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='qntd_real') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN qntd_real TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conferencia_roubos_itens' AND column_name='created_by') THEN
    ALTER TABLE public.conferencia_roubos_itens ADD COLUMN created_by TEXT;
  END IF;
END $$;

-- 3. Habilitar RLS
ALTER TABLE public.conferencia_roubos_itens ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura conferencia_roubos_itens" ON public.conferencia_roubos_itens;
DROP POLICY IF EXISTS "Permitir inserção conferencia_roubos_itens" ON public.conferencia_roubos_itens;
DROP POLICY IF EXISTS "Permitir atualização conferencia_roubos_itens" ON public.conferencia_roubos_itens;
DROP POLICY IF EXISTS "Permitir deleção conferencia_roubos_itens" ON public.conferencia_roubos_itens;

-- 5. Políticas abertas (ajuste para admin-only se necessário via app)
CREATE POLICY "Permitir leitura conferencia_roubos_itens" ON public.conferencia_roubos_itens FOR SELECT USING (true);
CREATE POLICY "Permitir inserção conferencia_roubos_itens" ON public.conferencia_roubos_itens FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização conferencia_roubos_itens" ON public.conferencia_roubos_itens FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção conferencia_roubos_itens" ON public.conferencia_roubos_itens FOR DELETE USING (true);

-- 6. Permissões
GRANT ALL ON TABLE public.conferencia_roubos_itens TO anon, authenticated, service_role;
