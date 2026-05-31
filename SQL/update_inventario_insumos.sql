-- Adicionar coluna user_id na tabela inventario_insumos se ela ainda não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inventario_insumos' AND column_name='user_id') THEN
        ALTER TABLE public.inventario_insumos ADD COLUMN user_id UUID REFERENCES public.profiles(id);
    END IF;
END $$;
