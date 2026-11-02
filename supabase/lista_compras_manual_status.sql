-- Execute se a estrutura de lista_compras_manual já tiver sido criada.
ALTER TABLE public.lista_compras_manual
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS criado_por TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Aberta';

ALTER TABLE public.lista_compras_manual
  DROP CONSTRAINT IF EXISTS lista_compras_manual_status_check;

ALTER TABLE public.lista_compras_manual
  ADD CONSTRAINT lista_compras_manual_status_check
  CHECK (status IN ('Aberta', 'Fechada'));
