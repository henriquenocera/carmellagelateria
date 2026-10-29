ALTER TABLE public.ordem_producao
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Aberto';

ALTER TABLE public.ordem_producao
  ADD COLUMN IF NOT EXISTS dia_semana smallint,
  ADD COLUMN IF NOT EXISTS ordem_dia integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ordem_producao_status_check'
      AND conrelid = 'public.ordem_producao'::regclass
  ) THEN
    ALTER TABLE public.ordem_producao
      ADD CONSTRAINT ordem_producao_status_check
      CHECK (status IN ('Aberto', 'Fechado'));
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ordem_producao_dia_semana_check'
      AND conrelid = 'public.ordem_producao'::regclass
  ) THEN
    ALTER TABLE public.ordem_producao
      ADD CONSTRAINT ordem_producao_dia_semana_check
      CHECK (dia_semana IS NULL OR dia_semana BETWEEN 1 AND 7);
  END IF;
END;
$$;
