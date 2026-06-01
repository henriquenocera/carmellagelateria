BEGIN;

DELETE FROM public.movimentacoes_estoque
WHERE user_id IS NULL;

COMMIT;
