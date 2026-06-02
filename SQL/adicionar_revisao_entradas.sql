-- Adiciona a coluna 'needs_review' para permitir que admins marquem compras para revisão
ALTER TABLE public.entradas_mercadoria 
ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT false;
