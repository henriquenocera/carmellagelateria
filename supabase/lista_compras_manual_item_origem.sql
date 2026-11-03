ALTER TABLE public.lista_compras_manual_itens
  ADD COLUMN IF NOT EXISTS origem TEXT NOT NULL DEFAULT 'Manual';

ALTER TABLE public.lista_compras_manual_itens
  DROP CONSTRAINT IF EXISTS lista_compras_manual_itens_origem_check;

ALTER TABLE public.lista_compras_manual_itens
  ADD CONSTRAINT lista_compras_manual_itens_origem_check
  CHECK (origem IN ('Estoque', 'Estoque MH', 'Loja Ahú', 'Loja Alto XV', 'Fábrica', 'Produção', 'Manual'));
