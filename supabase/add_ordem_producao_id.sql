ALTER TABLE public.producao_realizada ADD COLUMN IF NOT EXISTS ordem_producao_id uuid REFERENCES public.ordem_producao(id) ON DELETE SET NULL;
