ALTER TABLE public.ordem_producao ADD COLUMN IF NOT EXISTS data_producao date;
ALTER TABLE public.ordem_producao ADD COLUMN IF NOT EXISTS peso_bruto numeric;
ALTER TABLE public.ordem_producao ADD COLUMN IF NOT EXISTS tara numeric;
