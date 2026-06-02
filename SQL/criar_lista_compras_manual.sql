-- Script para criar a tabela de lista de compras manual
CREATE TABLE IF NOT EXISTS public.lista_compras_manual (
    id SERIAL PRIMARY KEY,
    insumo_id UUID REFERENCES public.cadastro_insumos(id) ON DELETE CASCADE,
    quantidade NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa RLS (Row Level Security) caso deseje restringir acesso depois (opcional mas boa prática no supabase)
ALTER TABLE public.lista_compras_manual ENABLE ROW LEVEL SECURITY;

-- Cria política que permite a leitura e edição por qualquer um autenticado
CREATE POLICY "Permitir acesso total na lista_compras_manual" ON public.lista_compras_manual
    FOR ALL 
    TO public
    USING (true)
    WITH CHECK (true);
