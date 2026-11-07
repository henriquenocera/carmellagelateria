-- Execute no banco antes de usar a confirmação de transferências no aplicativo.
CREATE OR REPLACE FUNCTION public.concluir_transferencia_cubas(p_transferencia_id bigint, p_cubas_ids bigint[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer public.transferencias_cubas%ROWTYPE;
  v_cuba public.producao_realizada%ROWTYPE;
  v_allowed_ids bigint[];
  v_email text;
  v_count integer := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'É necessário estar autenticado.';
  END IF;

  SELECT * INTO v_transfer FROM public.transferencias_cubas
  WHERE id = p_transferencia_id FOR UPDATE;
  IF NOT FOUND OR v_transfer.status <> 'Pendente' THEN
    RAISE EXCEPTION 'Esta transferência não está pendente.';
  END IF;
  IF v_transfer.destino NOT IN ('Loja Ahu', 'Loja Alto XV') THEN
    RAISE EXCEPTION 'O destino desta transferência não é uma loja válida.';
  END IF;
  IF p_cubas_ids IS NULL OR cardinality(p_cubas_ids) = 0
     OR array_position(p_cubas_ids, NULL) IS NOT NULL
     OR (SELECT count(DISTINCT cuba_id) FROM unnest(p_cubas_ids) AS ids(cuba_id)) <> cardinality(p_cubas_ids) THEN
    RAISE EXCEPTION 'Selecione ao menos uma cuba, sem repetições.';
  END IF;

  IF cardinality(v_transfer.cubas_ids) > 0 THEN
    v_allowed_ids := v_transfer.cubas_ids;
  ELSE
    SELECT coalesce(array_agg(id), '{}'::bigint[]) INTO v_allowed_ids
    FROM public.producao_realizada WHERE transferencia_cubas_id = p_transferencia_id;
  END IF;
  IF NOT p_cubas_ids <@ v_allowed_ids THEN
    RAISE EXCEPTION 'Há cubas que não pertencem a esta transferência.';
  END IF;

  v_email := coalesce(auth.jwt() ->> 'email', 'A definir');
  FOR v_cuba IN SELECT * FROM public.producao_realizada
    WHERE id = ANY(p_cubas_ids) ORDER BY id FOR UPDATE
  LOOP
    IF v_cuba.data_entrada IS NOT NULL OR v_cuba.destino IS NOT NULL OR v_cuba.data_producao IS NULL THEN
      RAISE EXCEPTION 'Uma das cubas já foi transferida ou não está disponível.';
    END IF;
    IF v_transfer.destino = 'Loja Ahu' THEN
      INSERT INTO public.cardsahu (title, status, production_date, entry_date, created_by, last_edited_by, transferencia_cubas_id, history)
      SELECT nome, 'freezer-estoque', v_cuba.data_producao, NULL, v_email, v_email, p_transferencia_id,
        jsonb_build_array(jsonb_build_object('user', v_email, 'action', 'Criado no Estoque', 'timestamp', now()))
      FROM public.cadastro_produtos WHERE id = v_cuba.produto_id;
    ELSE
      INSERT INTO public.cardsaltoxv (title, status, production_date, entry_date, created_by, last_edited_by, transferencia_cubas_id, history)
      SELECT nome, 'freezer-estoque', v_cuba.data_producao, NULL, v_email, v_email, p_transferencia_id,
        jsonb_build_array(jsonb_build_object('user', v_email, 'action', 'Criado no Estoque', 'timestamp', now()))
      FROM public.cadastro_produtos WHERE id = v_cuba.produto_id;
    END IF;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produto da cuba não encontrado.';
    END IF;

    UPDATE public.producao_realizada SET data_entrada = CURRENT_DATE, destino = v_transfer.destino,
      transferencia_cubas_id = p_transferencia_id WHERE id = v_cuba.id;
    v_count := v_count + 1;
  END LOOP;
  IF v_count <> cardinality(p_cubas_ids) THEN
    RAISE EXCEPTION 'Uma ou mais cubas não foram encontradas.';
  END IF;

  UPDATE public.producao_realizada SET transferencia_cubas_id = NULL
  WHERE transferencia_cubas_id = p_transferencia_id AND id <> ALL(p_cubas_ids);
  UPDATE public.transferencias_cubas SET cubas_ids = p_cubas_ids, status = 'Concluída'
  WHERE id = p_transferencia_id;
END;
$$;

REVOKE ALL ON FUNCTION public.concluir_transferencia_cubas(bigint, bigint[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.concluir_transferencia_cubas(bigint, bigint[]) TO authenticated;
