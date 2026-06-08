CREATE TABLE IF NOT EXISTS public.produtos_vale (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurando segurança (RLS - Row Level Security)
ALTER TABLE public.produtos_vale ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (Leitura pública, escrita para quem está autenticado)
CREATE POLICY "Permitir leitura de produtos_vale" ON public.produtos_vale FOR SELECT USING (true);
CREATE POLICY "Permitir inserção em produtos_vale" ON public.produtos_vale FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Permitir atualização em produtos_vale" ON public.produtos_vale FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Permitir deleção em produtos_vale" ON public.produtos_vale FOR DELETE USING (auth.role() = 'authenticated');
