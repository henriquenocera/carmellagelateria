ALTER TABLE public.producao_realizada
  ADD COLUMN IF NOT EXISTS importado_automaticamente BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ordem_producao_item_id TEXT,
  ADD COLUMN IF NOT EXISTS data_ordem_producao DATE;

ALTER TABLE public.producao_realizada
  ALTER COLUMN data_producao DROP NOT NULL;

ALTER TABLE public.producao_realizada
  ALTER COLUMN codigo DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS producao_realizada_ordem_producao_item_id_uidx
  ON public.producao_realizada (ordem_producao_item_id)
  WHERE ordem_producao_item_id IS NOT NULL;

UPDATE public.producao_realizada AS realizada
SET data_ordem_producao = ordem.data_ordem
FROM public.ordem_producao AS ordem
WHERE realizada.data_ordem_producao IS NULL
  AND realizada.ordem_producao_item_id IS NOT NULL
  AND split_part(realizada.ordem_producao_item_id, ':', 1) = ordem.id::TEXT;

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'delete-expired-auto-production-imports',
  '*/15 * * * *',
  $$DELETE FROM public.producao_realizada
    WHERE importado_automaticamente = TRUE
      AND data_producao IS NULL
      AND created_at < NOW() - INTERVAL '10 days';$$
);
