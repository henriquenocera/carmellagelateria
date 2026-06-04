-- Create table for Ordem de Produção
CREATE TABLE IF NOT EXISTS public.ordem_producao (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id uuid NOT NULL REFERENCES public.cadastro_produtos(id) ON DELETE CASCADE,
  data_ordem date NOT NULL,
  quantidade numeric NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ordem_producao_produto_data_key UNIQUE (produto_id, data_ordem)
);

-- RLS policies
ALTER TABLE public.ordem_producao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all authenticated users" ON public.ordem_producao
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON public.ordem_producao
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON public.ordem_producao
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON public.ordem_producao
  FOR DELETE USING (auth.uid() IS NOT NULL);
