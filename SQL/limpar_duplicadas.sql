DELETE FROM public.movimentacoes_estoque a
USING public.movimentacoes_estoque b
WHERE a.ctid < b.ctid
  AND a.insumo_id = b.insumo_id
  AND a.data_movimentacao = b.data_movimentacao
  AND a.quantidade = b.quantidade
  AND a.origem = b.origem
  AND a.destino = b.destino;
