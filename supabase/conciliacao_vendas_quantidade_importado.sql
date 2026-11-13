-- Execute após conciliacao_vendas_quantidade.sql.
-- Identifica a origem da quantidade para exibir a nuvem verde na tabela.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'conciliacao_vendas'
      AND column_name = 'qntd_total_vendas_importado'
  ) THEN
    ALTER TABLE public.conciliacao_vendas
      ADD COLUMN qntd_total_vendas_importado boolean NOT NULL DEFAULT false;

    -- Antes da edição manual, as quantidades existentes só podiam vir do CSV.
    UPDATE public.conciliacao_vendas
      SET qntd_total_vendas_importado = true
      WHERE qntd_total_vendas IS NOT NULL;
  END IF;
END $$;
