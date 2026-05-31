ALTER TABLE public.movimentacoes_estoque
ADD COLUMN user_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid();

-- Atualizar Entradas de Mercadoria (opcional, se quiser rastrear lá também futuramente)
ALTER TABLE public.entradas_mercadoria
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) DEFAULT auth.uid();
