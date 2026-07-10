-- Adiciona colunas para conversão de estoque na tabela cadastro_insumos
ALTER TABLE cadastro_insumos 
ADD COLUMN IF NOT EXISTS estoque_nome TEXT,
ADD COLUMN IF NOT EXISTS estoque_unidade TEXT,
ADD COLUMN IF NOT EXISTS estoque_quantidade NUMERIC;
