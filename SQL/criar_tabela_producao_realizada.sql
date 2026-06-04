-- Script para criar a tabela producao_realizada
DROP TABLE IF EXISTS public.producao_realizada;

CREATE TABLE public.producao_realizada (
    id SERIAL PRIMARY KEY,
    produto_id UUID REFERENCES public.cadastro_produtos(id) ON DELETE CASCADE,
    data_producao DATE NOT NULL,
    quantidade NUMERIC NOT NULL DEFAULT 0,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativa RLS (Row Level Security)
ALTER TABLE public.producao_realizada ENABLE ROW LEVEL SECURITY;

-- Cria política que permite a leitura e edição por qualquer um autenticado
CREATE POLICY "Permitir acesso total na producao_realizada" ON public.producao_realizada
    FOR ALL 
    TO public
    USING (true)
    WITH CHECK (true);
