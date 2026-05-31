-- Adicionar coluna updated_at na tabela inventario_insumos se ela ainda não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventario_insumos' AND column_name='updated_at') THEN
        ALTER TABLE public.inventario_insumos ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;
