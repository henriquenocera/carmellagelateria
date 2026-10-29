ALTER TABLE public.ordem_producao
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Aberto';

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
