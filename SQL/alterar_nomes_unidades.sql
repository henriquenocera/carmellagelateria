BEGIN;

-- Atualizando Estoque MH
UPDATE public.movimentacoes_estoque
SET origem = 'Estoque MH'
WHERE origem = 'Estoque - MH';

UPDATE public.movimentacoes_estoque
SET destino = 'Estoque MH'
WHERE destino = 'Estoque - MH';

-- Atualizando Loja Ahú
UPDATE public.movimentacoes_estoque
SET origem = 'Loja Ahú'
WHERE origem = 'Unidade - Ahú';

UPDATE public.movimentacoes_estoque
SET destino = 'Loja Ahú'
WHERE destino = 'Unidade - Ahú';

-- Atualizando Loja Alto XV
UPDATE public.movimentacoes_estoque
SET origem = 'Loja Alto XV'
WHERE origem = 'Unidade - Alto da XV';

UPDATE public.movimentacoes_estoque
SET destino = 'Loja Alto XV'
WHERE destino = 'Unidade - Alto da XV';

COMMIT;
