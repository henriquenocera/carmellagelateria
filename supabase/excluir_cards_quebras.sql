BEGIN;

WITH deletados_ahu AS (
  DELETE FROM public.cardsahu
  WHERE status = 'quebras'
  RETURNING 'cardsahu'::TEXT AS tabela
),
deletados_altoxv AS (
  DELETE FROM public.cardsaltoxv
  WHERE status = 'quebras'
  RETURNING 'cardsaltoxv'::TEXT AS tabela
)
SELECT tabela, COUNT(*) AS registros_excluidos
FROM (
  SELECT tabela FROM deletados_ahu
  UNION ALL
  SELECT tabela FROM deletados_altoxv
) AS exclusoes
GROUP BY tabela
ORDER BY tabela;

COMMIT;
