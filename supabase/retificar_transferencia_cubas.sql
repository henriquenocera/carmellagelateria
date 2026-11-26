-- Execute no banco antes de usar a retificação de transferências no aplicativo.
-- Depois execute novamente supabase/concluir_transferencia_cubas.sql, para que as
-- próximas transferências gravem em cada card qual cuba o originou.

-- Vínculo direto entre o card da loja e a cuba da produção.
ALTER TABLE public.cardsahu
  ADD COLUMN IF NOT EXISTS producao_realizada_id BIGINT
  REFERENCES public.producao_realizada(id) ON DELETE SET NULL;

ALTER TABLE public.cardsaltoxv
  ADD COLUMN IF NOT EXISTS producao_realizada_id BIGINT
  REFERENCES public.producao_realizada(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS cardsahu_producao_realizada_id_idx
  ON public.cardsahu (producao_realizada_id);

CREATE INDEX IF NOT EXISTS cardsaltoxv_producao_realizada_id_idx
  ON public.cardsaltoxv (producao_realizada_id);

-- Retira cubas de uma transferência já concluída:
--   * apaga o card correspondente do estoque da loja;
--   * devolve a cuba ao estado inicial na produção (sem entrada, destino ou transferência);
--   * remove a cuba da lista da transferência (cancelando-a se não sobrar nenhuma).
CREATE OR REPLACE FUNCTION public.retificar_transferencia_cubas(p_transferencia_id bigint, p_cubas_ids bigint[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer public.transferencias_cubas%ROWTYPE;
  v_cuba public.producao_realizada%ROWTYPE;
  v_product_name text;
  v_card_id uuid;
  v_remaining bigint[];
  v_count integer := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'É necessário estar autenticado.';
  END IF;

  SELECT * INTO v_transfer FROM public.transferencias_cubas
  WHERE id = p_transferencia_id FOR UPDATE;
  IF NOT FOUND OR v_transfer.status <> 'Concluída' THEN
    RAISE EXCEPTION 'Só é possível retificar transferências concluídas.';
  END IF;
  IF v_transfer.destino NOT IN ('Loja Ahu', 'Loja Alto XV') THEN
    RAISE EXCEPTION 'O destino desta transferência não é uma loja válida.';
  END IF;
  IF p_cubas_ids IS NULL OR cardinality(p_cubas_ids) = 0
     OR array_position(p_cubas_ids, NULL) IS NOT NULL
     OR (SELECT count(DISTINCT cuba_id) FROM unnest(p_cubas_ids) AS ids(cuba_id)) <> cardinality(p_cubas_ids) THEN
    RAISE EXCEPTION 'Selecione ao menos uma cuba, sem repetições.';
  END IF;
  IF NOT p_cubas_ids <@ coalesce(v_transfer.cubas_ids, '{}'::bigint[]) THEN
    RAISE EXCEPTION 'Há cubas que não pertencem a esta transferência.';
  END IF;

  FOR v_cuba IN SELECT * FROM public.producao_realizada
    WHERE id = ANY(p_cubas_ids) ORDER BY id FOR UPDATE
  LOOP
    IF v_cuba.transferencia_cubas_id IS DISTINCT FROM p_transferencia_id THEN
      RAISE EXCEPTION 'A cuba % não está vinculada a esta transferência.', coalesce(v_cuba.codigo, v_cuba.id::text);
    END IF;

    SELECT nome INTO v_product_name FROM public.cadastro_produtos WHERE id = v_cuba.produto_id;

    -- Procura o card desta cuba: primeiro pelo vínculo direto; depois, para
    -- transferências antigas, pelo mesmo sabor e data de produção nesta transferência.
    v_card_id := NULL;
    IF v_transfer.destino = 'Loja Ahu' THEN
      SELECT id INTO v_card_id FROM public.cardsahu
      WHERE transferencia_cubas_id = p_transferencia_id AND producao_realizada_id = v_cuba.id
      LIMIT 1 FOR UPDATE;
      IF v_card_id IS NULL THEN
        SELECT id INTO v_card_id FROM public.cardsahu
        WHERE transferencia_cubas_id = p_transferencia_id AND producao_realizada_id IS NULL
          AND title = v_product_name AND production_date IS NOT DISTINCT FROM v_cuba.data_producao
        ORDER BY (status = 'freezer-estoque') DESC, id
        LIMIT 1 FOR UPDATE;
      END IF;
      IF v_card_id IS NULL THEN
        RAISE EXCEPTION 'A cuba % não foi encontrada no estoque da Loja Ahu (pode já ter sido removida).', coalesce(v_cuba.codigo, v_product_name);
      END IF;
      DELETE FROM public.cardsahu WHERE id = v_card_id;
    ELSE
      SELECT id INTO v_card_id FROM public.cardsaltoxv
      WHERE transferencia_cubas_id = p_transferencia_id AND producao_realizada_id = v_cuba.id
      LIMIT 1 FOR UPDATE;
      IF v_card_id IS NULL THEN
        SELECT id INTO v_card_id FROM public.cardsaltoxv
        WHERE transferencia_cubas_id = p_transferencia_id AND producao_realizada_id IS NULL
          AND title = v_product_name AND production_date IS NOT DISTINCT FROM v_cuba.data_producao
        ORDER BY (status = 'freezer-estoque') DESC, id
        LIMIT 1 FOR UPDATE;
      END IF;
      IF v_card_id IS NULL THEN
        RAISE EXCEPTION 'A cuba % não foi encontrada no estoque da Loja Alto XV (pode já ter sido removida).', coalesce(v_cuba.codigo, v_product_name);
      END IF;
      DELETE FROM public.cardsaltoxv WHERE id = v_card_id;
    END IF;

    UPDATE public.producao_realizada
    SET data_entrada = NULL, destino = NULL, transferencia_cubas_id = NULL
    WHERE id = v_cuba.id;
    v_count := v_count + 1;
  END LOOP;
  IF v_count <> cardinality(p_cubas_ids) THEN
    RAISE EXCEPTION 'Uma ou mais cubas não foram encontradas.';
  END IF;

  SELECT coalesce(array_agg(cuba_id ORDER BY ord), '{}'::bigint[]) INTO v_remaining
  FROM unnest(v_transfer.cubas_ids) WITH ORDINALITY AS ids(cuba_id, ord)
  WHERE cuba_id <> ALL(p_cubas_ids);

  UPDATE public.transferencias_cubas
  SET cubas_ids = v_remaining,
      status = CASE WHEN cardinality(v_remaining) = 0 THEN 'Cancelada' ELSE status END
  WHERE id = p_transferencia_id;
END;
$$;

REVOKE ALL ON FUNCTION public.retificar_transferencia_cubas(bigint, bigint[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.retificar_transferencia_cubas(bigint, bigint[]) TO authenticated;
