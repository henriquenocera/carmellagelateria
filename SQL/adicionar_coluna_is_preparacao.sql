ALTER TABLE public.cadastro_produtos
ADD COLUMN IF NOT EXISTS is_preparacao BOOLEAN DEFAULT false;
