-- Adicionar novas colunas para o fluxo de revisão
ALTER TABLE public.movimentacoes_estoque 
ADD COLUMN IF NOT EXISTS status_revisao VARCHAR(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS revisao_observacao TEXT;

-- Tentar migrar dados se a coluna antiga existir (pode falhar silenciosamente se não existir na view do Supabase, o que não tem problema, mas tentamos assim mesmo se houver como)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'movimentacoes_estoque' AND column_name = 'needs_review') THEN
    EXECUTE 'UPDATE public.movimentacoes_estoque SET status_revisao = ''pending_user'' WHERE needs_review = true';
    EXECUTE 'ALTER TABLE public.movimentacoes_estoque DROP COLUMN needs_review';
  END IF;
END $$;
