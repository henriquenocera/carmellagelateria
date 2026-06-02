-- Adicionar nova coluna com status e observacao de revisao
ALTER TABLE public.entradas_mercadoria 
ADD COLUMN IF NOT EXISTS status_revisao VARCHAR(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS revisao_observacao TEXT;

-- Migrar o que estava como true em needs_review para 'pending_user'
UPDATE public.entradas_mercadoria 
SET status_revisao = 'pending_user' 
WHERE needs_review = true;

-- Remover a coluna antiga
ALTER TABLE public.entradas_mercadoria 
DROP COLUMN IF EXISTS needs_review;
