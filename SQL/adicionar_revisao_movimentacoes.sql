-- Adiciona a coluna 'needs_review' para permitir que admins marquem movimentacoes de estoque para revisão
ALTER TABLE public.movimentacoes_estoque 
ADD COLUMN IF NOT EXISTS needs_review BOOLEAN DEFAULT false;
