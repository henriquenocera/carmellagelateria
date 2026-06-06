-- Adicionar nova coluna com status e observacao de revisao
ALTER TABLE public.producao_realizada 
ADD COLUMN IF NOT EXISTS status_revisao VARCHAR(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS revisao_observacao TEXT;
