-- Adicionar nova coluna para custo unitário
ALTER TABLE public.cadastro_insumos ADD COLUMN custo_considerado_unitario NUMERIC;

-- Atualizar valores existentes automaticamente para evitar inconsistências
UPDATE public.cadastro_insumos 
SET custo_considerado_unitario = custo_considerado / quantidade_conversao 
WHERE quantidade_conversao IS NOT NULL 
  AND quantidade_conversao > 0 
  AND custo_considerado IS NOT NULL;
