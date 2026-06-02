ALTER TABLE public.lista_compras_manual
ADD COLUMN IF NOT EXISTS comprado BOOLEAN DEFAULT false;
