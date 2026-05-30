DO $$
DECLARE
    v_insumo_id UUID; -- (ou BIGINT, o Postgres fará o cast automático)
    v_origem TEXT;
    v_destino TEXT;
    v_data DATE;
    v_quantidade NUMERIC;
    -- Suas unidades disponíveis:
    v_unidades TEXT[] := ARRAY['Compras', 'Fábrica', 'Estoque MH', 'Loja Ahú', 'Loja Alto XV', 'Descarte'];
    i INTEGER;
BEGIN
    FOR i IN 1..1000 LOOP
        -- Selecionar um ID de insumo existente de forma aleatória
        SELECT id INTO v_insumo_id FROM cadastro_insumos ORDER BY random() LIMIT 1;
        
        -- Prevenção de erro caso a tabela de insumos esteja vazia
        IF v_insumo_id IS NULL THEN
            RAISE NOTICE 'Nenhum insumo encontrado. Insira insumos primeiro.';
            EXIT;
        END IF;

        -- Escolher origem e destino aleatórios
        v_origem := v_unidades[floor(random() * array_length(v_unidades, 1) + 1)];
        v_destino := v_unidades[floor(random() * array_length(v_unidades, 1) + 1)];
        
        -- Garantir que a origem seja diferente do destino
        WHILE v_origem = v_destino LOOP
            v_destino := v_unidades[floor(random() * array_length(v_unidades, 1) + 1)];
        END LOOP;

        -- Gerar uma data aleatória retroativa (nos últimos 365 dias)
        v_data := current_date - (floor(random() * 365) || ' days')::interval;
        
        -- Gerar uma quantidade aleatória inteira entre 1 e 50
        v_quantidade := floor(random() * 50 + 1);

        -- Inserir a movimentação na tabela
        INSERT INTO movimentacoes_estoque (insumo_id, data_movimentacao, quantidade, origem, destino)
        VALUES (v_insumo_id, v_data, v_quantidade, v_origem, v_destino);
    END LOOP;
END $$;
