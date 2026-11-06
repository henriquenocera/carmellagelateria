ALTER TABLE public.producao_realizada
  ADD COLUMN IF NOT EXISTS categoria_producao text NOT NULL DEFAULT 'Gelato',
  ADD COLUMN IF NOT EXISTS quantidade integer,
  ADD COLUMN IF NOT EXISTS cliente text,
  ADD COLUMN IF NOT EXISTS embalagem text,
  ADD COLUMN IF NOT EXISTS quantidade_embalagem integer;

UPDATE public.producao_realizada
SET categoria_producao = 'Gelato'
WHERE categoria_producao IS NULL;

CREATE INDEX IF NOT EXISTS producao_realizada_categoria_producao_idx
  ON public.producao_realizada (categoria_producao);
